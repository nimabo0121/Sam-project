import express from 'express'
import sequelize from '#configs/db.js' // 連線資料庫
import authenticate from '#middlewares/authenticate.js' // 中介軟體，存取隱私會員資料用

const router = express.Router()
// 同意好友請求的路由
router.post('/accept', authenticate, async (req, res) => {
  const currentUserId = req.user.id // 當前用戶 ID
  const { friendId } = req.body // 要同意的好友 ID

  // 檢查 friendId 是否存在
  if (!friendId) {
    return res.status(400).json({
      status: 'fail',
      message: '好友 ID 是必需的',
    })
  }

  try {
    // 查找狀態為 'pending' 的好友請求
    const [friendRequest] = await sequelize.query(
      `
      SELECT * FROM friends
      WHERE user_id = ? AND friend_id = ? AND status = 'pending'
      `,
      {
        replacements: [friendId, currentUserId], // 查詢對方對當前用戶發出的請求
      }
    )

    // 檢查是否找到對應的請求
    if (friendRequest.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: '未找到待處理的好友請求',
      })
    }

    // 更新好友請求狀態為 'accepted'
    await sequelize.query(
      `
      UPDATE friends
      SET status = 'accepted'
      WHERE user_id = ? AND friend_id = ? AND status = 'pending'
      `,
      {
        replacements: [friendId, currentUserId], // 更新好友請求狀態
      }
    )

    // 新建一條雙向的好友關係 (即當前用戶也成為對方的好友)
    await sequelize.query(
      `
      INSERT INTO friends (user_id, friend_id, status)
      VALUES (?, ?, 'accepted')
      `,
      {
        replacements: [currentUserId, friendId], // 插入新的好友關係
      }
    )

    // 返回成功響應
    return res.status(200).json({
      status: 'success',
      message: '好友請求已接受，雙方現在互為好友',
    })
  } catch (err) {
    console.error('同意好友請求時出錯:', err.message)
    return res.status(500).json({
      status: 'error',
      message: '同意好友請求時出錯: ' + (err.message || '未知錯誤'),
    })
  }
})

// 拒絕好友請求的路由
router.delete('/reject', authenticate, async (req, res) => {
  const currentUserId = req.user.id // 當前用戶 ID
  const { friendId } = req.body // 要拒絕的好友 ID

  // 檢查 friendId 是否存在
  if (!friendId) {
    return res.status(400).json({
      status: 'fail',
      message: '好友 ID 是必需的',
    })
  }

  try {
    // 刪除狀態為 'pending' 的好友請求
    const [result] = await sequelize.query(
      `
      DELETE FROM friends
      WHERE user_id = ? AND friend_id = ? AND status = 'pending'
      `,
      {
        replacements: [friendId, currentUserId], // 刪除符合條件的好友請求
      }
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: '未找到待處理的好友請求',
      })
    }

    // 返回成功響應
    return res.status(200).json({
      status: 'success',
      message: '好友請求已拒絕',
    })
  } catch (err) {
    console.error('拒絕好友請求時出錯:', err.message)
    return res.status(500).json({
      status: 'error',
      message: '拒絕好友請求時出錯: ' + (err.message || '未知錯誤'),
    })
  }
})

