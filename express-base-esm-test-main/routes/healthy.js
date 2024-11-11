import express from 'express'
import sequelize from '#configs/db.js' // 連線資料庫
import authenticate from '#middlewares/authenticate.js' // 中介軟體，存取隱私會員資料用
import { Op } from 'sequelize'

const router = express.Router()

// 發送訊息的路由
router.post('/', authenticate, async (req, res) => {
  const currentUserId = req.user.id // 當前用戶 ID

  try {
    const { items, notes, recordDate } = req.body

    // 計算食物熱量總和
    const totalCalories = items.reduce((total, item) => {
      const calories = parseInt(item.calories.replace('kcal', '').trim(), 10)
      return total + (isNaN(calories) ? 0 : calories)
    }, 0)

    // 計算食物蛋白質總和
    const totalProtein = items.reduce((total, item) => {
      const protein = parseInt(item.protein.replace('g', '').trim(), 10)
      return total + (isNaN(protein) ? 0 : protein)
    }, 0)

    // 開始插入資料前，先儲存一個健康記錄的批次
    const batchResult = await sequelize.query(
      `INSERT INTO healthy_batch (healthy_id, batch_sum, batch_p_sum, batch_name, batch_date, created_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      {
        replacements: [
          currentUserId,
          totalCalories,
          totalProtein,
          notes,
          recordDate,
          recordDate,
        ],
        type: sequelize.QueryTypes.INSERT, // 使用 INSERT 操作
      }
    )

    // 取得剛剛插入的批次 ID
    const batchId = batchResult[0]

    // 插入食物記錄
    const insertPromises = items.map((item) =>
      sequelize.query(
        `INSERT INTO healthy (healthy_id, batch_id, healthy_name, healthy_calories, healthy_protein, protein_sum, healthy_sum, notes, record_date, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [
            currentUserId,
            batchId, // 關聯到剛插入的批次
            item.name,
            parseInt(item.calories.replace('kcal', '').trim(), 10),
            parseInt(item.protein.replace('g', '').trim(), 10),
            totalProtein,
            totalCalories,
            notes,
            recordDate,
            new Date(), // 當前時間作為創建時間
          ],
        }
      )
    )

    await Promise.all(insertPromises)

    return res.status(201).json({
      status: 'success',
      message: '資料儲存成功',
    })
  } catch (err) {
    console.error('發送資料時出錯:', err)
    return res.status(500).json({
      status: 'error',
      message: '儲存資料時出錯: ' + (err.message || '未知錯誤'),
    })
  }
})

// 查詢健康日記資料，並根據時間範圍（年、季、月、周、日）分類
router.get('/records', authenticate, async (req, res) => {
  const currentUserId = req.user.id
  const { period, startDate, endDate, season } = req.query

  if (!startDate || !endDate) {
    return res.status(400).json({
      status: 'error',
      message: '請提供有效的 startDate 和 endDate。',
    })
  }

  try {
    const whereCondition = {
      healthy_id: currentUserId,
      record_date: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    }

    if (period) {
      switch (period) {
        case 'year':
          whereCondition.record_date = {
            [Op.gte]: `${startDate}-01-01`,
            [Op.lte]: `${endDate}-12-31`,
          }
          break
        case 'season':
          const seasons = {
            1: ['01-01', '03-31'],
            2: ['04-01', '06-30'],
            3: ['07-01', '09-30'],
            4: ['10-01', '12-31'],
          }
          if (season && seasons[season]) {
            whereCondition.batch_date = {
              [Op.gte]: `${endDate}-${seasons[season][0]}`,
              [Op.lte]: `${endDate}-${seasons[season][1]}`,
            }
          }
          break
        case 'month':
          whereCondition.batch_date = {
            [Op.gte]: `${startDate}-01`,
            [Op.lte]: `${endDate}-31`,
          }
          break
        case 'week':
        case 'day':
          whereCondition.record_date = {
            [Op.gte]: startDate,
            [Op.lte]: endDate,
          }
          break
        default:
          break
      }
    }

    const records = await sequelize.query(
      `SELECT * FROM healthy_batch WHERE healthy_id = ? AND batch_date BETWEEN ? AND ?`,
      {
        replacements: [currentUserId, startDate, endDate],
        type: sequelize.QueryTypes.SELECT,
      }
    )

    return res.status(200).json({
      status: 'success',
      data: records,
    })
  } catch (err) {
    console.error('查詢資料時出錯:', err)
    return res.status(500).json({
      status: 'error',
      message: '查詢資料時出錯: ' + (err.message || '未知錯誤'),
    })
  }
})

