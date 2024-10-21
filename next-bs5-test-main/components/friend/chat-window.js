import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const ChatWindow = ({
  friendId,
  friendName,
  friendAvatar,
  onClose,
  isOpen,
}) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null) // 滾動至最新消息
  const hasScrolledToBottom = useRef(false) // 追蹤是否已經滾動到最新消息

  // 獲取聊天記錄的函數
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3005/api/messages/${friendId}`,
        { withCredentials: true }
      )
      if (response.data.status === 'success') {
        setMessages(response.data.data)
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      setError('無法獲取聊天記錄')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 獲取聊天記錄
  useEffect(() => {
    fetchMessages() // 初次載入時獲取聊天記錄
    const interval = setInterval(fetchMessages, 1000) // 每秒取得一次聊天記錄

    // 清理 interval
    return () => clearInterval(interval)
  }, [friendId])

  // 每次聊天窗口開啟時滾動到最新消息
  useEffect(() => {
    if (isOpen) {
      hasScrolledToBottom.current = false // 重置滾動狀態
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) // 滾動到最新消息
    }
  }, [isOpen]) // 依賴 isOpen，當其為 true 時觸發

  // 當 messages 更新時，滾動到最新消息
  useEffect(() => {
    if (isOpen && messages.length > 0 && !hasScrolledToBottom.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      hasScrolledToBottom.current = true // 設置為 true，關閉滾動
    }
  }, [messages, isOpen])

  // 聊天室關閉時重置滾動狀態
  const handleClose = () => {
    onClose()
    hasScrolledToBottom.current = false // 重置狀態
  }

  // 發送消息
  const sendMessage = async () => {
    if (!newMessage.trim()) return // 不發送空訊息
    try {
      await axios.post(
        'http://localhost:3005/api/messages',
        {
          receiverId: friendId,
          message: newMessage,
        },
        { withCredentials: true }
      )
      // 在本地添加新消息
      setMessages((prev) => [
        ...prev,
        {
          message: newMessage,
          sender_avatar: 'path/to/currentUserAvatar',
        },
      ])
      setNewMessage('') // 清空輸入框
    } catch (err) {
      console.error('發送消息時出錯:', err)
    }
  }

  // 加載和錯誤處理
  if (loading) return <div>加載中...</div>
  if (error) return <div>錯誤: {error}</div>

  return (
    <div
      className="chat-window"
      style={{
        position: 'fixed',
        bottom: '10%',
        right: '20px',
        width: '300px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '10px',
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={handleClose}>X</button>
        <img
          src={`http://localhost:3005/avatar/${friendAvatar}`} // 使用 friendAvatar
          alt={`${friendName} 頭像`}
          style={{
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            marginLeft: '10px',
            marginRight: '5px',
          }}
        />
        <span style={{ fontWeight: 'bold' }}>{friendName}</span>
      </div>
      <div
        className="messages"
        style={{
          height: '300px',
          overflowY: 'scroll',
          border: '1px solid #ccc',
          padding: '5px',
          marginTop: '10px',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i} // i 為 key，訊息的唯一 ID
            style={{
              margin: '5px 0',
              display: 'flex',
              justifyContent:
                msg.sender_id === friendId ? 'flex-start' : 'flex-end',
              alignItems: 'flex-end', // 將訊息和時間戳垂直對齊
            }}
          >
            {msg.sender_id === friendId && (
              <strong>
                <img
                  className="mx-2"
                  src={`http://localhost:3005/avatar/${msg.sender_avatar}`}
                  alt={`${msg.sender_name} 頭像`}
                  style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                />
              </strong>
            )}
            {msg.sender_id === friendId ? (
              <>
                <span
                  style={{
                    backgroundColor: '#f0f0f0',
                    padding: '10px',
                    borderRadius: '10px',
                    marginLeft: '5px',
                  }}
                >
                  {msg.message}
                </span>
                <small
                  style={{
                    fontSize: '0.7em',
                    color: '#999',
                    alignSelf: 'flex-end', // 時間戳對齊到底部
                    marginLeft: '5px',
                  }}
                >
                  {new Date(msg.created_at).toLocaleString('zh-TW', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </small>
              </>
            ) : (
              <>
                <small
                  style={{
                    fontSize: '0.7em',
                    color: '#999',
                    alignSelf: 'flex-end', // 時間戳對齊到底部
                    marginRight: '5px',
                  }}
                >
                  {new Date(msg.created_at).toLocaleString('zh-TW', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </small>
                <span
                  style={{
                    backgroundColor: '#d1e7dd',
                    padding: '10px',
                    borderRadius: '10px',
                    marginRight: '5px',
                  }}
                >
                  {msg.message}
                </span>
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* 滾動到最新消息 */}
      </div>
      {/* 輸入欄位 */}
      <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="輸入消息"
          style={{
            flexGrow: 1,
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          發送
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