// 好友清單的路由---accepted
router.get('/accepted', authenticate, async (req, res) => {
  const currentUserId = req.user.id // 當前用戶的 ID

  try {
    // 查詢好友狀態為 'accepted' 的好友記錄
    const [acceptedRequests] = await sequelize.query(
      `
      SELECT u.id, u.name, f.status ,u.avatar
      FROM friends f
      JOIN user u ON f.user_id = u.id
      WHERE f.friend_id = ? AND f.status = 'accepted'
      `,
      {
        replacements: [currentUserId], // 用當前用戶的 ID 替換參數
      }
    )

    if (acceptedRequests.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: '沒有好友',
        data: [], // 返回空數組
      })
    }

    return res.status(200).json({
      status: 'success',
      data: acceptedRequests, // 返回所有好友
    })
  } catch (err) {
    console.error('獲取好友請求清單時出錯:', err.message)
    return res.status(500).json({
      status: 'error',
      message: '獲取好友請求清單時出錯: ' + (err.message || '未知錯誤'),
    })
  }
})
// 好友請求清單的路由---pending
router.get('/pending', authenticate, async (req, res) => {
  const currentUserId = req.user.id // 當前用戶的 ID

  try {
    // 查詢好友請求狀態為 'pending' 的好友記錄
    const [pendingRequests] = await sequelize.query(
      `
      SELECT u.id, u.name, f.status 
      FROM friends f
      JOIN user u ON f.user_id = u.id
      WHERE f.friend_id = ? AND f.status = 'pending'
      `,
      {
        replacements: [currentUserId], // 用當前用戶的 ID 替換參數
      }
    )

    if (pendingRequests.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: '沒有等待回應的好友請求',
        data: [], // 返回空數組
      })
    }

    return res.status(200).json({
      status: 'success',
      data: pendingRequests, // 返回所有等待回應的好友請求
    })
  } catch (err) {
    console.error('獲取好友請求清單時出錯:', err.message)
    return res.status(500).json({
      status: 'error',
      message: '獲取好友請求清單時出錯: ' + (err.message || '未知錯誤'),
    })
  }
})

// 添加好友的路由
router.post('/add', authenticate, async (req, res) => {
  const userId = req.body.userId // 要添加的好友的用戶 ID
  const currentUserId = req.user.id // 當前用戶 ID，從 authenticate 中介軟體中獲取

  // 檢查 userId 是否存在
  if (!userId) {
    return res.status(400).json({
      status: 'fail',
      message: '用戶 ID 是必需的',
    })
  }

  // 檢查 currentUserId 是否存在
  if (!currentUserId) {
    return res.status(401).json({
      status: 'fail',
      message: '未授權的請求',
    })
  }

  console.log('當前用戶 ID:', currentUserId)
  console.log('要添加的用戶 ID:', userId)

  try {
    // 檢查該用戶的好友關係狀態
    const [friendRelationship] = await sequelize.query(
      'SELECT status FROM friends WHERE user_id = ? AND friend_id = ?',
      {
        replacements: [currentUserId, userId],
      }
    )

    // 判斷用戶的關係狀態
    if (friendRelationship.length > 0) {
      const status = friendRelationship[0].status // 獲取關係狀態

      // 根據 status 給予不同提示
      switch (status) {
        case 'accepted':
          return res.status(400).json({
            status: 'fail',
            message: '該用戶已經是你的好友',
          })
        case 'pending':
          return res.status(400).json({
            status: 'fail',
            message: '你已向該用戶發送了好友請求，請等待對方接受',
          })
        case 'blocked':
          return res.status(400).json({
            status: 'fail',
            message: '你已經封鎖了該用戶，無法再次添加',
          })
        default:
          return res.status(400).json({
            status: 'fail',
            message: '未知的好友狀態',
          })
      }
    }

    // 添加好友邏輯
    await sequelize.query(
      'INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)',
      {
        replacements: [currentUserId, userId, 'pending'], // 添加好友時預設狀態為 pending
      }
    )

    // 返回成功信息
    return res.status(200).json({
      status: 'success',
      data: {
        friend: {
          id: userId, // 返回要添加的用戶 ID
          user_id: currentUserId,
          friend_id: userId,
          status: 'pending', // 返回添加的好友狀態
        },
      },
    })
  } catch (err) {
    console.error('添加好友時出錯:', err.message) // 紀錄錯誤信息
    return res.status(500).json({
      status: 'error',
      message: '添加好友時出錯: ' + (err.message || '未知錯誤'),
    })
  }
})

// 將路由導出
export default router
