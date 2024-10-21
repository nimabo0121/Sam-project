import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import toast from 'react-hot-toast'
import { getUserById } from '@/services/user'
import MemberImage from '../user-test/member-image'
import { avatarBaseUrl } from '@/configs'

const initUserProfile = {
  avatar: '',
}

export default function MemberTop() {
  const { auth } = useAuth()
  const [userProfile, setUserProfile] = useState(initUserProfile)
  const [hasProfile, setHasProfile] = useState(false)

  const getUserData = async (id) => {
    try {
      const res = await getUserById(id)
      if (res.data.status === 'success') {
        const { avatar } = res.data.data.user
        setUserProfile({ avatar })
        // toast.success('會員頭像載入成功')
      } else {
        // toast.error('無法獲取會員頭像')
      }
    } catch (error) {
      console.error('Error fetching user avatar:', error)
      toast.error('發生錯誤，無法獲取會員頭像')
    }
  }

  useEffect(() => {
    if (auth.isAuth) {
      getUserData(auth.userData.id)
    }
  }, [auth])

  useEffect(() => {
    if (userProfile.avatar) {
      setHasProfile(true)
    }
  }, [userProfile.avatar])

  if (!auth.isAuth) return null // 或者返回未授權的 UI

  return (
    <>
        <MemberImage
          avatarImg={userProfile.avatar}
          avatarBaseUrl={avatarBaseUrl}
        />
    </>
  )
}
