import React, { useState } from 'react'
import axios from 'axios'

const FriendManager = () => {
  const [searchQuery, setSearchQuery] = useState('') // 搜尋查詢
  const [users, setUsers] = useState([]) // 存放用戶資料
  const [loading, setLoading] = useState(false) // 加載狀態
  const [error, setError] = useState('') // 錯誤信息
  const [successMessage, setSuccessMessage] = useState('') // 成功信息

  // 獲取用戶資料的函數
  const fetchUsers = async (query) => {
    setLoading(true) // 開始加載
    setError('') // 清空錯誤信息
    setSuccessMessage('') // 清空成功信息

    try {
      const response = await axios.get(
        `http://localhost:3005/api/users/search?query=${query}`,
        {
          withCredentials: true, // 請求攜帶 cookies
        }
      )

      // console.log(response.data) // 檢查 API 的響應數據

      // 根據 API 響應格式設置 users
      if (response.data.status === 'success') {
        setUsers(response.data.data.users) // 設置 users 陣列
      } else {
        setError('未找到用戶資料')
      }
    } catch (err) {
      console.error(err) // 顯示錯誤信息
      setError('獲取用戶資料出錯！' + (err.response?.data?.message || ''))
    } finally {
      setLoading(false) // 結束加載
    }
  }

  // 處理搜尋請求
  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchUsers(searchQuery.trim()) // 獲取用戶資料
    }
  }

  // 處理添加好友的請求
  const handleAddFriend = async (userId) => {
    try {
      const response = await axios.post(
        `http://localhost:3005/api/friends/add`,
        { userId }, // 要添加好友的用戶 ID
        { withCredentials: true } // 確保請求攜帶 cookies
      )

      if (response.data.status === 'success') {
        setSuccessMessage(``) // 修正字段名
        // 更新本地狀態，將該用戶的狀態設為 pending
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, status: 'pending' } : user
          )
        )
      } else {
        setError('添加好友失敗')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || '添加好友時出錯！') // 提供錯誤信息
    }
  }

  return (
    <div className='pt-5'>
      {/* <h1>搜尋</h1> */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // 更新搜尋查詢
        placeholder="用戶名稱"
      />
      <button onClick={handleSearch}>搜尋</button> {/* 搜尋按鈕 */}
      {loading && <p>加載中...</p>} {/* 加載中提示 */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* 顯示錯誤信息 */}
      {/* {successMessage && (
        <p style={{ color: 'green' }}>{successMessage}</p>
      )}{' '} */}
      {/* 顯示成功信息 */}
      <div className="pt-2">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id}>
              <p>
                <img
                className='mx-2'
                  src={`http://localhost:3005/avatar/${user.avatar}`} // 後端 API 圖片路徑
                  alt={`${user.name} 頭像`}
                  style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                />
                {user.name} {/* 顯示用戶名稱 */}
                {user.status === 'accepted' ? (
                  <span className="mx-2"></span> // 已接受邀請，顯示文字
                ) : user.status === 'pending' ? (
                  <button className="mx-2" disabled>
                    已發送邀請
                  </button> // 已發送邀請，顯示禁用按鈕
                ) : (
                  <button
                    className="mx-2"
                    onClick={() => handleAddFriend(user.id)} // 點擊按鈕時添加好友
                  >
                    添加好友
                  </button>
                )}
              </p>
            </div>
          ))
        ) : (
          <p></p> // 顯示未找到用戶的提示
        )}
      </div>
    </div>
  )
}

export default FriendManager
