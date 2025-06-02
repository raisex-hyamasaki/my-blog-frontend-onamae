// components/ModalImage.tsx

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import Modal from 'react-modal'

export type ModalImageProps = {
  src: string
  alt?: string
  className?: string
  unoptimized?: boolean
  width?: number
  height?: number
  onOpenModal?: () => void
  onCloseModal?: () => void
} & Partial<Pick<ImageProps, 'width' | 'height' | 'className' | 'unoptimized'>>

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
  onOpenModal,
  onCloseModal,
}: ModalImageProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => {
    setIsOpen(true)
    onOpenModal?.()
  }

  const closeModal = () => {
    setIsOpen(false)
    onCloseModal?.()
  }

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
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70"
        shouldCloseOnOverlayClick={true}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          unoptimized={unoptimized}
          className="mx-auto max-w-full max-h-screen rounded cursor-zoom-out"
          onClick={closeModal}
        />
      </Modal>
    </>
  )
}