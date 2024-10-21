import Link from 'next/link'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { logout } from '@/services/user'
import { useAuth } from '@/hooks/use-auth'
import MemberTop from '@/components/member/member-top'
import { useRouter } from 'next/router'

export default function Toolbar({ handleShow }) {
  const { auth, setAuth } = useAuth()
  const router = useRouter()

  // 登出
  const handleLogout = async () => {
    const res = await logout()

    if (res.data.status === 'success') {
      toast.success('已成功登出')
      setAuth({
        isAuth: false,
        userData: null,
      })
      router.push('/')
    } else {
      toast.error('登出失败')
    }
  }

  // 監聽
  useEffect(() => {
    // 如果 auth.isAuth = true，執行登入後變化
  }, [auth.isAuth])

  return (
    <ul className="navbar-nav pe-2 ms-auto">
      {/* <li className="nav-item">
        <Link
          className="nav-link btn btn-outline-light"
          href="/cart"
          role="button"
          title="購物車"
        >
          <i className="bi bi-cart-fill"></i>
          <p className="d-none d-md-inline d-lg-none"> 購物車</p>
        </Link>
      </li> */}
      {auth.isAuth ? (
        <>
          <li className="nav-item ">
            <span className="nav-link btn btn-outline-light">
              <Link className="dropdown-item text-center" href="/about">
                客服中心
              </Link>
            </span>
          </li>
          <li className="nav-item dropdown">
            <span
              className="nav-link dropdown-toggle btn btn-outline-light"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              title="會員中心"
            >
              <span>{auth.userData.name}</span>
              <p className="d-none d-md-inline d-lg-none">會員中心</p>
            </span>
            <ul className={`dropdown-menu dropdown-menu-end p-4`}>
              <li>
                <div className="text-center">
                  <MemberTop />
                </div>
                <div className="text-center">
                  會員姓名: {auth.userData.name}
                  <br />
                  <Link
                    className="dropdown-item text-center"
                    href="/member/member-page"
                  >
                    個人首頁
                  </Link>
                  <br />
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleLogout}
                  >
                    登出
                  </button>
                </div>
              </li>
              <li>
                <Link
                  className="dropdown-item text-center"
                  href="/member/profile"
                >
                  會員管理區
                </Link>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
            </ul>
          </li>

          {/* <li className="nav-item">
            <span
              className="nav-link btn btn-outline-light"
              role="presentation"
              onClick={(e) => {
                e.preventDefault()
                handleShow()
              }}
              title="展示"
            >
              <i className="bi bi-mortarboard-fill"></i>
              <p className="d-none d-md-inline d-lg-none"> 展示</p>
            </span>
          </li> */}
        </>
      ) : (
        <>
          <li className="nav-item">
            <Link
              className="nav-link btn btn-outline-light"
              href="/member/login"
              role="button"
              title="Login"
            >
              <span>登入</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link btn btn-outline-light"
              href="/member/register"
              role="button"
              title="Register"
            >
              <span>註冊</span>
            </Link>
          </li>
        </>
      )}
      <Toaster />
    </ul>
  )
}
