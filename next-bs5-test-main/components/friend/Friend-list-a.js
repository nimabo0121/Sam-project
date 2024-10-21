import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FriendListA = ({ onChatOpen }) => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3005/api/friends/accepted',
          { withCredentials: true }
        );
        if (response.data.status === 'success') {
          setAcceptedRequests(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError('無法獲取好友列表');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedRequests();
  }, []);

  // 加載和錯誤處理
  if (loading) return <div>加載中...</div>;
  if (error) return (
    <div>
      <p>錯誤: {error}</p>
      <button onClick={() => window.location.reload()}>重試</button> {/* 重試按鈕 */}
    </div>
  );

  return (
    <div>
      <h2>好友列表</h2>
      {acceptedRequests.length === 0 ? (
        <p>目前沒有好友</p>
      ) : (
        <>
          {acceptedRequests.map((request) => (
            <div
              key={request.id}
              onClick={() => onChatOpen(request.id, request.name, request.avatar)} // 點擊好友時傳遞好友ID和名稱
              style={{
                cursor: 'pointer',
                margin: '10px 0',
                display: 'flex',
                alignItems: 'center',
                padding: '5px',
                borderRadius: '5px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
            >
              <img
                className="mx-2"
                src={`http://localhost:3005/avatar/${request.avatar}`}
                alt={`${request.name} 頭像`}
                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
              />
              <span>{request.name}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FriendListA;
