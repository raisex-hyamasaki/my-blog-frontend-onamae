// components/ModalImage.tsx
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import Modal from 'react-modal'

type ModalImageProps = {
  src: string
  alt?: string
  className?: string
  unoptimized?: boolean
  width?: number
  height?: number
} & Partial<Pick<ImageProps, 'width' | 'height' | 'className' | 'unoptimized'>>

// モーダルのルート要素指定（SSR対策済）
if (typeof window !== 'undefined') {
  Modal.setAppElement('body')
}

export default function ModalImage({
  src,
  alt = '',
  width = 800,
  height = 600,
  className = 'w-full h-auto cursor-zoom-in modal-img',
  unoptimized = true,
}: ModalImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized={unoptimized}
        className={className}
        onClick={openModal}
        style={{ cursor: 'zoom-in' }}
      />

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="relative bg-white rounded shadow-lg p-4">
          <button
            onClick={closeModal}
            className="absolute -top-4 -right-4 text-white bg-red-600 hover:bg-red-700 text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg z-50"
            aria-label="Close Modal"
          >
            ×
          </button>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            unoptimized={unoptimized}
            className="w-auto h-auto max-h-[90vh] max-w-[90vw] rounded"
          />
        </div>
      </Modal>
    </>
  )
}