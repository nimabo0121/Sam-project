import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const ChatWindow = ({
  friendId,
  friendName,
  friendAvatar,
  onClose,
  isOpen,
}) => {
  // 記錄消息、當前輸入的消息、加載狀態和錯誤信息的狀態
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 參考DOM元素
  const messagesEndRef = useRef(null)
  const hasScrolledToBottom = useRef(true)
  const messagesContainerRef = useRef(null)

  // 獲取消息的函數
  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3005/api/messages/${friendId}`,
        { withCredentials: true }
      )
      if (data.status === 'success') {
        setMessages(data.data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('無法獲取聊天記錄')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 初始加載消息和設置定時器
  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 500) // 每500毫秒獲取一次消息
    return () => clearInterval(interval) // 清除定時器
  }, [friendId])

  // 當聊天窗口打開時滾動到消息底部
  useEffect(() => {
    if (isOpen) {
      hasScrolledToBottom.current = true
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isOpen])

  // 當消息更新時滾動到最新消息
  useEffect(() => {
    if (hasScrolledToBottom.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // 處理滾動事件，確定是否滾動到最底部
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current
    hasScrolledToBottom.current = scrollHeight - scrollTop <= clientHeight + 20
  }

  // 關閉聊天窗口
  const handleClose = () => {
    onClose()
    hasScrolledToBottom.current = false
  }

  // 發送消息的函數
  const sendMessage = async () => {
    if (!newMessage.trim()) return // 如果消息內容為空則不發送
    try {
      await axios.post(
        'http://localhost:3005/api/messages',
        { receiverId: friendId, message: newMessage },
        { withCredentials: true }
      )

      // 更新消息列表
      const newMsg = {
        message: newMessage,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, newMsg])
      setNewMessage('') // 清空輸入框
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    } catch (err) {
      console.error('發送消息時出錯:', err)
    }
  }

  // 加載中顯示
  if (loading) return <div>加載中...</div>
  // 錯誤處理（要取消註解）
  // if (error) return <div>錯誤: {error}</div>;

  return (
    <div className="chat-window" style={styles.chatWindow}>
      <div style={styles.header}>
        <button onClick={handleClose}>X</button>
        <img
          src={`http://localhost:3005/avatar/${friendAvatar}`}
          alt={`${friendName} 頭像`}
          style={styles.avatar}
        />
        <span style={{ fontWeight: 'bold' }}>{friendName}</span>
      </div>
      <div
        className="messages"
        ref={messagesContainerRef}
        onScroll={handleScroll}
        style={styles.messagesContainer}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              justifyContent:
                msg.sender_id === friendId ? 'flex-start' : 'flex-end',
            }}
          >
            {msg.sender_id === friendId && (
              <strong>
                <img
                  src={`http://localhost:3005/avatar/${msg.sender_avatar}`}
                  alt={`${msg.sender_name} 頭像`}
                  style={styles.avatar}
                />
              </strong>
            )}
            <div
              style={{
                ...styles.messageBubble,
                backgroundColor:
                  msg.sender_id === friendId ? '#f0f0f0' : '#d1e7dd',
              }}
            >
              {msg.message}
            </div>
            {/* 時間格式處理 */}
            <small style={styles.timestamp}>
              {new Date(msg.created_at).toLocaleString('zh-TW', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="輸入消息"
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          發送
        </button>
      </div>
    </div>
  )
}

// 樣式定義（使用 JSX 風格）
const styles = {
  chatWindow: {
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
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    margin: '0 5px',
  },
  messagesContainer: {
    height: '300px',
    overflowY: 'scroll',
    border: '1px solid #ccc',
    padding: '5px',
    marginTop: '10px',
  },
  message: {
    margin: '5px 0',
    display: 'flex',
    alignItems: 'flex-end',
  },
  messageBubble: {
    padding: '10px',
    borderRadius: '10px',
    margin: '0 5px',
  },
  timestamp: {
    fontSize: '0.7em',
    color: '#999',
    alignSelf: 'flex-end',
  },
  inputContainer: {
    marginTop: '10px',
    display: 'flex',
    gap: '5px',
  },
  input: {
    flexGrow: 1,
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  sendButton: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
}

export default ChatWindow
