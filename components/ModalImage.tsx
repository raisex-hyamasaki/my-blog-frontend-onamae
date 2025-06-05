// components/ModalImage.tsx（静的HTML出力対応版）

import Image from 'next/image'

type ModalImageProps = {
  src: string
  alt?: string
  className?: string
  width?: number
  height?: number
  unoptimized?: boolean
}

export default function ModalImage({
  src,
  alt = '',
  width = 800,
  height = 600,
  className = 'mx-auto w-full max-w-[800px] h-auto cursor-zoom-in',
  unoptimized = true, // ✅ next export 用に非最適化を明示
}: ModalImageProps) {
  return (
    <a href={src} target="_blank" rel="noopener noreferrer">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized={unoptimized}
        className={className}
        style={{ cursor: 'zoom-in' }}
      />
    </a>
  )
}