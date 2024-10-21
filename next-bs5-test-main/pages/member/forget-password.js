import { useState, useEffect } from 'react'
import useInterval from '@/hooks/use-interval'
import { requestOtpToken, resetPassword } from '@/services/user'
import toast, { Toaster } from 'react-hot-toast'
import Form from 'react-bootstrap/Form'
export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [disableBtn, setDisableBtn] = useState(false)
  const [count, setCount] = useState(60) // 60s
  const [delay, setDelay] = useState(null) // delay=null可以停止, delay是數字時會開始倒數
  const [showPassword, setShowPassword] = useState(false)
  useInterval(() => {
    setCount(count - 1)
  }, delay)

  useEffect(() => {
    if (count <= 0) {
      setDelay(null)
      setDisableBtn(false)
    }
  }, [count])

  const handleRequestOtpToken = async () => {
    if (delay !== null) {
      toast.error('錯誤 - 60s內無法重新獲得驗証碼')
      return
    }

    const res = await requestOtpToken(email)

    if (res.data.status === 'success') {
      toast.success('驗証碼已寄送到電子郵件中')
      setCount(60) // 倒數 60秒
      setDelay(1000) // 每 1000ms = 1s 減1
      setDisableBtn(true)
    } else {
      toast.error(`${res.data.message}`)
    }
  }

  const handleResetPassword = async () => {
    const res = await resetPassword(email, password, token)

    if (res.data.status === 'success') {
      toast.success('密碼已成功修改')
    } else {
      toast.error(`${res.data.message}`)
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <h2 className="text-center mb-4 mt-1">重設密碼</h2>
            <div className="card-body">
              <label className="my-2">
                電子郵件信箱:
                <input
                  type="text"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <button
                className="btn btn-primary my-2 mx-3"
                onClick={handleRequestOtpToken}
                disabled={disableBtn}
              >
                {delay ? count + '秒後可以再次取得驗証碼' : '取得驗証碼'}
              </button>
              <br />
              <label className="my-2">
                請輸入驗証碼:
                <input
                  type="text"
                  className="form-control"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
              </label>
              <br />
              <label className="my-2">
                新密碼:
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              <Form.Group className="mb-3" controlId="formShowPassword">
                <Form.Check
                  type="switch"
                  id="showPasswordSwitch"
                  label="顯示密碼"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
              </Form.Group>
              <div className="text-center">
                <button
                  className="btn btn-primary my-2"
                  onClick={handleResetPassword}
                >
                  重設密碼
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 土司訊息視窗用 */}
      <Toaster />
    </div>
  )
}
