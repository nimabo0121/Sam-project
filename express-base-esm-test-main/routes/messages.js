import express from 'express'
import sequelize from '#configs/db.js' // 連線資料庫
import authenticate from '#middlewares/authenticate.js' // 中介軟體，存取隱私會員資料用

const router = express.Router()

// 發送訊息的路由
router.post('/', authenticate, async (req, res) => {
  const currentUserId = req.user.id // 當前用戶 ID
  const { receiverId, message } = req.body // 接收者 ID 和訊息內容

  // 檢查接收者 ID 和訊息內容是否存在
  if (!receiverId || !message) {
    return res.status(400).json({
      status: 'fail',
      message: '接收者 ID 和訊息內容是必需的',
    })
  }

  try {
    // 儲存訊息到資料庫
    const [result] = await sequelize.query(
      `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`,
      {
        replacements: [currentUserId, receiverId, message],
      }
    )

    // 返回成功響應
    return res.status(201).json({
      status: 'success',
      data: {
        id: result.insertId, // 返回訊息 ID
        sender_id: currentUserId,
        receiver_id: receiverId,
        message,
      },
    })
  } catch (err) {
    console.error('發送訊息時出錯:', err)
    return res.status(500).json({
      status: 'error',
      message: '發送訊息時出錯: ' + (err.message || '未知錯誤'),
    })
  }
})
// 獲取聊天記錄的路由
router.get('/:friendId', authenticate, async (req, res) => {
  const currentUserId = req.user.id // 當前用戶的 ID
  const friendId = req.params.friendId // 好友 ID

  try {
    // 獲取與好友的聊天記錄，包含發送者姓名和頭像
    const [messages] = await sequelize.query(
      `SELECT m.id, m.message, m.sender_id, m.receiver_id, u.name AS sender_name, u.avatar AS sender_avatar 
     FROM messages m 
     JOIN user u ON m.sender_id = u.id 
     WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?) 
     ORDER BY m.created_at ASC`,
      {
        replacements: [currentUserId, friendId, friendId, currentUserId],
      }
    )

    return res.status(200).json({
      status: 'success',
      data: messages, // 返回聊天記錄
    })
  } catch (err) {
    console.error('獲取聊天記錄時出錯:', err.message)
    return res.status(500).json({
      status: 'error',
      message: '獲取聊天記錄時出錯: ' + (err.message || '未知錯誤'),
    })
  }
})

export default router
