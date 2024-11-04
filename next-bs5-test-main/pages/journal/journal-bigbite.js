import React from 'react'
import Image from 'next/image'

// data
import bigbite from '@/data/product/大亨堡/Bigbite_data.json'

export default function JournalBigbite() {
  const display = (
    <div className="row row-cols-1 row-cols-md-4 g-4">
      {bigbite.map((v, i) => {
        return (
          <div className="col" key={v.name}>
            <div className="card">
              <Image
                className="card-img-top"
                src={`/images/711/${v.imgSrc}`}
                alt="..."
                width={300}
                height={200}
                placeholder="blur"
                blurDataURL={`/images/711/${v.imgSrc}`}
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div className="card-body">
              <h5 className="card-title">{v.name}</h5>
              <span>{v.calories.split(' ')[0]}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
  return <>{display}</>
}
