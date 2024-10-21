import { useState } from 'react'
import styles from './member.module.css'
import Link from 'next/link'

import dynamic from 'next/dynamic'

import { register } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'

// Datepicker relies on browser APIs like document
// dynamically load a component on the client side,
// use the ssr option to disable server-rendering.

const InputDatePicker = dynamic(() => import('../common/input-date-picker'), {
  ssr: false,
})

export default function RegisterForm() {
  const [showDatepicker, setShowDatepicker] = useState(false)

  const [date, setDate] = useState('')
  const [user, setUser] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    sex: '',
    birth_date: '',
    phone: '',
  })
  const handleDateSelection = (selectedDate) => {
    setDate(selectedDate) // 更新日期
    setUser((prevUser) => ({
      ...prevUser,
      birth_date: selectedDate, // 更新 birth_date 字段
    }))
    setShowDatepicker(false) // 關閉日期選擇
  }
  // 輸入帳號 密碼用
  const handleFieldChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault()

    const res = await register(user)

    console.log(res.data)

    if (res.data.status === 'success') {
      toast.success('會員註冊成功')
    } else {
      toast.error(`會員註冊失敗`)
    }
  }

  return (
    <>
      <main className={`w-100 m-auto text-center form-member`}>
        <h2 className="text-center mb-3">加入會員</h2>
        <form onSubmit={handleSubmit}>
        <div className="row mb-3">
            <div className="col-sm-6">
              <input
                type="text"
                name="name"
                className={`form-control `}
                placeholder="姓名"
                value={user.name}
                onChange={handleFieldChange}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12">
              <input
                type="text"
                name="username"
                className={`form-control w-100 ${styles['form-control']} `}
                placeholder="帳號"
                value={user.username}
                onChange={handleFieldChange}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12">
              <input
                type="password"
                name="password"
                className={`form-control w-100  `}
                value={user.password}
                onChange={handleFieldChange}
                placeholder="密碼"
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-sm-12">
              <input
                type="text"
                name="phone"
                className={`form-control w-100  `}
                value={user.phone}
                onChange={handleFieldChange}
                maxLength={10}
                placeholder="手機號碼"
              />
            </div>
          </div>
          

          <div className="row mb-3">
            <div className="col-sm-12">
              <input
                type="text"
                name="email"
                className={`form-control w-100 `}
                placeholder="電子郵件地址"
                value={user.email}
                onChange={handleFieldChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-12">
              <div className="input-group position-relative d-inline-flex align-items-center">
                <InputDatePicker
                  showDatepicker={showDatepicker}
                  setFormat="yyyy-mm-dd"
                  showFormat="yyyy/mm/dd"
                  setDate={handleDateSelection}
                  className={`form-control w-100 ${styles['form-control']} `}
                  style={{
                    borderRadius: 2.8,
                  }}
                  placeholder="出生年月日"
                />
                <i
                  className="bi bi-calendar4 position-absolute"
                  role="presentation"
                  style={{ right: 10, cursor: 'pointer', zIndex: 100 }}
                  onClick={() => setShowDatepicker(!showDatepicker)}
                ></i>
              </div>
            </div>
          </div>
          {/* <div className="row mb-3">
            <div className={`col-sm-12" ${styles['label-left']}`}>
              <label htmlFor="country" className="form-label">
                國家/地區
              </label>
              <select id="country" className="form-select">
                <option>台灣</option>
                <option>日本</option>
                <option>韓國</option>
                <option>中國</option>
              </select>
            </div>
          </div> */}
          <div className="row mb-3">
            <div className="btn-group">
              <input
                type="radio"
                className="btn-check"
                name="sex"
                id="option1"
                autoComplete="off"
                value="男"
                checked={user.sex === '男'}
                onChange={handleFieldChange}
              />
              <label className="btn btn-outline-primary" htmlFor="option1">
                男
              </label>
              <input
                type="radio"
                className="btn-check"
                name="sex"
                id="option2"
                autoComplete="off"
                value="女"
                checked={user.sex === '女'}
                onChange={handleFieldChange}
              />
              <label className="btn btn-outline-primary" htmlFor="option2">
                女
              </label>
            </div>
          </div>

          <div className="row mb-2"></div>
          <button type="submit" className="btn btn-primary w-100">
            加入
          </button>
          <br />
          <button
            className="btn btn-primary w-100 mt-2"
            type="button"
            onClick={() => {
              // 測試帳號 herry/11111
              setUser({
                name: 'apple',
                email: 'ron@test.com',
                username: 'asd123456',
                password: '11111',
                sex: '男',
                birth_date: '1999-01-11',
                phone: '0962033555',
              })
            }}
          >
            一鍵輸入範例
          </button>
          <div className="row mt-2">
            <p className={`${styles['notice']}`}>
              已經是會員了嗎？ <Link href="/member/login">登入</Link>。
            </p>
          </div>
        </form>
        {/* 土司訊息視窗用 */}
        <Toaster />
      </main>
    </>
  )
}
