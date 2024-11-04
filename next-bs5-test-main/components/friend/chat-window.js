import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'

// ChatWindow 組件，用於顯示與特定好友的聊天界面
const ChatWindow = ({
  friendId, // 好友的 ID
  friendName, // 好友的名字
  friendAvatar, // 好友的頭像
  onClose, // 關閉聊天的回調函數
  isOpen, // 聊天窗口是否打開的狀態
}) => {
  // 設定狀態
  const [messages, setMessages] = useState([]) // 訊息列表
  const [newMsg, setNewMsg] = useState('') // 當前輸入的訊息
  const [loading, setLoading] = useState(true) // 加載狀態
  const [error, setError] = useState(null) // 錯誤狀態
  const [isMinimized, setIsMinimized] = useState(false) // 聊天窗口是否最小化
  const [hovered, setHovered] = useState(false) // 當前是否懸停在最小化視圖上

  // 使用 ref 來控制滾動行為
  const endRef = useRef(null) // 用於滾動到訊息底部的 ref
  const scrollToBottom = useRef(true) // 用於判斷是否自動滾動到底部
  const containerRef = useRef(null) // 訊息容器的 ref

  // 獲取訊息的異步函數
  const getMessages = async () => {
    try {
      // 從伺服器獲取訊息
      const { data } = await axios.get(
        `http://localhost:3005/api/messages/${friendId}`,
        { withCredentials: true } // 帶上憑證
      )
      // 檢查伺服器返回的狀態
      if (data.status === 'success') {
        setMessages(data.data) // 更新訊息列表
      } else {
        setError(data.message) // 設置錯誤訊息
      }
    } catch (err) {
      setError('無法獲取聊天記錄') // 設置錯誤訊息
      console.error(err) // 在控制台顯示錯誤
    } finally {
      setLoading(false) // 完成後設置加載為 false
    }
  }

  // 當組件加載或好友 ID 更改時，獲取訊息
  useEffect(() => {
    getMessages()
    const interval = setInterval(getMessages, 500) // 每 500 毫秒獲取一次訊息
    return () => clearInterval(interval) // 清除定時器
  }, [friendId])

  // 當聊天窗口打開時滾動到底部
  useEffect(() => {
    if (isOpen) {
      scrollToBottom.current = true
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isOpen])

  // 當訊息更新時，自動滾動到底部
  useEffect(() => {
    if (scrollToBottom.current) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // 處理滾動事件
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    scrollToBottom.current = scrollHeight - scrollTop <= clientHeight + 20 // 判斷是否滾動到底部
  }

  // 關閉聊天窗口
  const closeChat = () => {
    onClose() // 呼叫關閉回調
    scrollToBottom.current = false
  }

  // 發送訊息的異步函數
  const sendMsg = async () => {
    if (!newMsg.trim()) return // 檢查是否為空訊息
    try {
      await axios.post(
        'http://localhost:3005/api/messages',
        { receiverId: friendId, message: newMsg }, // 發送訊息的資料
        { withCredentials: true } // 帶上憑證
      )

      const newMessage = {
        message: newMsg,
        created_at: new Date().toISOString(), // 設置訊息的時間戳
      }
      setMessages((prev) => [...prev, newMessage]) // 更新訊息列表
      setNewMsg('') // 清空輸入框
      endRef.current?.scrollIntoView({ behavior: 'smooth' }) // 滾動到底部
    } catch (err) {
      console.error('發送消息時出錯:', err) // 在控制台顯示錯誤
    }
  }

  if (loading) return <div>加載中...</div> // 加載時顯示的內容

  return (
    <>
      {isMinimized ? ( // 如果窗口最小化
        <div
          style={styles.minimized}
          onMouseEnter={() => setHovered(true)} // 鼠標懸停事件
          onMouseLeave={() => setHovered(false)} // 鼠標離開事件
        >
          <img
            src={`http://localhost:3005/avatar/${friendAvatar}`}
            alt={`${friendName} `}
            style={styles.minAvatar}
            onClick={() => setIsMinimized(false)} // 點擊頭像恢復聊天窗口
          />
          {hovered && ( // 如果懸停顯示關閉按鈕
            <button style={styles.minClose} onClick={closeChat}>
              x
            </button>
          )}
        </div>
      ) : (
        // 聊天窗口未最小化
        <div className="chat" style={styles.chat}>
          <div style={styles.header}>
            <img
              src={`http://localhost:3005/avatar/${friendAvatar}`}
              alt={`${friendName} 頭像`}
              style={styles.avatar}
              onClick={() => setIsMinimized(false)} // 點擊頭像恢復聊天窗口
            />
            <span style={{ fontWeight: 'bold' }}>{friendName}</span>
            <div style={styles.btns}>
              <button
                onClick={() => setIsMinimized(true)} // 點擊按鈕最小化窗口
                style={styles.minBtn}
              >
                一
              </button>
              <button onClick={closeChat} style={styles.closeBtn}>
                X
              </button>
            </div>
          </div>
          <div
            className="msgs"
            ref={containerRef} // 訊息容器
            onScroll={handleScroll} // 滾動事件
            style={styles.container}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.msg,
                  justifyContent:
                    msg.sender_id === friendId ? 'flex-start' : 'flex-end',
                }}
              >
                {msg.sender_id === friendId ? (
                  <>
                    {/* 如果是好友的訊息，顯示頭像和訊息 */}
                    <strong>
                      <img
                        src={`http://localhost:3005/avatar/${msg.sender_avatar}`}
                        alt={`${msg.sender_name} 頭像`}
                        style={styles.avatar}
                      />
                    </strong>
                    <div
                      style={{
                        ...styles.bubble,
                        backgroundColor: '#f0f0f0',
                      }}
                    >
                      {msg.message}
                    </div>
                    <small style={styles.time}>
                      {new Date(msg.created_at).toLocaleString('zh-TW', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </small>
                  </>
                ) : (
                  <>
                    {/* 如果是當前用戶的訊息，先顯示時間戳，再顯示訊息 */}
                    <small style={styles.time}>
                      {new Date(msg.created_at).toLocaleString('zh-TW', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </small>
                    <div
                      style={{
                        ...styles.bubble,
                        backgroundColor: '#d1e7dd',
                      }}
                    >
                      {msg.message}
                    </div>
                  </>
                )}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div style={styles.inputWrap}>
            <input
              type="text"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)} // 更新輸入的訊息
              placeholder="輸入消息"
              style={styles.input}
            />
            <button onClick={sendMsg} style={styles.sendBtn}>
              發送
            </button>
          </div>
        </div>
      )}
    </>
  )
}

const styles = {
  chat: {
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
  minimized: {
    position: 'fixed',
    bottom: '12%',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000,
  },
  minAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    cursor: 'pointer',
  },
  minClose: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    top: '-5px',
    right: '0px',
    border: 'none',
    color: 'black',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
    fontWeight: 'bold',
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
    cursor: 'pointer',
  },
  btns: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
  },
  minBtn: {
    marginRight: '5px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '16px',
  },
  closeBtn: {
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '16px',
  },
  container: {
    height: '300px',
    overflowY: 'scroll',
    border: '1px solid #ccc',
    padding: '5px',
    marginTop: '10px',
  },
  msg: {
    margin: '5px 0',
    display: 'flex',
    alignItems: 'flex-end',
  },
  bubble: {
    padding: '10px',
    borderRadius: '10px',
    margin: '0 5px',
  },
  time: {
    fontSize: '0.7em',
    color: '#999',
    alignSelf: 'flex-end',
  },
  inputWrap: {
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
  sendBtn: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
}

export default ChatWindow
