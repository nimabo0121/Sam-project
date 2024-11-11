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

export default function ChartMonth() {
  const [monthData, setMonthData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCalories, setTotalCalories] = useState(0)
  const [totalProtein, setTotalProtein] = useState(0)
  const [monthOffset, setMonthOffset] = useState(0) // 月份偏移量

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + monthOffset

  // 計算月日期範圍
  const getMonthDateRange = () => {
    const startDate = new Date(currentYear, currentMonth, 1)
    const endDate = new Date(currentYear, currentMonth + 1, 0)
    return {
      startDate: `${startDate.getFullYear()}-${String(
        startDate.getMonth() + 1
      ).padStart(2, '0')}-01`,
      endDate: `${endDate.getFullYear()}-${String(
        endDate.getMonth() + 1
      ).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`,
    }
  }

  const { startDate, endDate } = getMonthDateRange()

  const generateMonthDates = (start, end) => {
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
          period: 'month',
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
  if (!Array.isArray(monthData) || monthData.length === 0)
    return (
      <div className="container" style={{ height: '350px', width: '100%' }}>
        <div className="row" style={{ height: '24px' }}>
          <div className="col-4"></div>
          <div className="col-4 text-center">
            <button
              className="btn btn-sm"
              onClick={() => setMonthOffset((prev) => prev - 1)}
            >
              上一月
            </button>
            <strong className="">
              {startDate} - {endDate}
            </strong>
            <button
              className="btn btn-sm"
              onClick={() => setMonthOffset((prev) => prev + 1)}
            >
              下一月
            </button>
          </div>
          <div className="col-4"></div>
        </div>
        <div>本月無數據...</div>
      </div>
    )

  const monthDates = generateMonthDates(startDate, endDate)
  const aggregatedData = monthDates.map((date) => {
    const dayData = monthData.filter((item) => item.batch_date === date)
    const totalBatchSum = dayData.reduce((sum, item) => sum + item.batch_sum, 0)
    const totalProtein = dayData.reduce(
      (sum, item) => sum + (item.batch_p_sum || 0),
      0
    )
    return { date, totalBatchSum, totalProtein }
  })

  const chartData = {
    labels: aggregatedData.map((item) => {
      const date = new Date(item.date)
      return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate()
      ).padStart(2, '0')}`
    }),
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
              monthData.filter((item) => item.batch_date === date) || []
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
            本月總熱量：{totalCalories} kcal / 蛋白質：{totalProtein} g
          </strong>
        </div>

        <div className="col-4 text-center">
          <button
            className="btn btn-sm"
            onClick={() => setMonthOffset((prev) => prev - 1)}
          >
            上一月
          </button>
          <strong className="">
            {startDate} - {endDate}
          </strong>
          <button
            className="btn btn-sm"
            onClick={() => setMonthOffset((prev) => prev + 1)}
          >
            下一月
          </button>
        </div>
        <div className='col-4'></div>
      </div>

      <Line data={chartData} options={chartOptions} />
    </div>
  )
}
