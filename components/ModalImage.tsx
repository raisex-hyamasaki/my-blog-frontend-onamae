// components/ModalImage.tsx
import { useState } from 'react'

export default function ModalImage({ src, alt }: { src: string; alt?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="cursor-pointer max-w-full h-auto mx-auto"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <img src={src} alt={alt} className="max-w-full max-h-full" />
        </div>
      )}
    </>
  )
}
