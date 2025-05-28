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
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="cursor-zoom-out"
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              imageRendering: 'auto',
            }}
          />
        </div>
      )}
    </>
  )
}