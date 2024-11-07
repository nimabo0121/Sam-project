import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

// data
import bigbite from '@/data/product/麵包甜點/bread_data.json'

export default function JournalBread({ onSelectItem }) {
  const [items, setItems] = useState(bigbite.slice(0, 10)) // 初始顯示10項
  const [hasMore, setHasMore] = useState(true) // 加載... false 停止加載

  const loadMoreItems = () => {
    const currentLength = items.length
    const moreItems = bigbite.slice(currentLength, currentLength + 10)
    setItems((prevItems) => [...prevItems, ...moreItems])
    if (currentLength + 10 >= bigbite.length) setHasMore(false) // 無數無數據時停止加載
  }

  const observer = useRef(null)

  useEffect(() => {
    const handleObserver = (entries) => {
      const target = entries[0]
      if (target.isIntersecting && hasMore) {
        loadMoreItems()
      }
    }
    const observerInstance = new IntersectionObserver(handleObserver, {
      threshold: 1,
    })
    if (observer.current) observerInstance.observe(observer.current)

    return () => observerInstance.disconnect()
  }, [hasMore, items])

  const handleImageClick = (item) => {
    onSelectItem(item) // 單選時更新選中項目
  }

  const display = (
    <div
      style={{
        overflowY: 'auto',
        maxHeight: '600px',
        padding: '10px',
      }}
      className="row row-cols-1 row-cols-md-4"
    >
      {bigbite.map((v, i) => {
        return (
          <div className="col" key={`${v.name}-${i}`}>
            <div className="card">
              <Image
                className="card-img-top"
                src={`/images/711/${v.imgSrc}`}
                alt={v.name}
                width={300}
                height={200}
                placeholder="blur"
                blurDataURL={`/images/711/${v.imgSrc}`}
                style={{ width: '100%', height: 'auto' }}
                onClick={() => handleImageClick(v)} // 點擊圖片時更新選中項目
              />
            </div>
            <div className="card-body">
              <h5 className="card-title">{v.name}</h5>
              <span>{v.calories}</span>
            </div>
          </div>
        )
      })}
      <div ref={observer} className="load-more-trigger"></div>
    </div>
  )

  return <>{display}</>
}
