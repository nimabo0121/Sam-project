import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import JournalBigbite from './journal-bigbite'
export default function Journal() {
  return (
    <>
      <div className="container pt-5">
        {/* 紀錄向量表 */}
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
            <h3>食品分類navbar</h3>
          </div>
          <div
            className="col-3"
            style={{ color: 'black', background: '#dddddd' }}
          >
            <h3>熱量計算name</h3>
          </div>
        </div>

        {/* 食品list, 計算結果(存儲功能) */}
        {/* 需要欄位 食物name, 熱量, 備註, 日期 */}
        <div className="row" style={{ height: '600px' }}>
          <div className="col-9" style={{ background: '' }}>
            <JournalBigbite />
          </div>
          <div className="col-3" style={{ background: 'blue' }}>
            <p>計算內容</p>
          </div>
        </div>
      </div>
    </>
  )
}
