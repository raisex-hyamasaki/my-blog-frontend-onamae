// components/ModalImage.tsx

import { useState } from 'react'
import Image from 'next/image'

type ModalImageProps = {
  src: string
  alt?: string
  width?: number
  height?: number
}

export default function ModalImage({ src, alt = '', width = 1280, height = 720 }: ModalImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
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

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="relative" style={{ maxWidth: '90vw', maxHeight: '90vh' }}>
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              sizes="(max-width: 90vw) 90vw, 1280px"
              className="modal-img cursor-zoom-out object-contain"
              onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じないように
            />
          </div>
        </div>
      )}
    </>
  )
}
