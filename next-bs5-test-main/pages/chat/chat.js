import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import axios from 'axios'

const socket = io('http://localhost:3006') // 替換為您的伺服器地址

const ChatApp = () => {
  const [userId, setUserId] = useState('') // 用戶 ID
  const [friendId, setFriendId] = useState('') // 好友 ID
  const [message, setMessage] = useState('') // 要發送的訊息
  const [messages, setMessages] = useState([]) // 訊息紀錄
  const [friends, setFriends] = useState([]) // 好友列表

  useEffect(() => {
    // 註冊用戶
    if (userId) {
      socket.emit('register', userId)
    }

    // 接收新訊息
    socket.on('newMessage', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: data.from, message: data.message },
      ])
    })

    return () => {
      socket.off('newMessage')
    }
  }, [userId])

  // 取得好友列表（此處為範例，需替換為實際 API）
  const fetchFriends = async () => {
    try {
      const response = await axios.get(`/api/friends/${userId}`) // 替換為您的 API
      setFriends(response.data)
    } catch (error) {
      console.error('Error fetching friends:', error)
    }
  }

  // 發送訊息
  const sendMessage = () => {
    if (message && friendId) {
      socket.emit('sendMessage', { recipientId: friendId, message })
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: userId, message },
      ])
      setMessage('') // 清空輸入框
    }
  }

  useEffect(() => {
    if (userId) {
      fetchFriends() // 取得好友列表
    }
  }, [userId])

  return (
    <div>
      <h1>一對一聊天應用</h1>
      <input
        type="text"
        placeholder="輸入用戶 ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <h2>好友列表</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id} onClick={() => setFriendId(friend.id)}>
            {friend.name}
          </li>
        ))}
      </ul>
      {friendId && (
        <div>
          <h2>與 {friendId} 的聊天</h2>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '10px',
            }}
          >
            {messages
              .filter((msg) => msg.from === userId || msg.from === friendId)
              .map((msg, index) => (
                <div key={index}>
                  <strong>{msg.from}:</strong> {msg.message}
                </div>
              ))}
          </div>
          <input
            type="text"
            placeholder="輸入訊息"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>發送</button>
        </div>
      )}
    </div>
  )
}

export default ChatApp
