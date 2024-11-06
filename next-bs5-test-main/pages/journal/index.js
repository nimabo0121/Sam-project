import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import JournalNavbar from '@/components/layout/default-layout/my-navbar/journal-navbar'
import JournalBigbite from './journal-bigbite'
import JournalCuisine from './journal-cuisine'
import JournalSnacks from './journal-snacks'
import JournalSandwich from './journal-sandwich'
import JournalForeignDishes from './journal-foreigndishes'
import JournalRiceBallss from './journal-riceballs'
import JournalSalad from './journal-salad'
import JournalBread from './journal-bread'
import JournalNoodles from './journal-noodles'
import JournalCalculation from './journal-calculation'

export default function Journal() {
  // 追蹤當前顯示的組件索引
  const [activeComponentIndex, setActiveComponentIndex] = useState(0)
  const [selectedItems, setSelectedItems] = useState([]) // 儲存選取的項目

  // 處理圖片點選事件，支持多選
  const handleSelectItem = (item) => {
    setSelectedItems((prevItems) => {
      // 檢查該項目是否已被選中，如果已選中則移除，否則加入
      if (prevItems.some((i) => i.name === item.name)) {
        return prevItems.filter((i) => i.name !== item.name)
      }
      return [...prevItems, item]
    })
  }

  const components = [
    {
      name: '大亨堡',
      component: <JournalBigbite onSelectItem={handleSelectItem} />,
    },
    {
      name: '台式料理',
      component: <JournalCuisine onSelectItem={handleSelectItem} />,
    },
    {
      name: '風味小食',
      component: <JournalSnacks onSelectItem={handleSelectItem} />,
    },
    {
      name: '原賞',
      component: <JournalSandwich onSelectItem={handleSelectItem} />,
    },
    {
      name: '異國料理',
      component: <JournalForeignDishes onSelectItem={handleSelectItem} />,
    },
    {
      name: '飯糰',
      component: <JournalRiceBallss onSelectItem={handleSelectItem} />,
    },
    {
      name: '蔬菜沙拉',
      component: <JournalSalad onSelectItem={handleSelectItem} />,
    },
    {
      name: '麵包甜點',
      component: <JournalBread onSelectItem={handleSelectItem} />,
    },
    {
      name: '麵食',
      component: <JournalNoodles onSelectItem={handleSelectItem} />,
    },
  ]

  return (
    <>
      <div className="container pt-5">
        <div
          className="row"
          style={{ color: 'black', background: '#cccccc', height: '350px' }}
        >
          <p style={{ color: 'black', background: 'red', height: '10%' }}>
            年/3月/月/周/日navbar
          </p>
          <div className="row">紀錄向量表</div>
        </div>

        <div className="row" style={{ height: '50px' }}>
          <div
            className="col-9"
            style={{ color: 'pink', background: '#eeeeee' }}
          >
            <h3>
              <JournalNavbar
                components={components}
                setActiveComponentIndex={setActiveComponentIndex}
              />
            </h3>
          </div>
          <div
            className="col-3"
            style={{ color: 'black', background: '#dddddd' }}
          >
            <h3>熱量計算</h3>
          </div>
        </div>

        {/* 食品list, 計算結果(存儲功能) */}
        <div className="row" style={{ height: '600px' }}>
          <div className="col-9">
            {components[activeComponentIndex].component}
          </div>
          <div className="col-3" style={{margin:"0px", border:"0px", padding:"0px", background:"#cccccc"}}>
            <JournalCalculation selectedItems={selectedItems} />
          </div>
        </div>
      </div>
    </>
  )
}
