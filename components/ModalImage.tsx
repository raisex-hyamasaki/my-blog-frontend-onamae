// components/ModalImage.tsx
import { useState } from 'react'
import Image from 'next/image'

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
      {/* 通常表示（幅100%・高さ自動、原寸サイズ指定） */}
      <div className="cursor-zoom-in w-full h-auto" onClick={() => setIsOpen(true)}>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          unoptimized
          className="w-full h-auto object-contain"
        />
      </div>

      {/* モーダル表示（原寸大に近い） */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="eager"
            decoding="sync"
            unoptimized
            className="modal-img cursor-zoom-out"
          />
        </div>
      )}
    </>
  )
}
