import React, { useMemo, useState } from 'react'
import axios from 'axios'

export default function JournalCalculation({ selectedItems }) {
  const [notes, setNotes] = useState('')
  const [recordDate, setRecordDate] = useState(() => {
    const localDate = new Date()
    return localDate.toLocaleDateString('zh-TW') // 使用本地時區格式化日期
  })
  const [successMessage, setSuccessMessage] = useState('') // 成功訊提通知

  // 計算總熱量（僅在 selectedItems 更新時計算）
  const totalCalories = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      const calories = parseInt(item.calories.replace('kcal', '').trim(), 10)
      return total + (isNaN(calories) ? 0 : calories)
    }, 0)
  }, [selectedItems])

  // 處理備註輸入
  const handleNotesChange = (e) => {
    setNotes(e.target.value)
  }

  // 儲存健康日記
  const handleSave = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3005/api/healthy',
        {
          items: selectedItems.map((item) => ({
            name: item.name,
            calories: item.calories,
            sum: parseInt(item.calories.replace('kcal', '').trim(), 10), // 每個食物的熱量數字
          })),
          notes: notes,
          recordDate: recordDate, // 使用本地日期
        },
        {
          withCredentials: true, // 請求攜帶 cookies
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.status !== 201) {
        throw new Error('儲存失敗')
      }

      setSuccessMessage('健康日記已儲存')
      // 3秒隱藏
      setTimeout(() => {
        setSuccessMessage('')
      }, 2000)
    } catch (error) {
      console.error('Error:', error)
      setSuccessMessage('儲存過程中發生錯誤')
      // 3秒隱藏
      setTimeout(() => {
        setSuccessMessage('')
      }, 2000)
    }
  }

  return (
    <form>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>項目名稱</th>
            <th style={{ textAlign: 'right' }}>熱量 (kcal)</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <tr
                key={index}
                style={{
                  transition: 'background-color 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#f0f8ff')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                <td
                  style={{
                    wordBreak: 'break-word',
                    maxWidth: '160px',
                  }}
                >
                  {item.name}
                </td>
                <td style={{ textAlign: 'right' }}>{item.calories}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">尚未選擇任何項目</td>
            </tr>
          )}
          <tr>
            <th className="py-2">總熱量</th>
            <th style={{ textAlign: 'right' }}>{totalCalories} kcal</th>
          </tr>
        </tbody>
      </table>

      <div className="mb-3">
        <label htmlFor="exampleFormControlTextarea1" className="form-label">
          備註
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          value={notes}
          onChange={handleNotesChange}
        ></textarea>
      </div>

      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={handleSave}
      >
        儲存
      </button>
      {successMessage && (
        <span
          style={{
            marginTop: '15px',
            color: successMessage.includes('錯誤') ? 'red' : 'green',
          }}
        >
          {successMessage}
        </span>
      )}
    </form>
  )
}
