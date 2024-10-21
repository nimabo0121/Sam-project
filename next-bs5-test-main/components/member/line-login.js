import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { initUserData, useAuth } from '@/hooks/use-auth'
import LineLogo from '@/components/icons/line-logo'
import {
  lineLoginRequest,
  lineLogout,
  lineLoginCallback,
  getUserById,
  parseJwt,
} from '@/services/user'
import toast from 'react-hot-toast'

export default function LineLogin() {
  const { auth, setAuth } = useAuth() // 使用自定義的 useAuth 鉤子來獲取和設置用戶認證狀態
  const router = useRouter() // 使用 useRouter 鉤子來獲取路由實例

  // 處理登出功能
  const handleLineLogout = async () => {
    if (!auth.isAuth) return // 如果用戶未認證，則退出函數

    const res = await lineLogout(auth.userData.line_uid) // 調用後端 API 進行 Line 登出

    console.log(res.data) // 在控制台中輸出後端 API 的返回數據

    // 如果登出成功，則恢復初始會員狀態
    if (res.data.status === 'success') {
      toast.success('已成功登出') // 使用 toast 提示用戶登出成功

      setAuth({
        isAuth: false,
        userData: initUserData, // 將用戶數據恢復為初始狀態
      })
    } else {
      toast.error(`登出失敗`) // 使用 toast 提示用戶登出失敗
    }
  }

  // 處理 Line 登入後向伺服器進行登入動作的回調函數
  const callbackLineLogin = async (query) => {
    const res = await lineLoginCallback(query) // 調用後端 API 進行 Line 登入回調

    console.log(res.data) // 在控制台中輸出後端 API 的返回數據

    if (res.data.status === 'success') {
      // 從 JWT 存取令牌中解析出用戶資料
      const jwtUser = parseJwt(res.data.data.accessToken)

      const res1 = await getUserById(jwtUser.id) // 根據用戶 ID 從後端獲取用戶詳細資料

      if (res1.data.status === 'success') {
        // 只需要 initUserData 中的定義屬性值，詳見 use-auth 鉤子
        const dbUser = res1.data.data.user
        const userData = { ...initUserData }

        for (const key in userData) {
          if (Object.hasOwnProperty.call(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }

        // 將用戶資料設定到全局狀態中
        setAuth({
          isAuth: true,
          userData,
        })

        toast.success('已成功登入') // 使用 toast 提示用戶登入成功

        // 登入成功後導向至 /
        router.push('/')
      } else {
        toast.error('登入後無法獲取會員資料') // 使用 toast 提示無法獲取會員資料的錯誤
        // 這裡可以讓會員登出，因為這也算登入失敗，有可能會造成資料不統一
      }
    } else {
      toast.error(`已是登入狀態或登入失敗`) // 使用 toast 提示已是登入狀態或登入失敗的錯誤
    }
  }

  // 處理點擊 Line 登入按鈕的函數
  const goLineLogin = () => {
    // 如果已經登入，則不進行登入操作
    if (auth.isAuth) return

    // 從後端伺服器獲取 Line 登入網址
    lineLoginRequest()
  }

  // 當從 Line 登入畫面回調到本頁面時執行的效果
  useEffect(() => {
    // 確保路由已經準備就緒
    if (router.isReady) {
      // 如果 URL 中沒有 code 參數，則不進行任何操作
      if (!router.query.code) return

      // 發送至後端伺服器獲取 Line 會員資料
      callbackLineLogin(router.query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query])

  return (
    <>
      <button
        className="mx-2"
        onClick={goLineLogin}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
        }}
      >
        <LineLogo />
      </button>
    </>
  )
}
