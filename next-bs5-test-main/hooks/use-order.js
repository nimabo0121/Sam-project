// OrderProvider.jsx

import React, { useState, useContext, createContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { checkAuth } from '@/services/user'

const AuthContext = createContext(null)

export const initUserData = {
  id: 0,
  username: '',
  google_uid: '',
  line_uid: '',
  name: '',
  email: '',
  iat: '',
  exp: '',
}

export const OrderProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuth: false,
    userData: initUserData,
  })

  const [purchaseOrders, setPurchaseOrders] = useState([])

  const router = useRouter()
  const loginRoute = '/test/user'
  const protectedRoutes = [
    '/test/user/status',
    '/test/user/profile',
    '/test/user/profile-password',
  ]

  const handleCheckAuth = async () => {
    try {
      const res = await checkAuth()
      if (res.data.status === 'success') {
        const dbUser = res.data.data.user
        const userData = { ...initUserData }
        for (const key in userData) {
          if (Object.prototype.hasOwnProperty.call(dbUser, key)) {
            userData[key] = dbUser[key] || ''
          }
        }
        setAuth({ isAuth: true, userData })
        setPurchaseOrders(res.data.data.purchaseOrders || [])
      } else {
        console.warn('Authentication check failed:', res.data)
        if (protectedRoutes.includes(router.pathname)) {
          router.push(loginRoute)
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error)
    }
  }

  useEffect(() => {
    if (router.isReady && !auth.isAuth) {
      handleCheckAuth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, auth.isAuth])

  return (
    <AuthContext.Provider value={{ auth, purchaseOrders }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
