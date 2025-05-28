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
      {/* 通常表示（レスポンシブで最大幅） */}
      <img
        src={src}
        alt={alt}
        className="cursor-zoom-in w-full h-auto"
        onClick={() => setIsOpen(true)}
      />

      {/* モーダル表示（原寸＋レスポンシブ＋中央寄せ） */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <img
            src={src}
            alt={alt}
            className="modal-img cursor-zoom-out"
          />
        </div>
      )}
    </>
  )
}