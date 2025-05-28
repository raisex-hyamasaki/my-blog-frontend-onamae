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
      {/* 通常表示 */}
      <img
        src={src}
        alt={alt}
        className="cursor-zoom-in max-w-full h-auto"
        onClick={() => setIsOpen(true)}
      />

      {/* モーダルウィンドウ */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="cursor-zoom-out max-h-[90vh] w-auto h-auto"
            style={{
              imageRendering: 'auto', // ピンボケ防止（ブラウザ依存）
            }}
          />
        </div>
      )}
    </>
  )
}