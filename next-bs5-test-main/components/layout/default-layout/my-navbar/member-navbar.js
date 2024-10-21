import Container from 'react-bootstrap/Container'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export default function MemberNavbar() {
  const router = useRouter()

  useEffect(() => {
    const navLinks = document.querySelectorAll('.nav-link')

    // 更新當前頁面活動
    navLinks.forEach(function (link) {
      if (router.asPath === link.getAttribute('href')) {
        link.classList.add('active')
      } else {
        link.classList.remove('active')
      }
    })
  }, [router.asPath]) // 依賴項 router.asPath，變化時重新執行

  return (
    <>
      <div
        className="container d-flex justify-content-center pt-3"
        style={{
          position: 'relative',
          margin: '0px',
          border: '0px',
          
        }}
      >
        <ul className="nav nav-tabs flex-nowrap" style={{zIndex: '999'}}>
          <li className="nav-item">
            <Link href="/member/profile" legacyBehavior>
              <a className="nav-link" aria-current="page">
                會員資料
              </a>
            </Link>
          </li>

          <li className="nav-item">
            <Link href="/member/profile-password" legacyBehavior>
              <a className="nav-link" aria-current="page">
                密碼修改
              </a>
            </Link>
          </li>

          {/* <li className="nav-item">
            <Link href="/member/new-cart" legacyBehavior>
              <a className="nav-link" aria-current="page">
                我的訂單
              </a>
            </Link>
          </li> */}

          {/* <li className="nav-item">
            <Link href="/member/log-cart" legacyBehavior>
              <a className="nav-link" aria-current="page">
                歷史訂單
              </a>
            </Link>
          </li> */}

          {/* <li className="nav-item">
            <Link href="/member/offers" legacyBehavior>
              <a className="nav-link " aria-current="page">
                專屬優惠
              </a>
            </Link>
          </li> */}
        </ul>
      </div>
      <style jsx>
        {`
          li {
            margin-right: 2px; /* 預設間距 */
          }

          @media (max-width: 767px) {
            li {
              margin-right: 1px; /* 手機板縮小間距 */
            }
          }

          div {
            color: pink;
          }
          .nav-link {
            background-color: orange;
            border-radius: 10px 10px 0px 0px;
            color: black;
          }
          .nav-link.active {
            background-color: red;
            color: white;
          }
        `}
      </style>
    </>
  )
}
