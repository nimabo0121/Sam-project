import React, { useState, useEffect } from 'react'

export default function PreviewUploadImage({
  avatarImg = '',
  avatarBaseUrl = '',
  defaultImg = 'default.png',
  setSelectedFile,
  selectedFile,
}) {
  // 預覽圖片
  const [preview, setPreview] = useState('')

  // 當選擇檔案更動時建立預覽圖
  useEffect(() => {
    if (!selectedFile) {
      setPreview('')
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // 當元件unmounted時清除記憶體
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null)
    }
  }

  const showImg = () => {
    if (selectedFile) {
      return preview
    }

    if (avatarImg) {
      return avatarBaseUrl + '/' + avatarImg
    }

    return avatarBaseUrl + '/' + defaultImg
  }

  return (
    <div className="image-upload">
      <label htmlFor="file-input">
        <img
          className="rounded-circle preview-image"
          src={showImg()}
          alt=""
          width="150"
          height="150"
        />
      </label>
      <input
        id="file-input"
        type="file"
        name="file"
        onChange={handleFileChange}
      />
      <style jsx>
        {`
          .image-upload {
            position: relative;
            display: inline-block;
            cursor: pointer;
          }

          .preview-image {
            transition: transform 0.2s ease-in-out;
            box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.3);
          }

          .preview-image:hover {
            transform: scale(1.1);
            box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
          }

          .image-upload > input {
            display: none;
          }
        `}
      </style>
    </div>
  )
}
