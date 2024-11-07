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
  const [monthData, setMonthData] = useState([]) // 初始化為空陣列
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCalories, setTotalCalories] = useState(0) // 用來儲存總熱量

  // 取得當前日期
  const currentDate = new Date()
  const currentDay = currentDate.getDate()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // 計算當月的第一天和最後一天
  const getMonthDateRange = () => {
    const startDate = new Date(currentYear, currentMonth, 1) // 當月第一天
    const endDate = new Date(currentYear, currentMonth + 1, 0) // 當月最後一天

    return {
      startDate: `${startDate.getFullYear()}-${String(
        startDate.getMonth() + 1
      ).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`,
      endDate: `${endDate.getFullYear()}-${String(
        endDate.getMonth() + 1
      ).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`,
    }
  }

  const { startDate, endDate } = getMonthDateRange()
  // console.log(startDate)
  // console.log(endDate)
  useEffect(() => {
    // 發送請求獲取當月的資料
    axios
      .get('http://localhost:3005/api/healthy/records', {
        params: {
          period: 'month',
          startDate,
          endDate,
          t: new Date().getTime(), // 添加時間戳
        },
        withCredentials: true, // 確保攜帶 cookie
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        const data = response.data.data || [] // 設置為陣列，即使回應中沒有資料
        setMonthData(data)

        // 計算總熱量
        const total = data.reduce((sum, item) => sum + item.batch_sum, 0)
        setTotalCalories(total)

        setLoading(false)
        console.log(response.data)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }, [startDate, endDate])

  // 如果正在加載，顯示 loading
  if (loading) {
    return <div>Loading...</div>
  }

  // 如果有錯誤，顯示錯誤訊息
  if (error) {
    return <div>Error: {error}</div>
  }

  // 如果沒有數據，顯示提示
  if (!Array.isArray(monthData) || monthData.length === 0) {
    return <div>當月無數據</div>
  }

  // 合併相同 batch_date 的資料並加總 batch_sum，保留 batch_name
  const aggregatedData = monthData.reduce((acc, item) => {
    const date = item.batch_date
    if (acc[date]) {
      acc[date].push({
        batch_name: item.batch_name, // 保存每個 batch_name
        batch_sum: item.batch_sum, // 保存每個對應的 batch_sum
      })
    } else {
      acc[date] = [
        {
          batch_name: item.batch_name, // 初始化 batch_name
          batch_sum: item.batch_sum, // 初始化 batch_sum
        },
      ]
    }
    return acc
  }, {})

  // 將資料轉換為圖表需要的格式
  const chartData = {
    labels: Object.keys(aggregatedData), // 以 batch_date 作為 x 軸標籤
    datasets: [
      {
        label: '每日熱量 (kcal)', // 熱量數據標籤
        data: Object.values(aggregatedData).map((itemArray) =>
          itemArray.reduce((sum, item) => sum + item.batch_sum, 0)
        ), // 使用加總後的 batch_sum 作為數據
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  // 配置 Tooltips 來顯示每個資料點的備註和 batch_sum
  const chartOptions = {
    responsive: true, // 使圖表自適應容器大小
    maintainAspectRatio: false, // 禁用保持比例，以適應容器
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const date = tooltipItem.label // 當前 x 軸的日期
            const batchData = aggregatedData[date] // 獲取對應日期的資料
            const totalBatchSum = batchData.reduce(
              (sum, item) => sum + item.batch_sum,
              0
            )
            // 顯示每個 batch_name 和對應的 batch_sum
            return (
              batchData
                .map((item) => `${item.batch_name}: ${item.batch_sum} kcal`) // 顯示每個 batch_name 及其對應的 batch_sum
                .join(', ') + ` Total: ${totalBatchSum} kcal`
            ) // 換行每個備註
          },
        },
      },
    },
  }

  return (
    <div style={{ height: '350PX', width: '100%' }}>
      <div>
        <strong>當月總熱量：{totalCalories} kcal</strong>
      </div>
      <Line
        data={chartData}
        options={chartOptions} // 傳入設置好的 options
      />
    </div>
  )
}
