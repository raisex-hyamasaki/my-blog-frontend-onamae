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

// モーダルのルートを body に指定（必要）
if (typeof window !== 'undefined') {
  Modal.setAppElement('body')
}

export default function ModalImage({
  src,
  alt = '',
  width = 800,
  height = 600,
  className = 'mx-auto w-full max-w-[800px] h-auto cursor-zoom-in',
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
        contentLabel="Image Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="relative">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded z-50"
          >
            × Close
          </button>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            unoptimized={unoptimized}
            className="mx-auto max-w-full max-h-screen rounded"
          />
        </div>
      </Modal>
    </>
  )
}
