import {
  updateProfile,
  getUserById,
  updateProfileAvatar,
} from '@/services/user'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import PreviewUploadImage from '@/components/user-test/preview-upload-image'
import { avatarBaseUrl } from '@/configs'
// import MemberLevel from '@/components/member/member-level'
// 縣市區下拉式
import TWZipCode from '@/components/tw-zipcode'

// 會員資料navbar
import MemberNavbar from '@/components/layout/default-layout/my-navbar/member-navbar'

// bootstrap 樣式
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// 定義要在此頁呈現/編輯的會員資料初始物件
const initUserProfile = {
  name: '',
  sex: '',
  phone: '',
  email: '',
  birth_date: '',
  avatar: '',
  username: '',
  name1: '', // 收件者name1
  phone1: '', // 收件者手機1
  zip1: '', // 區碼1
  county1: '', // 縣/市1
  district1: '', // 鄉鎮區1
  address1: '', // 地址1
  order_address1: '',
}

export default function Profile() {
  const { auth } = useAuth()
  const [userProfile, setUserProfile] = useState(initUserProfile)
  const [hasProfile, setHasProfile] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const handlePostcodeChange1 = (country, township, postcode) => {
    setUserProfile({
      ...userProfile,
      county1: country,
      district1: township,
      zip1: postcode,
    })
  }

  // const handlePostcodeChange2 = (country, township, postcode) => {
  //   setUserProfile({
  //     ...userProfile,
  //     county2: country,
  //     district2: township,
  //     zip2: postcode,
  //   })
  // }

  // !! 注意phone, birth_date...等資料並沒有在auth.userData中，需自行向伺服器獲取
  // 這裡的設計重點，是auth.userData或JWT存取令牌中，並不記錄"會改變"的會員資料(密碼當然更不行，會有安全性問題)
  // 因此更新會員資料與auth.userData或JWT存取令牌無關
  const getUserData = async (id) => {
    const res = await getUserById(id)

    console.log(res.data)

    if (res.data.status === 'success') {
      // 以下為同步化目前後端資料庫資料，與這裡定義的初始化會員資料物件的資料
      const dbUser = res.data.data.user
      const dbUserProfile = { ...initUserProfile }

      for (const key in dbUserProfile) {
        if (Object.hasOwn(dbUser, key)) {
          // 這裡要將null值的預設值改為空字串 ''
          dbUserProfile[key] = dbUser[key] || ''
        }
      }

      // 設定到狀態中
      setUserProfile(dbUserProfile)

      toast.success('會員資料載入成功')
    } else {
      toast.error(`會員資料載入失敗`)
    }
  }

  // auth載入完成後向資料庫要會員資料
  useEffect(() => {
    if (auth.isAuth) {
      getUserData(auth.userData.id)
    }
    // eslint-disable-next-line
  }, [auth])

  // 提示其它相關個人資料元件可以載入資料
  useEffect(() => {
    // 純粹觀察userProfile狀態變化用
    // console.log('userProfile狀態變化', userProfile)
    if (userProfile.name) {
      setHasProfile(true)
    }
  }, [userProfile])

  // 輸入一般資料用
  const handleFieldChange = (e) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value })
  }

  // 送出表單用
  const handleSubmit = async (e) => {
    // 阻擋表單預設送出行為
    e.preventDefault()

    // 這裡可以作表單驗証

    // 送到伺服器進行更新
    // 更新會員資料用，排除avatar
    // let isUpdated = false

    const { avatar, ...user } = userProfile
    const res = await updateProfile(auth.userData.id, user)

    // console.log(res.data)

    // 上傳頭像用，有選擇檔案時再上傳
    if (selectedFile) {
      const formData = new FormData()
      // 對照server上的檔案名稱 req.files.avatar
      formData.append('avatar', selectedFile)

      const res2 = await updateProfileAvatar(formData)

      // console.log(res2.data)
      if (res2.data.status === 'success') {
        toast.success('會員頭像修改成功')
      }
    }

    if (res.data.status === 'success') {
      toast.success('會員資料修改成功')
    } else {
      toast.error('會員資料修改失敗')
    }
  }

  // 未登入時，不會出現頁面內容
  if (!auth.isAuth) return

  return (
    <>
      <MemberNavbar />
      <div
        className="container d-flex justify-content-center"
        style={{ margin: '0px', border: '0px' }}
      >
        <Card className="shadow" style={{ width: '31rem', zIndex: '999' }}>
          <Card.Body>
            <h2 className="text-center mb-4">會員資料</h2>

            <div className="text-center mb-3">
              {hasProfile ? (
                // 如果有資料，顯示頭像預覽組件
                <PreviewUploadImage
                  avatarImg={userProfile.avatar}
                  avatarBaseUrl={avatarBaseUrl}
                  setSelectedFile={setSelectedFile}
                  selectedFile={selectedFile}
                />
              ) : (
                // 否則顯示空白圖片和上傳頭像按鈕
                <div>
                  <img src="/blank.webp" alt="" width="100" height="100" />
                  <div>
                    <button
                      className="btn btn-primary mt-2"
                      onClick={handleSubmit}
                    >
                      上傳頭像
                    </button>
                  </div>
                </div>
              )}
            </div>
            {/* <MemberLevel /> */}
            <Form onSubmit={handleSubmit}>
              <div className="row">
                {/* 表單控制項，用於修改姓名、帳號、電話等資料 */}
                <Form.Group className="mb-3 col-6" controlId="formName">
                  <Form.Label>姓名</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={userProfile.name}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3 col-6" controlId="formBirthDate">
                  <Form.Label>帳號</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={userProfile.username}
                    onChange={handleFieldChange}
                    disabled
                  />
                </Form.Group>
              </div>
              <div className="row">
                <div className="col-6">
                  <Form.Group className="mb-1" controlId="formPhone">
                    <Form.Label>電話</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={userProfile.phone}
                      onChange={handleFieldChange}
                      maxLength={10}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group className="mb-1" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      value={userProfile.email}
                      onChange={handleFieldChange}
                    />
                  </Form.Group>
                </div>
              </div>

              {/* 顯示或隱藏額外的購物欄位資訊 */}
              <Form.Group className="mb-2">
                <a
                  className="btn btn-primary "
                  data-bs-toggle="collapse"
                  href="#multiCollapseExample1"
                  role="button"
                  aria-expanded="false"
                  aria-controls="multiCollapseExample1"
                >
                  收件者欄位 1
                </a>
              </Form.Group>

              {/* 多個折疊面板內容，包含收件者姓名和電話號碼 */}
              <Form.Group className="row">
                <Form.Group className="col">
                  <Form.Group
                    className="collapse multi-collapse"
                    id="multiCollapseExample1"
                  >
                    <Form.Group className="row">
                      <Form.Group className="col-6 ">
                        <Form.Label>姓名</Form.Label>
                        <Form.Control
                          type="text"
                          name="name1"
                          value={userProfile.name1}
                          onChange={handleFieldChange}
                        />
                      </Form.Group>
                      <Form.Group className="col-6">
                        <Form.Label>手機號碼</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone1"
                          maxLength={10}
                          value={userProfile.phone1}
                          onChange={handleFieldChange}
                        />
                      </Form.Group>
                      <TWZipCode
                        initPostcode={userProfile.zip1}
                        onPostcodeChange={handlePostcodeChange1}
                      />
                      <Form.Group className="col">
                        <Form.Label>地址</Form.Label>
                        <Form.Control
                          type="text"
                          name="address1"
                          value={userProfile.address1}
                          onChange={handleFieldChange}
                        />
                      </Form.Group>
                    </Form.Group>
                  </Form.Group>
                </Form.Group>
              </Form.Group>

              {/* 提交按鈕 */}
              <div className="button-content">
                <Button variant="primary" type="submit">
                  修改
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
      {/* 用於顯示訊息的土司組件 */}
      <Toaster />
      <style jsx>
        {`
          .button-content {
            display: flex;
            justify-content: center;
          }
        `}
      </style>
    </>
  )
}
