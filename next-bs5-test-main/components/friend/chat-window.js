import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const ChatWindow = ({ friendId, friendName, friendAvatar, onClose }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null) // 用來滾動至最新消息

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
    const interval = setInterval(fetchMessages, 1000) // 每秒獲取一次聊天記錄

    // 清理 interval
    return () => clearInterval(interval)
  }, [friendId])

  // 自動滾動到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
          sender_id: 'currentUserId', // 這裡應替換為真實的當前用戶ID
          sender_name: '當前用戶', // 顯示當前用戶名稱
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
        <button onClick={onClose}>X</button>
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
        {messages.map((msg, index) => (
          <div
            key={index} // 這裡使用 index 作為 key，應替換為訊息的唯一 ID
            style={{
              textAlign: msg.sender_id === friendId ? 'left' : 'right',
              margin: '5px 0',
              display: 'flex',
              justifyContent:
                msg.sender_id === friendId ? 'flex-start' : 'flex-end',
            }}
          >
            {msg.sender_id === friendId ? (
              <strong>
                <img
                  className="mx-2"
                  src={`http://localhost:3005/avatar/${msg.sender_avatar}`}
                  alt={`${msg.sender_name} 頭像`} // 使用正確的名稱
                  style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                />
              </strong>
            ) : null}
            <span
              style={{
                backgroundColor:
                  msg.sender_id === friendId ? '#f0f0f0' : '#d1e7dd',
                padding: '10px',
                borderRadius: '10px',
                marginLeft: msg.sender_id === friendId ? '5px' : '0',
                marginRight: msg.sender_id !== friendId ? '5px' : '0',
              }}
            >
              {msg.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* 滾動到最新消息 */}
      </div>
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
