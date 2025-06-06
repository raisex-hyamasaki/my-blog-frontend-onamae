// components/Seo.tsx
import Head from 'next/head'

type SeoProps = {
  title: string
  description?: string
  url?: string
  image?: string
  children?: ReactNode  // ✅ これを追加
}

export default function Seo({ title, description, url, image }: SeoProps) {
  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
