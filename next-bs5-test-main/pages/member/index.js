import { useEffect } from 'react'
import { useRouter } from 'next/router'

// 重新導覽至/member/profile
export default function MemberIndex() {
  const router = useRouter()

  useEffect(() => {
    // 確保在瀏覽器中
    if (typeof window !== 'undefined') {
      router.push('/member/profile')
    }
  }, [router]) // 依賴於 router 變數

  return null // 返回 null 以避免不必要的渲染
}
