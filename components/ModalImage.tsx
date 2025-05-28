// components/ModalImage.tsx
import { useState } from 'react'

type Props = {
  src: string
  alt?: string
}

export default function ModalImage({ src, alt = '' }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="cursor-zoom-in max-w-full h-auto mx-auto rounded shadow"
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain cursor-zoom-out"
          />
        </div>
      )}
    </>
  )
}
