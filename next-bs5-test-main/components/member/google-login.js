import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { googleLogin, getUserById, parseJwt } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import GoogleLogo from '@/components/icons/google-logo'
import useFirebase from '@/hooks/use-firebase'

export default function GoogleLoginPopup() {
  const { loginGoogle, logoutFirebase } = useFirebase()
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // 處理 Google 登入後，要向伺服器進行登入動作
  const callbackGoogleLoginPopup = async (providerData) => {
    console.log(providerData)

    // 如果目前 react(next) 已經登入中，不需要再作登入動作
    if (auth.isAuth) return

    // 向伺服器進行登入動作
    const res = await googleLogin(providerData)

    if (res.data.status === 'success') {
      // 從 JWT 存取令牌中解析出會員資料
      const jwtUser = parseJwt(res.data.data.accessToken)

      const res1 = await getUserById(jwtUser.id)

      if (res1.data.status === 'success') {
        // 只需要 initUserData 中的定義屬性值，詳見 use-auth 鉤子
        const dbUser = res1.data.data.user
        const userData = { ...initUserData }

        for (const key in userData) {
          if (Object.hasOwnProperty.call(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }

        // 設定到全域狀態中
        setAuth({
          isAuth: true,
          userData,
        })

        toast.success('已成功登入')

        // 登入成功後導向指定頁面，例如 '/member/profile'
        router.push('/member/profile')
      } else {
        toast.error('登入後無法得到會員資料')
        // 這裡可以讓會員登出，因為這也算登入失敗，有可能會造成資料不統一
      }
    } else {
      toast.error(`登入失敗`)
    }
  }

  return (
    <>
      <button
        className="mx-2"
        onClick={() => loginGoogle(callbackGoogleLoginPopup)}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          padding: 0,
        }}
      >
        <GoogleLogo />
      </button>
      <Toaster />
    </>
  )
}
