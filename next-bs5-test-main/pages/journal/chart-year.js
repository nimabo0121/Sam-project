import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// 註冊 chart.js 插件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function ChartYear() {
  const [monthData, setMonthData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCalories, setTotalCalories] = useState(0)

  // 取得當前年份
  const currentYear = new Date().getFullYear()

  // 建立全年月份清單 (YYYY-MM)
  const getFullMonthList = () => {
    const months = []
    for (let i = 0; i < 12; i++) {
      const month = `${currentYear}-${String(i + 1).padStart(2, '0')}`
      months.push(month)
    }
    return months
  }

  const fullMonthList = getFullMonthList()

  // 計算當年範圍
  const getYearDateRange = () => {
    const startDate = `${currentYear}-01-01`
    const endDate = `${currentYear}-12-31`
    return { startDate, endDate }
  }

  const { startDate, endDate } = getYearDateRange()

  useEffect(() => {
    // 獲取當年資料
    axios
      .get('http://localhost:3005/api/healthy/records', {
        params: {
          period: 'year',
          startDate,
          endDate,
          t: new Date().getTime(),
        },
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const data = response.data.data || []
        setMonthData(data)

        // 計算總熱量
        const total = data.reduce((sum, item) => sum + item.batch_sum, 0)
        setTotalCalories(total)

        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }, [currentYear, startDate, endDate])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!Array.isArray(monthData) || monthData.length === 0)
    return <div>今年無數據</div>

  // 整理資料，按月加總
  const aggregatedData = monthData.reduce((acc, item) => {
    const month = item.batch_date?.slice(0, 7) // 使用 Optional Chaining
    if (!month) return acc // 若 `month` 為 falsy 值，跳過處理
    acc[month] = (acc[month] || 0) + item.batch_sum
    return acc
  }, {})

  // 補充缺少月份的數據為 0
  const completeData = fullMonthList.map((month) => ({
    month,
    batch_sum:
      typeof aggregatedData[month] === 'number' ? aggregatedData[month] : 0,
  }))

  // 準備圖表資料
  const chartData = {
    labels: completeData.map((item) => item.month), // 年-月作為 x 軸標籤
    datasets: [
      {
        label: '每月熱量 (kcal)',
        data: completeData.map((item) => item.batch_sum),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  }

  // 配置 Tooltips 顯示每個 batch 的資訊
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const month = tooltipItem.label
            const sum = aggregatedData[month] ?? 0 // 使用 Nullish Coalescing 運算子
            return `總熱量: ${sum} kcal`
          },
        },
      },
    },
  }

  return (
    <div style={{ height: '350px', width: '100%' }}>
      <div>
        <strong>
          {currentYear} 總熱量：{totalCalories} kcal
        </strong>
      </div>
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}
