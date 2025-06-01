// components/ModalImage.tsx

import Image, { ImageProps } from 'next/image'

type ModalImageProps = {
  src: string
  alt?: string
  className?: string
  unoptimized?: boolean
  width?: number
  height?: number
} & Partial<Pick<ImageProps, 'width' | 'height' | 'className' | 'unoptimized'>>

export default function ModalImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = 'w-full h-auto cursor-zoom-in modal-img',
  unoptimized = true,
}: ModalImageProps) {
  return (
    <a href={src} target="_blank" rel="noopener noreferrer">
      <Image
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        unoptimized={unoptimized}
        className={className}
      />
    </a>
  )
}
