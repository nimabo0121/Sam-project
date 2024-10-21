import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import FriendListA from '@/components/friend/Friend-list-a'
import FriendManager from '@/components/friend/Friend-manager'
import FriendList from '@/components/friend/Friend-list'

export default function FriendNavbar({ onChatOpen }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="container-fluid pt-2 position-absolute ">
      {/* Toggle Button */}
      <nav
        id="sidebar"
        className={`sidebar position-absolute ${isCollapsed ? '' : ''}`}
        style={{
          height: '100%',
          width: isCollapsed ? '35px' : '250px',
          transition: 'width 0.3s',
        }}
      >
        <div
          className="d-flex justify-content-end position-absolute"
          style={{ top: '10px', right: '10px', zIndex: 1 }}
        >
          <button className="btn btn-light" onClick={toggleSidebar}>
            {isCollapsed ? '>' : '<'}
          </button>
        </div>
        <div className="position-sticky">
          {!isCollapsed && (
            <div className="nav flex-column">
              <FriendManager />
              <FriendList />
              {/* 傳遞 onChatOpen 方法給 FriendListA */}
              <FriendListA onChatOpen={onChatOpen} />
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
