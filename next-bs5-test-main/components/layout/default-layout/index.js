import React, { useState } from 'react'
import MyNavbarBS5 from './my-navbar'
import MyFooter from './my-footer'
import Head from 'next/head'
import { useLoader } from '@/hooks/use-loader'
import FriendNavbar from './my-navbar/friend-navbar'
import ChatWindow from '@/components/friend/chat-window'
import { useAuth } from '@/hooks/use-auth' // 判斷login hooks

export default function DefaultLayout({ title = 'Next-BS5', children }) {
  const { loader } = useLoader()
  const { auth } = useAuth() // 判斷是否 login
  const [activeChat, setActiveChat] = useState(null) // 在 DefaultLayout 中管理聊天狀態

  const openChat = (friendId, friendName, friendAvatar) => {
    setActiveChat({ id: friendId, name: friendName, avatar: friendAvatar }) // 設置當前聊天的好友
  }

  const closeChat = () => {
    setActiveChat(null) // 關閉聊天窗口
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      <MyNavbarBS5 />
      <main className="flex-shrink-0 mt-0">
        <div
          className="mt-5"
          style={{
            position: 'relative',
            margin: '0px',
            border: '0px',
            width: '100%',
            height: '100%',
          }}
        >
          {/* 登入才顯示FriendNavbar */}
          {/* 傳遞 openChat 方法給 FriendNavbar */}
          {/* {console.log("auth 狀態: ", auth)} */}
          {auth.isAuth && <FriendNavbar onChatOpen={openChat} />}

          <div
            className="content-wrapper container pt-2"
            style={{ zIndex: '999' }}
          >
            {children}
          </div>

          {/* 如果有選擇的聊天對象，顯示 ChatWindow */}
          {activeChat && (
            <ChatWindow
              friendId={activeChat.id}
              friendName={activeChat.name}
              friendAvatar={activeChat.avatar}
              onClose={closeChat}
              isOpen={Boolean(activeChat)}
            />
          )}

          {/* 全域的載入動畫指示器 */}
          {loader()}
        </div>
      </main>

      <MyFooter />
    </>
  )
}
