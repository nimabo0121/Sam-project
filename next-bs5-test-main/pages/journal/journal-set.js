import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function JournalSet() {
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [editingTagId, setEditingTagId] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

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

  const handleAddTag = async () => {
    if (!newTag) {
      alert('標籤名稱不能為空')
      return
    }

    try {
      await axios.post(
        'http://localhost:3005/api/healthy/labelset',
        { label_name: newTag },
        { withCredentials: true }
      )

      setSuccessMessage('成功新增標籤')
      setTimeout(() => setSuccessMessage(''), 2000)
      setNewTag('')
      setIsAddingTag(false)
      fetchTags()
    } catch (error) {
      console.error('新增標籤錯誤:', error)
    }
  }

  const handleSaveTag = async () => {
    if (!newTag) {
      alert('標籤名稱不能為空')
      return
    }

    try {
      await axios.put(
        `http://localhost:3005/api/healthy/labelset/${editingTagId}`,
        { label_name: newTag },
        { withCredentials: true }
      )

      setSuccessMessage('成功修改標籤')
      setTimeout(() => setSuccessMessage(''), 2000)
      setNewTag('')
      setEditingTagId(null)
      fetchTags()
    } catch (error) {
      console.error('更新標籤錯誤:', error)
    }
  }

  const handleCancelEdit = () => {
    setNewTag('')
    setEditingTagId(null)
  }

  const handleDeleteTag = async (tagId) => {
    try {
      await axios.delete(
        `http://localhost:3005/api/healthy/labelset/${tagId}`,
        { withCredentials: true }
      )

      setSuccessMessage('成功刪除標籤')
      setTimeout(() => setSuccessMessage(''), 2000)
      fetchTags()
    } catch (error) {
      console.error('刪除標籤錯誤:', error)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  return (
    <div>
      <h4>自訂標籤</h4>
      <div className="d-flex flex-wrap">
        {tags.map((tag) => (
          <div
            key={tag.id}
            style={{
              position: 'relative',
              marginRight: '0.5rem',
              marginBottom: '0.5rem',
            }}
            className="tag-container"
            onMouseEnter={(e) => {
              const deleteBtn = e.currentTarget.querySelector('.tag-delete-btn')
              if (deleteBtn) {
                deleteBtn.style.display = 'flex' // 顯示刪除按鈕
              }
            }}
            onMouseLeave={(e) => {
              const deleteBtn = e.currentTarget.querySelector('.tag-delete-btn')
              if (deleteBtn) {
                deleteBtn.style.display = 'none' // 隱藏刪除按鈕
              }
            }}
          >
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={() => {
                setNewTag(tag.label_name)
                setEditingTagId(tag.id)
              }}
            >
              {tag.label_name}
            </button>
            <button
              type="button"
              className="btn btn-danger tag-delete-btn"
              onClick={() => handleDeleteTag(tag.id)}
              style={{
                position: 'absolute',
                top: '-10%',
                right: '-10%',
                width: '17px',
                height: '17px',
                borderRadius: '50%',
                display: 'none', // 初始隱藏刪除按鈕
                alignItems: 'center', // 垂直置中
                justifyContent: 'center', // 水平置中
                backgroundColor: 'white',
                color: 'red',
                border: '1px solid red',
                cursor: 'pointer',
                padding: '0',
              }}
            >
              x
            </button>
          </div>
        ))}
      </div>

      {tags.length < 5 && !isAddingTag && (
        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => setIsAddingTag(true)}
        >
          +
        </button>
      )}

      {isAddingTag && (
        <div>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="輸入標籤名稱"
            className="form-control"
          />
          <button onClick={handleAddTag} className="btn btn-primary">
            新增標籤
          </button>
          <button
            onClick={() => setIsAddingTag(false)}
            className="btn btn-secondary"
          >
            取消
          </button>
        </div>
      )}

      {editingTagId && (
        <div>
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="修改標籤名稱"
            className="form-control"
          />
          <button onClick={handleSaveTag} className="btn btn-primary">
            修改
          </button>
          <button onClick={handleCancelEdit} className="btn btn-secondary">
            取消
          </button>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}
    </div>
  )
}
