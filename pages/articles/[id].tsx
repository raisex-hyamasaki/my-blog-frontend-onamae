// pages/articles/[id].tsx
// Markdown表示（画像中央寄せ＋レスポンシブ対応＋原寸超え防止）
// 投稿更新日とタグ表示に対応（Strapi v5構造対応）
// インラインコードに黄色背景＋黒文字対応済み（CSSで補強）
// モーダルウィンドウ・原寸大対応
// ER図表示対応（Mermaid導入）
// 求人バナー表示対応
// SNSシェアボタン表示対応
// SSR化された詳細ページ。Markdown、メルマード、コードコピー、SNSシェアなどすべて統合

import { GetServerSideProps } from 'next'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { HTMLAttributes, DetailedHTMLProps } from 'react'

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
}

type CodeBlockProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  inline?: boolean
  children?: React.ReactNode
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, children, className = '', ...props }) => {
  if (inline) {
    return (
      <code
        {...props}
        style={{
          backgroundColor: '#fef08a',
          color: '#1f2937',
          padding: '0.2rem 0.4rem',
          borderRadius: '0.25rem',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
        }}
      >
        {children}
      </code>
    )
  }
  if ((className || '').trim() === 'language-mermaid') {
    return <Mermaid chart={String(children).trim()} />
  }
  return (
    <code className={`${className} text-sm font-mono`} {...props}>
      {children}
    </code>
  )
}

export default function ArticleDetail({ article }: Props) {
  const [modalImage, setModalImage] = useState<string | null>(null)
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
    document.querySelectorAll('.copy-button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement?.querySelector('code')?.textContent
        if (code) {
          navigator.clipboard.writeText(code)
          btn.textContent = '✅ Copied!'
          setTimeout(() => {
            btn.textContent = '📋 Copy'
          }, 1500)
        }
      })
    })
    const scriptId = 'engage-widget-script'
    if (document.getElementById(scriptId)) return
    const script = document.createElement('script')
    script.src = 'https://en-gage.net/common_new/company_script/recruit/widget.js?v=74abd4d...'
    script.id = scriptId
    script.async = true
    document.body.appendChild(script)
  }, [])

  if (!article) return <p>記事が見つかりません</p>

  const { title, content, updatedAt, tags, thumbnailUrl } = article

  return (
    <main className="px-6 sm:px-8 lg:px-12 py-10 max-w-3xl mx-auto relative">
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center cursor-zoom-out"
          onClick={() => setModalImage(null)}
        >
          <img src={modalImage} alt="拡大画像" className="max-w-full max-h-full rounded-lg shadow-lg" />
        </div>
      )}
      <article>
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">{title}</h1>
          {Array.isArray(tags) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span key={tag.id} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">投稿更新日: {new Date(updatedAt).toLocaleString()}</p>
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt="記事のサムネイル"
              className="mx-auto my-6 rounded shadow-md w-auto h-auto max-w-full"
            />
          )}
        </header>
        <section className="prose prose-neutral prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ src, alt }) => (
                <img
                  src={src ?? ''}
                  alt={alt ?? '画像'}
                  className="mx-auto my-6 rounded shadow-md w-auto h-auto max-w-full cursor-zoom-in"
                  onClick={() => src && setModalImage(src)}
                />
              ),
              code: CodeBlock,
              pre: ({ children }) => (
                <div className="relative my-6 bg-gray-900 text-white rounded-lg overflow-auto">
                  <button className="copy-button absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600">
                    📋 Copy
                  </button>
                  <pre className="p-4 text-sm">{children}</pre>
                </div>
              ),
              a: ({ href, children, ...props }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" {...props}>
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </section>
      </article>
      <div className="mt-12 flex justify-center">
        <Link href="/">
          <button className="text-sm px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
            ← 記事一覧に戻る
          </button>
        </Link>
      </div>
      <footer className="text-center text-gray-400 text-sm mt-12">
        © 2024 raisex, LLC. All rights reserved.
      </footer>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { id } = context.params ?? {}
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (typeof id !== 'string' || !apiUrl) return { props: { article: null } }

  try {
    const res = await fetch(
      `${apiUrl}/api/articles?filters[documentId][$eq]=${id}&populate[tags]=true&populate[thumbnail]=true`
    )
    const json = await res.json()
    if (!json.data || json.data.length === 0) return { props: { article: null } }

    const item = json.data[0]
    const attr = item.attributes || {}
    const tagList = Array.isArray(attr.tags?.data)
      ? attr.tags.data.map((tag: any) => ({ id: tag.id, name: tag.attributes?.name || '' }))
      : []
    const rawUrl = attr.thumbnail?.data?.attributes?.url
    const thumbnailUrl = rawUrl ? `${apiUrl}${rawUrl}` : null

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
      },
    }
  } catch (err) {
    console.error('記事取得エラー:', err)
    return { props: { article: null } }
  }
}