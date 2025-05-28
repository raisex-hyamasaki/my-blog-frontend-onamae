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
      {/* 通常表示（レスポンシブ幅） */}
      <img
        src={src}
        alt={alt}
        className="cursor-zoom-in w-full max-w-full h-auto object-contain"
        onClick={() => setIsOpen(true)}
      />

      {/* モーダル表示（原寸 or 最大90vhまで） */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content">
            <img
              src={src}
              alt={alt}
              className="cursor-zoom-out"
              style={{
                imageRendering: 'auto',
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
