// pages/articles/[id].tsx
// Markdown表示（画像中央寄せ＋レスポンシブ対応＋原寸超え防止）
// 投稿更新日とタグ表示に対応（Strapi v5構造対応）
// インラインコードに黄色背景＋黒文字対応済み（CSSで補強）
// モーダルウィンドウ・原寸大対応
// ER図表示対応（Mermaid導入）
// 求人バナー表示対応
// SNSシェアボタン表示対応

import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const Mermaid = dynamic(() => import('../../components/Mermaid'), { ssr: false })

function getShareUrl(base: string, url: string, title?: string) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = title ? encodeURIComponent(title) : ''
  switch (base) {
    case 'twitter':
      return `https://twitter.com/share?url=${encodedUrl}&text=${encodedTitle}`
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    case 'line':
      return `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`
    case 'hatena':
      return `https://b.hatena.ne.jp/entry/panel/?url=${encodedUrl}`
    default:
      return '#'
  }
}

type Tag = {
  id: number
  name: string
}

type Article = {
  id: number
  title: string
  content: string
  publishedAt: string
  updatedAt: string
  tags?: Tag[]
  thumbnailUrl?: string | null
}

type Props = {
  article: Article | null
  now: number
}

export default function ArticleDetail({ article }: Props) {
  const [url, setUrl] = useState<string>('https://example.com')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const href = window.location.href
      setUrl(href)

      const script = document.createElement('script')
      script.id = 'engage-widget-script'
      script.src = 'https://en-gage.net/common_new/company_script/recruit/widget.js?v=vercel'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  if (!article) return <p>記事が見つかりません</p>

  const { title, content, updatedAt, tags, thumbnailUrl } = article

  return (
    <main className="px-6 sm:px-8 lg:px-12 py-10 max-w-3xl mx-auto relative">
      <div className="fixed top-0 left-0 w-full bg-white border-b z-40 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:text-gray-700 text-lg font-semibold">📝 レイズクロス Tech Blog</Link>
          <div className="flex gap-4 mt-1">
            {['twitter', 'facebook', 'line', 'hatena'].map((platform) => (
              <a
                key={platform}
                href={getShareUrl(platform, url, title)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={`/icons/${platform === 'twitter' ? 'x' : platform}.svg`} alt={platform} className="w-8 h-8" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="h-14" />

      <article>
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">{title}</h1>
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span key={tag.id} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">{tag.name}</span>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">投稿更新日: {new Date(updatedAt).toLocaleString()}</p>
          {thumbnailUrl && <img src={thumbnailUrl} alt="サムネイル" className="mx-auto my-6 rounded shadow-md max-w-full h-auto" />}
        </header>

        <section className="prose prose-neutral prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ src, alt }) => (
                <img src={src ?? ''} alt={alt ?? '画像'} className="mx-auto my-6 rounded shadow-md max-w-full cursor-zoom-in" />
              ),
              code: ({ inline, className, children, ...rest }: any) =>
                inline ? (
                  <code className="bg-yellow-200 text-black px-1 rounded text-sm" {...rest}>{children}</code>
                ) : (
                  <code className={`${className ?? ''} text-sm font-mono`} {...rest}>{children}</code>
                ),
              pre: ({ children }) => (
                <div className="relative my-6 bg-gray-900 text-white rounded-lg overflow-auto">
                  <button className="copy-button absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600">📋 Copy</button>
                  <pre className="p-4 text-sm">{children}</pre>
                </div>
              ),
              a: ({ href, children, ...props }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" {...props}>{children}</a>,
              table: ({ children }) => <table className="table-auto border border-gray-300 w-full text-sm">{children}</table>,
              thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
              th: ({ children }) => <th className="border px-4 py-2 text-left font-semibold">{children}</th>,
              td: ({ children }) => <td className="border px-4 py-2">{children}</td>,
            }}
          >
            {content}
          </ReactMarkdown>
        </section>
      </article>

      <div className="mt-12 flex justify-center">
        <Link href="/">
          <button className="text-sm px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">← 記事一覧に戻る</button>
        </Link>
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-700 text-base font-medium">合同会社raisexでは一緒に働く仲間を募集中です。</p>
        <p className="text-gray-600 text-sm mt-1">ご興味のある方は以下の採用情報をご確認ください。</p>
        <div className="flex justify-center mt-4">
          <a
            href=""
            className="engage-recruit-widget"
            data-height="300"
            data-width="500"
            data-url="https://en-gage.net/raisex_jobs/widget/?banner=1"
            target="_blank"
          />
        </div>
      </div>

      <footer className="text-center text-gray-400 text-sm mt-12">
        © 2024 raisex, LLC. All rights reserved.
      </footer>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
  const { id } = context.params ?? {}
  if (typeof id !== 'string') return { props: { article: null, now: Date.now() } }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const fetchUrl = `${apiUrl}/api/articles?filters[documentId][$eq]=${id}&populate[tags]=true&populate[thumbnail]=true`
    const res = await fetch(fetchUrl)
    const json = await res.json()

    if (!json.data?.[0]) return { props: { article: null, now: Date.now() } }

    const item = json.data[0]
    const attr = item.attributes || item

    const tagList = Array.isArray(attr.tags)
      ? attr.tags.map((tag: any) => ({ id: tag.id, name: tag.name }))
      : []

    let thumbnailUrl = null
    if (Array.isArray(attr.thumbnail) && attr.thumbnail[0]?.formats?.medium?.url) {
      thumbnailUrl = attr.thumbnail[0].formats.medium.url
    }

    return {
      props: {
        article: {
          id: item.id,
          title: attr.title ?? '',
          content: attr.content ?? '',
          publishedAt: attr.publishedAt ?? '',
          updatedAt: attr.updatedAt ?? '',
          tags: tagList,
          thumbnailUrl,
        },
        now: Date.now(),
      },
    }
  } catch (err) {
    console.error('記事取得エラー:', err)
    return { props: { article: null, now: Date.now() } }
  }
}