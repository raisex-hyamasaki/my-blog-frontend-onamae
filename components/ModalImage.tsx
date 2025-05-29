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
        loading="lazy"
        decoding="async"
        className="cursor-zoom-in w-full h-auto"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsOpen(false)}
        >
          <div style={{ position: 'relative', width: '90vw', height: '90vh' }}>
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              className="modal-img cursor-zoom-out object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
