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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function ChartWeek() {
  const [weekData, setWeekData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCalories, setTotalCalories] = useState(0)
  const [totalProtein, setTotalProtein] = useState(0)
  const [weekOffset, setWeekOffset] = useState(0) // 新增週次偏移量

  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // 計算週日期範圍
  const getWeekDateRange = () => {
    const dayOfWeek = currentDate.getDay()
    const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek

    const endDate = new Date(
      currentYear,
      currentMonth,
      currentDay + diffToSunday + weekOffset * 7
    )
    const startDate = new Date(endDate)
    startDate.setDate(endDate.getDate() - 6)

    return {
      startDate: `${startDate.getFullYear()}-${String(
        startDate.getMonth() + 1
      ).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`,
      endDate: `${endDate.getFullYear()}-${String(
        endDate.getMonth() + 1
      ).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`,
    }
  }

  const { startDate, endDate } = getWeekDateRange()

  const generateWeekDates = (start, end) => {
    const dates = []
    const current = new Date(start)
    while (current <= new Date(end)) {
      dates.push(
        `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(
          2,
          '0'
        )}-${String(current.getDate()).padStart(2, '0')}`
      )
      current.setDate(current.getDate() + 1)
    }
    return dates
  }

  useEffect(() => {
    setLoading(true)
    axios
      .get('http://localhost:3005/api/healthy/records', {
        params: {
          period: 'week',
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
        setWeekData(data)

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
  if (!Array.isArray(weekData) || weekData.length === 0)
    return (
      <div className="container" style={{ height: '350px', width: '100%' }}>
        <div className="row" style={{ height: '24px' }}>
          <div className="col-4">
            {/* <strong>
              本周總熱量：{totalCalories} kcal / 蛋白質：{totalProtein} g
            </strong> */}
          </div>

          <div className="col-4 text-center">
            <button
              className="btn btn-sm"
              onClick={() => setWeekOffset((prev) => prev - 1)}
            >
              上一週
            </button>
            <strong className="">
              {startDate} - {endDate}
            </strong>
            <button
              className="btn btn-sm"
              onClick={() => setWeekOffset((prev) => prev + 1)}
            >
              下一週
            </button>
          </div>
          
        <div className="col-4"></div>
        </div>
        <div>本周無數據...</div>
      </div>
    )

  const weekDates = generateWeekDates(startDate, endDate)
  const aggregatedData = weekDates.map((date) => {
    const dayData = weekData.filter((item) => item.batch_date === date)
    const totalBatchSum = dayData.reduce((sum, item) => sum + item.batch_sum, 0)
    const totalProtein = dayData.reduce(
      (sum, item) => sum + (item.batch_p_sum || 0),
      0
    )
    return { date, totalBatchSum, totalProtein }
  })

  const chartData = {
    labels: aggregatedData.map((item) => item.date),
    datasets: [
      {
        label: '每日熱量 (kcal)',
        data: aggregatedData.map((item) => item.totalBatchSum),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: '每日蛋白質 (g)',
        data: aggregatedData.map((item) => item.totalProtein),
        fill: false,
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1,
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
            const date = tooltipItem.label
            const dayData =
              weekData.filter((item) => item.batch_date === date) || []
            if (!Array.isArray(dayData) || dayData.length === 0) {
              return '無資料'
            }
            const totalBatchSum = dayData.reduce(
              (sum, item) => sum + item.batch_sum,
              0
            )
            const totalProtein = dayData.reduce(
              (sum, item) => sum + (item.batch_p_sum || 0),
              0
            )
            return [
              `${dayData
                .map((item) => `${item.batch_name}: ${item.batch_sum} kcal`)
                .join(', ')}`,
              `總熱量: ${totalBatchSum} kcal`,
              `總蛋白質: ${totalProtein} g`,
            ]
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
            本周總熱量：{totalCalories} kcal / 蛋白質：{totalProtein} g
          </strong>
        </div>

        <div className="col-4 text-center">
          <button
            className="btn btn-sm"
            onClick={() => setWeekOffset((prev) => prev - 1)}
          >
            上一週
          </button>
          <strong className="">
            {startDate} - {endDate}
          </strong>
          <button
            className="btn btn-sm"
            onClick={() => setWeekOffset((prev) => prev + 1)}
          >
            下一週
          </button>
        </div>
        <div className="col-4"></div>
      </div>

      <Line data={chartData} options={chartOptions} />
    </div>
  )
}
