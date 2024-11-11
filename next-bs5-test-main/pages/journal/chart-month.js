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

export default function ChartMonth() {
  const [monthData, setMonthData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCalories, setTotalCalories] = useState(0)

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  // console.log(currentDate)
  // console.log(currentMonth)
  const monthNames = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ]
  const getMonthDateRange = () => {
    const startDate = new Date(currentYear, currentMonth, 1)
    const endDate = new Date(currentYear, currentMonth + 1, 0)
    // console.log(endDate)
    return {
      startDate: `${startDate.getFullYear()}-${String(
        startDate.getMonth() + 1
      ).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`,
      endDate: `${endDate.getFullYear()}-${String(
        endDate.getMonth() + 1
      ).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`,
    }
  }
  const currentMonthName = monthNames[currentMonth]
  const { startDate, endDate } = getMonthDateRange()
  useEffect(() => {
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

        const total = data.reduce((sum, item) => sum + item.batch_sum, 0)
        setTotalCalories(total)

        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }, [startDate, endDate])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!Array.isArray(monthData) || monthData.length === 0) {
    return <div>當月無數據</div>
  }

  // 生成當月的完整日期列表
  const generateDateList = (startDate, endDate) => {
    const dateList = []
    let currentDate = new Date(startDate)

    while (currentDate <= new Date(endDate)) {
      dateList.push(
        `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
      )
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dateList
  }

  const dateList = generateDateList(startDate, endDate)
  // console.log(dateList)

  // 將 dateList 中的日期格式轉換為「月-日」
  const formattedDateList = dateList.map((date) => {
    const monthDay = date.slice(8) // 提取「月-日」部分
    return monthDay
  })

  // 合併相同 batch_date 的資料並加總 batch_sum，保留 batch_name
  const aggregatedData = monthData.reduce((acc, item) => {
    const date = item.batch_date
    if (acc[date]) {
      acc[date].push({
        batch_name: item.batch_name,
        batch_sum: item.batch_sum,
      })
    } else {
      acc[date] = [
        {
          batch_name: item.batch_name,
          batch_sum: item.batch_sum,
        },
      ]
    }
    return acc
  }, {})

  // 填補缺失的日期，設置 batch_sum 為 0
  dateList.forEach((date) => {
    if (!aggregatedData[date]) {
      aggregatedData[date] = [{ batch_name: '無資料', batch_sum: 0 }]
    }
  })

  // 將資料轉換為圖表需要的格式
  const chartData = {
    labels: formattedDateList, // 使用格式化後的日期列表
    datasets: [
      {
        label: '每日熱量 (kcal)',
        data: dateList.map((date) =>
          aggregatedData[date].reduce((sum, item) => sum + item.batch_sum, 0)
        ),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }
  // console.log(aggregatedData)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const date = tooltipItem.label
            const batchData = aggregatedData[date] || []
            if (!Array.isArray(batchData) || batchData.length === 0) {
              return '無資料'
            }
            const totalBatchSum = batchData.reduce(
              (sum, item) => sum + item.batch_sum,
              0
            )
            return (
              batchData
                .map((item) => `${item.batch_name}: ${item.batch_sum} kcal`)
                .join(', ') + ` Total: ${totalBatchSum} kcal`
            )
          },
        },
      },
    },
  }

  return (
    <div style={{ height: '350PX', width: '100%' }}>
      <div>
        <strong>
          {currentMonthName} 總熱量：{totalCalories} kcal
        </strong>
      </div>
      <Line data={chartData} options={chartOptions} />
    </div>
  )
}
