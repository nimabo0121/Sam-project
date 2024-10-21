import React, { useState } from 'react'
import styles from './member.module.css'
import Link from 'next/link'
import { initUserData, useAuth } from '@/hooks/use-auth'
import { login, getUserById } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/router'
import GoogleLoginPopup from './google-login'
import LineLogin from './line-login'

const parseJwt = (token) => {
  const base64Payload = token.split('.')[1]
  const payload = Buffer.from(base64Payload, 'base64')
  return JSON.parse(payload.toString())
}

export default function LoginForm() {
  const [user, setUser] = useState({ username: '', password: '' })
  const { setAuth } = useAuth()
  const router = useRouter()
  const [errors, setErrors] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  const handleFieldChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = { username: '', password: '' }

    if (!user.username) {
      newErrors.username = '帳號為必填'
    }

    if (!user.password) {
      newErrors.password = '密碼為必填'
    } else if (user.password.length < 5 || user.password.length > 10) {
      newErrors.password = '密碼長度應在5到10個字符之間'
    }

    setErrors(newErrors)

    const hasErrors = Object.values(newErrors).some((v) => v)

    if (!hasErrors) {
      await handleLogin()
    }
  }

  const handleLogin = async () => {
    try {
      const res = await login(user)

      if (res.data.status === 'success') {
        const jwtUser = parseJwt(res.data.data.accessToken)
        const res1 = await getUserById(jwtUser.id)

        if (res1.data.status === 'success') {
          const dbUser = res1.data.data.user
          const userData = { ...initUserData }

          for (const key in userData) {
            if (Object.prototype.hasOwnProperty.call(dbUser, key)) {
              userData[key] = dbUser[key]
            }
          }

          setAuth({
            isAuth: true,
            userData,
          })

          toast.success('已成功登入')
          router.push('/')
        } else {
          toast.error('登入後無法獲得會員資料')
        }
      } else {
        toast.error('登入失敗')
      }
    } catch (error) {
      console.error('登入時發生錯誤：', error)
      toast.error('登入時發生錯誤')
    }
  }

  return (
    <main
      className={`form-member w-100 m-auto text-center`}
      style={{ zIndex: '999' }}
    >
      <h2 className="text-center mb-5">會員登入</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-sm-12">
            <input
              type="text"
              name="username"
              value={user.username}
              className={`form-control w-100 ${styles['form-control']}`}
              placeholder="帳號"
              onChange={handleFieldChange}
            />
            <div className="error">{errors.username}</div>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-12">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={user.password}
              className={`form-control w-100 ${styles['form-control']}`}
              placeholder="密碼"
              onChange={handleFieldChange}
            />
            <div className="error">{errors.password}</div>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <span className="ms-1">顯示密碼</span>
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-sm-6 text-start">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="gridCheck1"
              />
              <label
                className={`form-check-label  ${styles['notice']}`}
                htmlFor="gridCheck1"
              >
                保持登入狀態
              </label>
            </div>
          </div>
          <div className="col-sm-4 offset-sm-2 text-end">
            <Link
              href="/member/forget-password"
              className={`${styles['notice']}`}
            >
              忘記密碼？
            </Link>
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">
          登入
        </button>
        <button
          className="mt-2 btn btn-primary w-100"
          onClick={() => setUser({ username: 'herry', password: '11111' })}
        >
          一鍵輸入
        </button>
        <div className="row mt-2">
          <p className={`${styles['notice']}`}>
            還不是會員？
            <Link href="/member/register">加入我們</Link>。
          </p>
        </div>

        <div className={`mb-3 ${styles['hr-sect']}`}>快速登入</div>
      </form>
      <div className="row mb-2">
        <div className="col-sm-12 text-center">
          <div className="d-flex justify-content-center">
            <LineLogin />
            <GoogleLoginPopup />
            {/* <FacebookLogo className="mx-3" /> */}
          </div>
        </div>
      </div>
      <Toaster />
      <style jsx>
        {`
          .error {
            color: red;
            font-size: 12px;
            height: 16px;
          }
        `}
      </style>
    </main>
  )
}
