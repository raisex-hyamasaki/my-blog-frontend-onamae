// components/ModalImage.tsx
import { useState } from 'react'

type ModalImageProps = {
  src: string
  alt?: string
}

export default function ModalImage({ src, alt = '' }: ModalImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 通常表示（レスポンシブ） */}
      <img
        src={src}
        alt={alt}
        className="cursor-zoom-in max-w-full h-auto"
        onClick={() => setIsOpen(true)}
      />

      {/* モーダル表示（中央原寸） */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content">
            <img
              src={src}
              alt={alt}
              className="cursor-zoom-out"
              style={{ imageRendering: 'auto' }}
            />
          </div>
        </div>
      )}
    </>
  )
}
