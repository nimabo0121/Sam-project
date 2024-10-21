import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MemberImage({
  avatarImg = '',
  avatarBaseUrl = '',
  defaultImg = 'default.png',
  setSelectedFile,
  selectedFile,
}) {
  // 預覽圖片
  const [preview, setPreview] = useState('');

  // 當選擇檔案更動時建立預覽圖
  useEffect(() => {
    if (!selectedFile) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // 當元件unmounted時清除記憶體
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // 處理點擊圖片事件
  const handleClick = () => {
    // 如果有選擇檔案，不做任何事情
    if (selectedFile) {
      return;
    }

    // 此處可以加入其他點擊事件的處理邏輯，例如放大、連結到詳細頁面等

    // console.log('點擊圖片事件處理');
  };

  // 確定要顯示的圖片路徑
  const showImg = () => {
    if (selectedFile) {
      return preview;
    }

    if (avatarImg) {
      return avatarBaseUrl + '/' + avatarImg;
    }

    return avatarBaseUrl + '/' + defaultImg
  };

  return (
    <div className="image-upload">
      <Link href="/member/profile">
        <img
          src={showImg()}
          alt=""
          width="50"
          height="50"
          onClick={handleClick}
          style={{ borderRadius: '50%' }}
        />
      </Link>
      <style jsx>
        {`
          .image-upload > input {
            display: none;
          }
        `}
      </style>
    </div>
  );
}
