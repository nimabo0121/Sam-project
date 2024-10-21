import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getUserById } from '@/services/user'

const initUserProfile = {
  name: '',
  sex: '',
  phone: '',
  birth_date: '',
  avatar: '',
  username: '',
  name1: '',
  phone1: '',
  zip1: '',
  county1: '',
  district1: '',
  address1: '',
  name2: '',
  phone2: '',
  zip2: '',
  county2: '',
  district2: '',
  address2: '',
  order_address1: '',
}

const MemberLevel = () => {
  const { auth } = useAuth()
  const [userProfile, setUserProfile] = useState(initUserProfile)
  const [totalAmount, setTotalAmount] = useState(0) // 累積消費金額的狀態
  const [membershipLevel, setMembershipLevel] = useState('普通會員') // 會員等級的狀態
  const [nextLevelAmount, setNextLevelAmount] = useState(2000) // 距離下一個等級所需金額的狀態
  const [progressWidth, setProgressWidth] = useState('0%') // 進度條的寬度狀態

  // 定義會員等級和對應的目標金額
  const membershipTargets = [
    { level: 'VIP', amount: 2000 },
    { level: 'VIP999', amount: 7000 },
    { level: '魔關羽', amount: 12000 },
    { level: '尊貴會員', amount: 20000 },
  ]

  // 讀取user資料
  const getUserData = async (id) => {
    try {
      const res = await getUserById(id)

      if (res.data.status === 'success') {
        const dbUser = res.data.data.user
        const dbPurchaseOrders = res.data.data.purchaseOrders.filter(
          (order) => order.status === '已付款' || order.status === '完成訂單'
        )

        // 計算累積金額
        const accumulatedAmount = dbPurchaseOrders.reduce(
          (acc, order) => acc + order.amount,
          0
        )

        // 更新狀態中的累積金額
        setTotalAmount(accumulatedAmount)

        // 根據累積金額更新會員等級和下一個等級所需金額
        updateMembershipLevel(accumulatedAmount)
      } else {
        // 加載失敗
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  // 以累積金額去更新會員等級和下一個等級金額
  const updateMembershipLevel = (accumulatedAmount) => {
    let newMembershipLevel = '普通會員'
    let newNextLevelAmount = 2000

    // 累積金額>=第一個目標值，設置新的會員等級和下一個金額
    for (let i = 0; i < membershipTargets.length; i++) {
      const target = membershipTargets[i]
      if (accumulatedAmount >= target.amount) {
        newMembershipLevel = target.level
        if (i < membershipTargets.length - 1) {
          newNextLevelAmount =
            membershipTargets[i + 1].amount - accumulatedAmount
        } else {
          newNextLevelAmount = 0
        }
      }
    }

    // 如果未達到第一個目標值，計算進度條的百分比
    if (accumulatedAmount < membershipTargets[0].amount) {
      const percentage = (accumulatedAmount / membershipTargets[0].amount) * 100
      setProgressWidth(`${percentage}%`)
    } else {
      // 否則根據當前累積金額重新計算進度條寬度
      const currentTarget = membershipTargets.find(
        (target) => target.level === newMembershipLevel
      )
      const nextTarget = membershipTargets.find(
        (target) =>
          target.level !== newMembershipLevel &&
          accumulatedAmount < target.amount
      )
      const percentage =
        ((accumulatedAmount - currentTarget.amount) /
          (nextTarget.amount - currentTarget.amount)) *
        100
      setProgressWidth(`${percentage}%`)
    }

    // 更新會員等級和下一個等級所需金額的狀態
    setMembershipLevel(newMembershipLevel)
    setNextLevelAmount(newNextLevelAmount)
  }

  useEffect(() => {
    if (auth.isAuth) {
      getUserData(auth.userData.id)
    }
  }, [auth])

  useEffect(() => {
    if (userProfile.name) {
      // 在這裡處理當 userProfile 載入後的邏輯
    }
  }, [userProfile])

  const toggleDetails = (orderId) => {}

  useEffect(() => {
    // 每當 totalAmount 或者 progressWidth 改變時更新進度條
    const progressElement = document.querySelector('.progress-bar')
    if (progressElement) {
      progressElement.style.width = progressWidth
    }
  }, [totalAmount, progressWidth])

  return (
    <div className="">
      <div className="row">
        <div className="col">
          <span
            style={{
              marginRight: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            累積消費:
          </span>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 8px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              backgroundColor: '#ffffff',
              borderRadius: '3px',
              marginTop: '2px', 
              fontFamily: 'Arial, sans-serif',
            }}
          >
            {totalAmount}
          </span>
          <span style={{ marginLeft: '5px' }}>
            會員等級:{' '}
            <span id="spanText" className="fs-4 text-warning">
              {membershipLevel}
            </span>
            <span id="spanText1" className="fs-6 px-2">
              再消費 {nextLevelAmount} 即可升級
            </span>
          </span>
        </div>
      </div>

      <div className="progress">
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax={membershipTargets[membershipTargets.length - 1].amount}
          aria-valuenow={totalAmount}
          style={{ width: progressWidth }}
        ></div>
      </div>
    </div>
  )
}

export default MemberLevel
