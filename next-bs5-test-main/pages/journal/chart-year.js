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
  const [yearData, setYearData] = useState([]) // 儲存資料
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCalories, setTotalCalories] = useState(0)
  const [totalProtein, setTotalProtein] = useState(0)
  const [monthOffset, setMonthOffset] = useState(0) // 月份偏移量

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() + monthOffset // 計算當前年份（根據偏移量）

  // 計算年範圍
  const getYearDateRange = () => {
    const startDate = `${currentYear}-01-01`
    const endDate = `${currentYear}-12-31`
    return { startDate, endDate }
  }

  const { startDate, endDate } = getYearDateRange()

  useEffect(() => {
    setLoading(true)
    axios
      .get('http://localhost:3005/api/healthy/records', {
        params: {
          period: 'year', // 設定查詢為年範圍
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
        setYearData(data)

        // 計算總熱量與蛋白質
        const totalCalories = data.reduce(
          (sum, item) => sum + item.batch_sum,
          0
        )
        const totalProtein = data.reduce(
          (sum, item) => sum + (item.batch_p_sum || 0),
          0
        )

        setTotalCalories(totalCalories)
        setTotalProtein(totalProtein)

        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }, [startDate, endDate])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!Array.isArray(yearData) || yearData.length === 0)
    return (
      <div className="container" style={{ height: '350px', width: '100%' }}>
        <div className="row" style={{ height: '24px' }}>
          <div className="col-4"></div>
          <div className="col-4 text-center">
            <button
              className="btn btn-sm"
              onClick={() => setMonthOffset((prev) => prev - 1)} // 上一年
            >
              上一年
            </button>
            <strong className="">
              {startDate.slice(0, 7)} - {endDate.slice(0, 7)}
            </strong>
            <button
              className="btn btn-sm"
              onClick={() => setMonthOffset((prev) => prev + 1)} // 下一年
            >
              下一年
            </button>
          </div>
          <div className="col-4"></div>
        </div>
        <div>今年無數據...</div>
      </div>
    )

  // 整理資料，按月加總
  const aggregatedData = yearData.reduce((acc, item) => {
    const month = item.batch_date?.slice(0, 7) // 使用 Optional Chaining
    if (!month) return acc // 若 `month` 為 falsy 值，跳過處理
    acc[month] = {
      calories: (acc[month]?.calories || 0) + item.batch_sum,
      protein: (acc[month]?.protein || 0) + (item.batch_p_sum || 0),
    }
    return acc
  }, {})

  // 補充缺少月份的數據為 0
  const fullMonthList = Array.from(
    { length: 12 },
    (_, index) => `${currentYear}-${String(index + 1).padStart(2, '0')}` // 補充月份格式
  )

  const completeData = fullMonthList.map((month) => ({
    month,
    batch_sum:
      typeof aggregatedData[month]?.calories === 'number'
        ? aggregatedData[month].calories
        : 0,
    batch_p_sum:
      typeof aggregatedData[month]?.protein === 'number'
        ? aggregatedData[month].protein
        : 0,
  }))

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
      {
        label: '每月蛋白質 (g)',
        data: completeData.map((item) => item.batch_p_sum),
        borderColor: 'rgb(153, 102, 255)', // 蛋白質的線條顏色
        tension: 0.1,
        fill: false,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const month = tooltipItem.label
            const calorieSum = aggregatedData[month]?.calories ?? 0
            const proteinSum = aggregatedData[month]?.protein ?? 0
            return `總熱量: ${calorieSum} kcal / 總蛋白質: ${proteinSum} g`
          },
        },
      },
    },
  }
  return (
    <div className="container" style={{ height: '350px', width: '100%' }}>
      <div className="row" style={{ height: '24px' }}>
        <div className="col-4">
          <strong>
            {currentYear} 總熱量：{totalCalories} kcal / 蛋白質：{totalProtein}{' '}
            g
          </strong>
        </div>

        <div className="col-4 text-center">
          <button
            className="btn btn-sm"
            onClick={() => setMonthOffset((prev) => prev - 1)} // 上一年
          >
            上一年
          </button>
          <strong className="">
            {startDate.slice(0, 7)} - {endDate.slice(0, 7)}
          </strong>
          <button
            className="btn btn-sm"
            onClick={() => setMonthOffset((prev) => prev + 1)} // 下一年
          >
            下一年
          </button>
        </div>
        <div className="col-4"></div>
      </div>

      <Line data={chartData} options={chartOptions} />
    </div>
  )
}
