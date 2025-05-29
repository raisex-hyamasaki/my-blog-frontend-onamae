// components/ModalImage.tsx

import Image from 'next/image'

type ModalImageProps = {
  src: string
  alt?: string
}

export default function ModalImage({ src, alt }: ModalImageProps) {
  return (
    <a href={src} target="_blank" rel="noopener noreferrer">
      <Image
        src={src}
        alt={alt || ''}
        width={800}
        height={600}
        unoptimized
        className="w-full h-auto cursor-zoom-in modal-img"
      />
    </a>
  )
}
