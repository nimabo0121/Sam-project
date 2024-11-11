import React from 'react'
import { Nav } from 'react-bootstrap'

export default function JournalSetNavbar({ setJournalIndex, journalIndex }) {
  return (
    <Nav
      variant="tabs"
      activeKey={journalIndex} // 控制當前選中的 tab
      onSelect={(selectedKey) => setJournalIndex(parseInt(selectedKey))} // 更新 journalIndex
    >
      <Nav.Item>
        <Nav.Link
          eventKey="0"
          style={{
            padding: '5px 10px 5px 10px',
            backgroundColor: journalIndex === 0 ? '#6c757d' : 'white', // 設置選中狀態的背景顏色
            color: journalIndex === 0 ? 'white' : 'black', // 選中時文字顏色為白色，未選中時為黑色
          }}
        >
          熱量計算
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="1"
          style={{
            padding: '5px 10px 5px 10px',
            backgroundColor: journalIndex === 1 ? '#6c757d' : 'white', // 設置選中狀態的背景顏色
            color: journalIndex === 1 ? 'white' : 'black', // 選中時文字顏色為白色，未選中時為黑色
          }}
        >
          自定義
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          eventKey="2"
          style={{
            padding: '5px 10px 5px 10px',
            backgroundColor: journalIndex === 2 ? '#6c757d' : 'white', // 設置選中狀態的背景顏色
            color: journalIndex === 2 ? 'white' : 'black', // 選中時文字顏色為白色，未選中時為黑色
          }}
        >
          設置
        </Nav.Link>
      </Nav.Item>
    </Nav>
  )
}
