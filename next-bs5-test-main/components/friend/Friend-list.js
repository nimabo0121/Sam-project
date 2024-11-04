import React, { useEffect, useState } from 'react'
import axios from 'axios'

const FriendList = () => {
  const [pendingRequests, setPendingRequests] = useState([]) // 存儲好友請求
  const [loading, setLoading] = useState(true) // 加載狀態
  const [error, setError] = useState(null) // 錯誤信息

  // 從後端獲取好友請求的數據
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3005/api/friends/pending',
          {
            withCredentials: true, // 確保請求攜帶 cookies
          }
        ) // 發送 GET 請求
        if (response.data.status === 'success') {
          setPendingRequests(response.data.data) // 設置好友請求數據
        } else {
          setError(response.data.message) // 處理錯誤信息
        }
      } catch (err) {
        setError('無法獲取好友請求')
        console.error(err)
      } finally {
        setLoading(false) // 請求完成後取消加載狀態
      }
    }

    fetchPendingRequests() // 請求數據
  }, [])

  // 處理同意好友請求
  const acceptFriendRequest = async (friendId) => {
    try {
      const response = await axios.post(
        'http://localhost:3005/api/friends/accept',
        { friendId }, // 需要同意的好友 ID
        { withCredentials: true } // 確保請求攜帶 cookies
      )

      if (response.data.status === 'success') {
        // 更新本地好友請求列表，移除已同意的請求
        setPendingRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== friendId)
        )
      } else {
        setError(response.data.message) // 顯示錯誤信息
      }
    } catch (err) {
      setError('無法同意好友請求')
      console.error(err)
    }
  }

  // 處理拒絕好友請求
  const rejectFriendRequest = async (friendId) => {
    try {
      const response = await axios.delete(
        'http://localhost:3005/api/friends/reject',
        {
          data: { friendId }, // 傳遞要拒絕的好友 ID
          withCredentials: true, // 確保請求攜帶 cookies
        }
      )

      if (response.data.status === 'success') {
        // 更新本地好友請求列表，移除已拒絕的請求
        setPendingRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== friendId)
        )
      } else {
        setError(response.data.message) // 顯示錯誤信息
      }
    } catch (err) {
      setError('無法拒絕好友請求')
      console.error(err)
    }
  }

  if (loading) return <div>加載中...</div>
  if (error) return <div>{/* 錯誤: {error} */}</div>

  return (
    <div>
      <h3>好友邀請</h3>
      {pendingRequests.length === 0 ? (
        <p>沒有好友請求</p>
      ) : (
        <div className='mx-2'>
          {pendingRequests.map((request, i) => (
            <div key={request.id} style={styles.header}>
              <img
                src={`http://localhost:3005/avatar/${request.avatar}`}
                alt={`${request.avatar} 頭像`}
                style={styles.avatar}
              />
              {request.name}{' '}
              {request.status === 'pending' && (
                <>
                  <button onClick={() => acceptFriendRequest(request.id)}>
                    同意
                  </button>
                  <button onClick={() => rejectFriendRequest(request.id)}>
                    拒絕
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
const styles ={
  avatar: {
    width: '35px',
    height: '35px',
    borderRadius: '50%',
    margin: '2px 5px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
}
export default FriendList
