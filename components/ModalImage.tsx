// components/ModalImage.tsx

import { useState } from 'react'

type ModalImageProps = {
  src: string
  alt?: string
  width?: number
  height?: number
}

export default function ModalImage({
  src,
  alt = '',
  width = 1280,
  height = 720,
}: ModalImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 表示エリアでアスペクト比を維持 */}
      <div
        className="cursor-zoom-in w-full"
        style={{ aspectRatio: `${width} / ${height}` }}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          loading="lazy"
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        />
      </div>

      {/* モーダル画像（クリックで閉じる） */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <img
            src={src}
            alt={alt}
            className="modal-img cursor-zoom-out"
            width={width}
            height={height}
            decoding="sync"
            loading="eager"
          />
        </div>
      )}
    </>
  )
}
