// components/ModalImage.tsx
import { useState } from 'react'

type ModalImageProps = {
  src: string
  alt?: string
  originalSize?: boolean // ✅ これを追加
}

export default function ModalImage({ src, alt = '', originalSize = false }: ModalImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="cursor-zoom-in max-w-full h-auto"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className={originalSize ? 'max-w-none h-auto' : 'max-w-full h-auto'}
          />
        </div>
      )}
    </>
  )
}
