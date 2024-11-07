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

    // 開始插入資料前，先儲存一個健康記錄的批次
    const batchResult = await sequelize.query(
      `INSERT INTO healthy_batch (healthy_id, batch_sum, batch_name, batch_date, created_at) 
       VALUES (?, ?, ?, ?, ?)`,
      {
        replacements: [
          currentUserId,
          totalCalories,
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
        `INSERT INTO healthy (healthy_id, batch_id, healthy_name, healthy_calories, healthy_sum, notes, record_date, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        {
          replacements: [
            currentUserId,
            batchId, // 關聯到剛插入的批次
            item.name,
            parseInt(item.calories.replace('kcal', '').trim(), 10),
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

export default router
