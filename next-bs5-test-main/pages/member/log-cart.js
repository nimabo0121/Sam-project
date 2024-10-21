import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getUserById } from '@/services/user'

// member-navber
import MemberNavbar from '@/components/layout/default-layout/my-navbar/member-navbar'

// bootstrap 樣式
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'

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

export default function Profile() {
  const { auth } = useAuth()
  const [userProfile, setUserProfile] = useState(initUserProfile)
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [openDetails, setOpenDetails] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0) // 訂單頁數

  // 讀取user資料
  const getUserData = async (id) => {
    const res = await getUserById(id)

    if (res.data.status === 'success') {
      const dbUser = res.data.data.user
      const dbPurchaseOrders = res.data.data.purchaseOrders.filter(
        (order) => order.status === '完成訂單'
      )
      setUserProfile({
        ...initUserProfile,
        ...dbUser,
      })

      setPurchaseOrders(dbPurchaseOrders)
    } else {
      // 加載失敗
    }
  }

  // 上一頁
  const prevPage = () => {
    setCurrentIndex((prevIndex) => prevIndex - 1)
  }

  // 下一頁
  const nextPage = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1)
  }

  useEffect(() => {
    if (auth.isAuth) {
      getUserData(auth.userData.id)
    }
  }, [auth])

  useEffect(() => {
    if (userProfile.name) {
      // 以載入會員資料
    }
  }, [userProfile])

  const toggleDetails = (orderId) => {
    setOpenDetails((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }))
  }

  // 每頁顯示數量
  const ordersPerPage = 2

  return (
    <>
      <MemberNavbar />
      <Container fluid className="member-profile-container">
        <h2 className="text-center mb-4 mt-1">購物訂單</h2>
        {/* 顯示當前訂單 */}
        {purchaseOrders
          .slice(
            currentIndex * ordersPerPage,
            (currentIndex + 1) * ordersPerPage
          )
          .map((order) => (
            <Card key={order.id} className="order-card">
              <Card.Body>
                <Card.Text className="order-title">
                  訂單編號：{order.id.slice(0, 8)}
                </Card.Text>
                <Card.Text className="order-text">
                  訂單金額：{order.amount}
                </Card.Text>
                <Card.Text className="order-text">
                  訂單狀態：{order.status}
                </Card.Text>
                <Card.Text className="order-text">
                  收件人：
                  {order.order_name1
                    ? `${order.order_name1} (${order.order_phone1}) - ${order.order_county1}${order.order_district1}${order.order_address1}`
                    : `${order.order_name2} (${order.order_phone2}) - ${order.order_county2}${order.order_district2}${order.order_address2}`}
                </Card.Text>
                {order.order_info && (
                  <>
                    <Button
                      className="btn btn-primary"
                      onClick={() => toggleDetails(order.id)}
                      aria-expanded={openDetails[order.id]}
                      aria-controls={`orderDetailsCollapse-${order.id}`}
                      data-bs-toggle="collapse"
                      role="button"
                    >
                      {openDetails[order.id] ? '收合訂單詳情' : '展開訂單詳情'}
                    </Button>
                    <Collapse in={openDetails[order.id]}>
                      <div id={`orderDetailsCollapse-${order.id}`}>
                        <ul className="order-info-list">
                          {JSON.parse(order.order_info).packages.map(
                            (packageInfo) => (
                              <li
                                key={packageInfo.id}
                                className="package-info-item"
                              >
                                <Card.Text>
                                  包裹編號：{packageInfo.id.slice(0, 8)}
                                </Card.Text>
                                <Card.Text>
                                  包裹金額：{packageInfo.amount}
                                </Card.Text>
                                <ul className="product-list">
                                  {packageInfo.products.map((product) => (
                                    <li
                                      key={product.id}
                                      className="product-item"
                                    >
                                      <Card.Text>
                                        產品名稱：{product.name}
                                      </Card.Text>
                                      <Card.Text>
                                        數量：{product.quantity}
                                      </Card.Text>
                                      <Card.Text>
                                        價格：{product.price}
                                      </Card.Text>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </Collapse>
                  </>
                )}
              </Card.Body>
            </Card>
          ))}
        {/* 分頁 */}
        <div className="pagination-buttons">
          <Button
            className="btn btn-primary"
            onClick={prevPage}
            disabled={currentIndex === 0}
          >
            上一頁
          </Button>
          <Button
            className="btn btn-primary"
            onClick={nextPage}
            disabled={
              (currentIndex + 1) * ordersPerPage >= purchaseOrders.length
            }
          >
            下一頁
          </Button>
        </div>
      </Container>
      <style>{`
      {/*  動畫  */}
      .member-profile-container {
  max-width: 31rem;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 15px;
}

.order-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 20px;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out; /* 過渡效果 */
  color: #333;
}

.order-card:hover {
  transform: scale(1.02); /* 滑鼠璇停放大 */
  background-color: #f0f0f0; 
  color: #666;
}

.pagination-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination-buttons button {
  margin: 0 10px;
}
{/* 樣式 */}
 
          .profile-card {
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
          }

          .profile-item {
            font-size: 18px;
            color: #333;
            margin-bottom: 10px;
          }

          .order-card {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 20px;
          }

          .order-title {
            font-size: 20px;
            font-weight: bold;
            color: #555;
          }

          .order-text {
            font-size: 16px;
            color: #666;
          }

          .order-info-title {
            font-size: 18px;
            color: #333;
          }

          .order-info-list {
            list-style-type: none;
            padding: 0;
          }

          .package-info-item {
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 4px;
            margin-top: 10px;
          }

          .product-list {
            list-style-type: none;
            padding: 0;
          }

          .product-item {
            padding: 5px;
            border-bottom: 1px solid #ddd;
            margin-top: 8px;
          }

          .member-profile-container {
            max-width: 31rem; 
            margin: 0 auto; 
            border:1px solid #ccc;
            border-radius: 3px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.2); 
          }
        }
`}</style>
    </>
  )
}
