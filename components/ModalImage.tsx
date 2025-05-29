// components/ModalImage.tsx

'use client'

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
      {/* 通常表示（幅100%・ピンボケ防止） */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        unoptimized
        className="cursor-zoom-in w-full h-auto"
        onClick={() => setIsOpen(true)}
      />

      {/* モーダルオーバーレイ */}
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
