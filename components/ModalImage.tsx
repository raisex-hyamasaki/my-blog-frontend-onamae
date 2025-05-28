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
      {/* 通常表示：原寸画像で表示しつつ画面幅を超えたら縮小 */}
      <img
        src={src}
        alt={alt}
        className="cursor-pointer max-w-full h-auto"
        style={{ width: '100%', maxWidth: '100%' }}
        onClick={() => setIsOpen(true)}
      />

      {/* モーダル：画面いっぱい＆画像原寸優先で中央に表示 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
      )}
    </>
  )
}