// 儲存標籤的路由
router.post('/labelset', authenticate, async (req, res) => {
  const currentUserId = req.user.id // 當前用戶 ID
  const { label_name } = req.body // 從請求中獲取 label_name

  if (!label_name) {
    return res.status(400).json({ message: '標籤名稱不能為空' }) // 檢查是否提供了 label_name
  }

  try {
    // 執行 SQL 插入操作
    const batchResult = await sequelize.query(
      `INSERT INTO batch_label (label_id, label_name) VALUES (?, ?)`,
      {
        replacements: [currentUserId, label_name],
        type: sequelize.QueryTypes.INSERT, // 使用 INSERT 操作
      }
    )
    // 回應成功訊息
    res.status(201).json({ message: '標籤儲存成功', data: batchResult })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: '儲存標籤時出現錯誤', error: error.message })
  }
})

// 取得用戶的所有標籤資料
router.get('/labelget', authenticate, async (req, res) => {
  const currentUserId = req.user.id // 當前用戶 ID

  try {
    // 查詢用戶所有的標籤資料
    const batchLabels = await sequelize.query(
      `SELECT id, label_id, label_name FROM batch_label WHERE label_id = ?`,
      {
        replacements: [currentUserId],
        type: sequelize.QueryTypes.SELECT, // 查詢操作
      }
    )

    // 檢查查詢結果
    if (batchLabels.length === 0) {
      return res.status(404).json({ message: '沒有找到標籤資料' })
    }

    // 回傳標籤資料
    res.status(200).json({ message: '標籤資料獲取成功', data: batchLabels })
  } catch (error) {
    console.error(error) // 輸出詳細錯誤訊息
    res
      .status(500)
      .json({ message: '獲取標籤資料時出現錯誤', error: error.message })
  }
})

// 更新標籤名稱的路由
router.put('/labelset/:id', authenticate, async (req, res) => {
  const currentUserId = req.user.id // 當前用戶 ID
  const { id } = req.params // 標籤 ID
  const { label_name } = req.body // 從請求中獲取 label_name

  if (!label_name) {
    return res.status(400).json({ message: '標籤名稱不能為空' }) // 檢查是否提供了 label_name
  }

  try {
    // 檢查標籤是否存在
    const [existingLabel] = await sequelize.query(
      `SELECT * FROM batch_label WHERE id = ? AND label_id = ?`,
      {
        replacements: [id, currentUserId],
        type: sequelize.QueryTypes.SELECT,
      }
    )

    if (!existingLabel) {
      return res.status(404).json({ message: '標籤不存在或無權修改' })
    }

    // 執行更新操作
    await sequelize.query(
      `UPDATE batch_label SET label_name = ? WHERE id = ?`,
      {
        replacements: [label_name, id],
        type: sequelize.QueryTypes.UPDATE,
      }
    )

    res.status(200).json({ message: '標籤名稱更新成功' })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: '更新標籤名稱時出現錯誤', error: error.message })
  }
})
// 刪除標籤的路由
router.delete('/labelset/:id', authenticate, async (req, res) => {
  const currentUserId = req.user.id // 當前用戶 ID
  const { id } = req.params // 標籤 ID，從 URL 參數獲取

  try {
    // 檢查標籤是否存在且屬於當前使用者
    const [existingLabel] = await sequelize.query(
      `SELECT * FROM batch_label WHERE id = ? AND label_id = ?`,
      {
        replacements: [id, currentUserId],
        type: sequelize.QueryTypes.SELECT,
      }
    )

    // 如果標籤不存在或不是當前使用者的標籤
    if (!existingLabel) {
      return res.status(404).json({ message: '標籤不存在或無權刪除' })
    }

    // 刪除標籤
    await sequelize.query(`DELETE FROM batch_label WHERE id = ?`, {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    })

    // 回應成功訊息
    res.status(200).json({ message: '標籤刪除成功' })
  } catch (error) {
    console.error(error) // 輸出錯誤訊息
    res
      .status(500)
      .json({ message: '刪除標籤時出現錯誤', error: error.message })
  }
})

export default router
