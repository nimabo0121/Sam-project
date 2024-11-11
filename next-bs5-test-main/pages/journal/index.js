import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import JournalSetNavbar from '@/components/layout/default-layout/my-navbar/journal-setnavbar'
import JournalSet from './journal-set'
import JournalManual from './journal-Manual'

import ChartNavbar from '@/components/layout/default-layout/my-navbar/chart-navbar'
import ChartYear from './chart-year'
import ChartMonth from './chart-month'
import ChartWeek from './chart-week'

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
  const [activeIntervalIndex, setActiveIntervalIndex] = useState(0)
  const [activeFoodIndex, setActiveFoodIndex] = useState(0)
  const [selectedItems, setSelectedItems] = useState([]) // 儲存選取的項目
  const [journalIndex, setJournalIndex] = useState(0) // 控制 "熱量計算" 的 navbar 索引

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

  const intervalTabs = [
    { name: '年', component: <ChartYear /> },
    { name: '月', component: <ChartMonth /> },
    { name: '周', component: <ChartWeek /> },
  ]

  const foodTabs = [
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
    // {
    //   name: '麵包甜點',
    //   component: <JournalBread onSelectItem={handleSelectItem} />,
    // },
    {
      name: '麵食',
      component: <JournalNoodles onSelectItem={handleSelectItem} />,
    },
  ]

  return (
    <div className="container pt-5">
      <div
        className="row"
        style={{ background: '#cccccc', minHeight: '400px' }}
      >
        <div style={{ height: '10%' }}>
          <ChartNavbar
            intervals={intervalTabs}
            setActiveComponentIndex={setActiveIntervalIndex}
          />
        </div>
        <div className="row">
          {intervalTabs[activeIntervalIndex]?.component}
        </div>
      </div>

      <div className="row pt-4" style={{ height: '55px' }}>
        <div className="col-9">
          <h3>
            <JournalNavbar
              components={foodTabs}
              setActiveComponentIndex={setActiveFoodIndex}
              activeComponentIndex={activeFoodIndex} // 傳遞當前選擇的索引
            />
          </h3>
        </div>
        <div className="col-3" style={{ margin: '0px', padding: '4px 0 0 0' }}>
          <JournalSetNavbar
            setJournalIndex={setJournalIndex}
            journalIndex={journalIndex}
          />
        </div>
      </div>

      {/* 食品list, 計算結果(存儲功能) */}
      <div className="row pt-2" style={{ minHeight: '600px' }}>
        <div className="col-9 pt-3">{foodTabs[activeFoodIndex]?.component}</div>
        <div
          className="col-3 pt-1"
          style={{ margin: '0px', padding: '4px', background: '#dddddd' }}
        >
          {journalIndex === 0 && (
            <JournalCalculation
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          )}
          {journalIndex === 1 && <JournalManual />}
          {journalIndex === 2 && <JournalSet />}
        </div>
      </div>
    </div>
  )
}
