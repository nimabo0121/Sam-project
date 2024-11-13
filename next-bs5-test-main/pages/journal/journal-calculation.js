import React, { useMemo, useState, useEffect } from 'react'
import axios from 'axios'

export default function JournalCalculation({
  selectedItems,
  setSelectedItems,
}) {
  const [notes, setNotes] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [tags, setTags] = useState([])
  const getLocalDate = () => {
    const localDate = new Date()
    const year = localDate.getFullYear()
    const month = String(localDate.getMonth() + 1).padStart(2, '0')
    const day = String(localDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [recordDate, setRecordDate] = useState(getLocalDate)

  const totalCalories = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      const calories = parseInt(item.calories.replace('kcal', '').trim(), 10)
      return total + (isNaN(calories) ? 0 : calories)
    }, 0)
  }, [selectedItems])
  const totalProtein = useMemo(() => {
    return selectedItems.reduce((total, item) => {
      const protein = parseInt(item.protein.replace('g', '').trim(), 10)
      return total + (isNaN(protein) ? 0 : protein)
    }, 0)
  }, [selectedItems])

  const handleNotesChange = (e) => {
    setNotes(e.target.value)
  }

  const handleDateChange = (e) => {
    setRecordDate(e.target.value)
  }

  const handleSave = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3005/api/healthy',
        {
          items: selectedItems.map((item) => ({
            name: item.name,
            calories: item.calories,
            protein: item.protein,
            sum: parseInt(item.calories.replace('kcal', '').trim(), 10),
            p_sum: parseInt(item.protein.replace('g', '').trim(), 10),
          })),
          notes: notes,
          recordDate: recordDate,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.status !== 201) {
        throw new Error('儲存失敗')
      }

      setSuccessMessage('健康日記已儲存')
      setTimeout(() => {
        setSuccessMessage('')
      }, 2000)
    } catch (error) {
      console.error('Error:', error)
      setSuccessMessage('儲存過程中發生錯誤')
      setTimeout(() => {
        setSuccessMessage('')
      }, 2000)
    }
  }

  const handleClear = () => {
    setSelectedItems([])
    setNotes('')
  }

  const handleDeleteItem = (index) => {
    const newSelectedItems = selectedItems.filter((_, i) => i !== index)
    setSelectedItems(newSelectedItems)
  }
  const fetchTags = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3005/api/healthy/labelget',
        { withCredentials: true }
      )
      const tagsData = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data]
      setTags(tagsData)
    } catch (error) {
      console.error('取得標籤資料錯誤:', error)
    }
  }
  useEffect(() => {
    fetchTags()
  }, [])

  const handleTagClick = (labelName) => {
    if (!labelName) return
    setNotes((prevNotes) =>
      prevNotes ? `${prevNotes} ${labelName}` : labelName
    )
  }

  return (
    <form>
      <div className="mb-3">
        <input
          type="date"
          id="recordDate"
          className="form-control"
          value={recordDate}
          onChange={handleDateChange}
        />
      </div>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'Arial, sans-serif', // 統一字體
        }}
      >
        <thead>
          <tr>
            <th>食品名稱</th>
            <th style={{ textAlign: 'right' }}>熱量</th>
            <th style={{ textAlign: 'right' }}>蛋白質</th>
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
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  const itemName = e.currentTarget.querySelector('.item-name')
                  if (item.name.length > 15) {
                    itemName.style.transform = 'translateX(-10%)' // 名稱超過 12 個字符時
                  } else if (item.name.length > 9) {
                    itemName.style.transform = 'translateX(0%)' // 名稱超過 9 個字符時但不超過 12 個字符
                  }
                  e.currentTarget.querySelector('.delete-btn').style.width =
                    '100%'
                  e.currentTarget.querySelector('.delete-btn').style.opacity = 1
                  e.currentTarget.style.backgroundColor = '#f0f8ff'
                }}
                onMouseLeave={(e) => {
                  const itemName = e.currentTarget.querySelector('.item-name')
                  itemName.style.transform = 'translateX(0)' // 恢復到原位
                  e.currentTarget.querySelector('.delete-btn').style.width = '0'
                  e.currentTarget.querySelector('.delete-btn').style.opacity = 0
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <td
                  style={{
                    wordBreak: 'break-word',
                    maxWidth: '140px',
                    whiteSpace: 'nowrap', // 防止換行
                    overflow: 'hidden', // 隱藏超出部分
                    position: 'relative', // 用於定位滑動效果
                  }}
                >
                  <span
                    className="item-name"
                    style={{
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      transition: 'transform 0.3s ease-out', // 加入過渡效果
                    }}
                  >
                    {item.name}
                  </span>
                </td>
                <td style={{ textAlign: 'right', position: 'relative' }}>
                  {item.calories}
                </td>
                <td style={{ textAlign: 'right', position: 'relative' }}>
                  {item.protein}
                  {/* 刪除鍵 */}
                  <button
                    type="button"
                    className="delete-btn btn btn-danger btn-sm"
                    onClick={() => handleDeleteItem(index)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '0px',
                      transform: 'translateY(-50%)',
                      width: '100%', // 預設寬度為0
                      height: '100%',
                      opacity: 0, // 預設隱藏
                      overflow: 'hidden',
                      transition: 'width 0.3s ease, opacity 0.3s ease',
                    }}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">尚未選擇任何食品</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mb-3 pt-1">
        {/* <label htmlFor="exampleFormControlTextarea1" className="form-label">
          備註
        </label> */}
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
          placeholder="備註"
          value={notes}
          onChange={handleNotesChange}
        ></textarea>
      </div>
      <div className="d-flex flex-wrap">
        {tags.map((tag) =>
          tag && tag.label_name ? (
            <div key={tag.id}>
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => handleTagClick(tag.label_name)}
              >
                {tag.label_name}
              </button>
            </div>
          ) : null
        )}
      </div>

      {/* 用 div 包裝總熱量 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <strong>總熱量:</strong>
        <span>{totalCalories} (kcal)</span>
      </div>
      {/* 總蛋白質 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        <strong>總蛋白質:</strong>
        <span>{totalProtein} (g)</span>
      </div>

      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={handleSave}
        disabled={totalCalories === 0}
      >
        儲存
      </button>
      <button
        type="button"
        className="btn btn-outline-secondary ml-2"
        onClick={handleClear}
      >
        清除
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
