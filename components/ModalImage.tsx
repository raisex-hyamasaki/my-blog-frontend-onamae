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
      {/* 通常表示（幅100%・高さ自動） */}
      <img
        src={src}
        alt={alt}
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
        className="cursor-zoom-in w-full h-auto"
        onClick={() => setIsOpen(true)}
      />

      {/* モーダル表示（原寸大に近い） */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <img
            src={src}
            alt={alt}
            width={1280}
            height={720}
            loading="eager"
            decoding="sync"
            className="modal-img cursor-zoom-out"
          />
        </div>
      )}
    </>
  )
}
