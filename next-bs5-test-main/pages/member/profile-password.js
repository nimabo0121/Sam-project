import React, { useState } from 'react'
import Link from 'next/link'
import toast, { Toaster } from 'react-hot-toast'
import { updatePassword } from '@/services/user'
import { useAuth } from '@/hooks/use-auth'
import MemberNavbar from '@/components/layout/default-layout/my-navbar/member-navbar'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

const initUserPassword = {
  origin: '', // 原本密碼，要比對成功才能修改
  new: '', // 新密碼
  confirm: '', //確認新密碼用(前端檢查用，不送後端)
}

export default function ForgetPassword() {
  const { auth } = useAuth()
  const [userPassword, setUserPassword] = useState(initUserPassword)

  const [showPassword, setShowPassword] = useState(false)
  const handleFieldChange = (e) => {
    setUserPassword({ ...userPassword, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!userPassword.new || !userPassword.origin || !userPassword.confirm) {
      toast.error('密碼欄位為必填')
      return
    }

    if (userPassword.new !== userPassword.confirm) {
      toast.error('新密碼與確認密碼不同')
      return
    }

    const password = { origin: userPassword.origin, new: userPassword.new }
    const res = await updatePassword(auth.userData.id, password)

    if (res.data.status === 'success') {
      toast.success('會員密碼修改成功')
    } else {
      toast.error('會員密碼修改失敗')
    }
  }

  if (!auth.isAuth) return <></>

  return (
    <>
      <MemberNavbar />
      <Container>
        <div className="d-flex justify-content-center">
          <Card className="shadow p-4" style={{ width: '31rem' }}>
            <h2 className="text-center mb-4">修改密碼</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formOriginPassword">
                <Form.Label>目前密碼</Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="origin"
                  value={userPassword.origin}
                  onChange={handleFieldChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formNewPassword">
                <Form.Label>新密碼</Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="new"
                  value={userPassword.new}
                  onChange={handleFieldChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>新密碼確認</Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  name="confirm"
                  value={userPassword.confirm}
                  onChange={handleFieldChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formShowPassword">
                <Form.Check
                  type="switch"
                  id="showPasswordSwitch"
                  label="顯示密碼"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="d-block mx-auto"
              >
                修改
              </Button>
            </Form>
          </Card>
        </div>
        <Toaster />
      </Container>
    </>
  )
}
