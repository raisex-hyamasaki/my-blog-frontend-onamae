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
        unoptimized
        className="cursor-zoom-in w-full h-auto"
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="relative w-[90vw] h-[90vh] max-w-[1280px] max-h-[720px]">
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              className="modal-img cursor-zoom-out object-contain"
              onClick={(e) => e.stopPropagation()} // 背景クリック時だけ閉じる
            />
          </div>
        </div>
      )}
    </>
  )
}