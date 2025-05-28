// pages/articles/[id].tsx
// Markdown表示（画像中央寄せ＋レスポンシブ対応＋原寸超え防止）
// 投稿更新日とタグ表示に対応（Strapi v5構造対応）
// インラインコードに黄色背景＋黒文字対応済み（CSSで補強）
// モーダルウィンドウ・原寸大対応
// ER図表示対応（Mermaid導入）
// 求人バナー表示対応
// SNSシェアボタン表示対応

import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Mermaid from '@/components/Mermaid'
import ModalImage from '@/components/ModalImage'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import type { ReactNode } from 'react'

type Article = {
  id: number
  title: string
  content: string
  updatedAt: string
  tags?: {
    id: number
    name: string
  }[]
  thumbnail?: {
    url?: string
  }[]
}

type Props = {
  article: Article | null
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.query

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles?filters[documentId][$eq]=${id}&populate=thumbnail,tags`
    )
    const json = await res.json()

    if (!json?.data || json.data.length === 0) return { notFound: true }

    const raw = json.data[0]

    const article: Article = {
      id: raw.id,
      title: raw.title,
      content: raw.content,
      updatedAt: raw.updatedAt,
      tags: raw.tags ?? [],
      thumbnail: raw.thumbnail ?? []
    }

    return { props: { article } }
  } catch (e) {
    console.error('Error fetching article:', e)
    return { props: { article: null } }
  }
}

export default function ArticlePage({ article }: Props) {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href)
      import('mermaid').then((m) => {
        m.default.initialize({ startOnLoad: true })
        m.default.init()
      })
    }
  }, [])

  if (!article) return <div>記事が見つかりませんでした。</div>

  const thumbnailUrl = article.thumbnail?.[0]?.url || ''

  return (
    <div className="prose prose-slate max-w-screen-lg mx-auto px-4 pb-12 text-justify">
      {/* ヘッダー */}
      <div className="sticky top-0 z-50 bg-white border-b shadow-sm w-full">
        <header className="max-w-screen-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-xl text-blue-600 hover:text-gray-500 font-bold no-underline"
          >
            📝 レイズクロス Tech Blog
          </Link>
          <div className="flex gap-3 items-center">
            <a href={`https://twitter.com/share?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
              <img src="/icons/x.svg" alt="X" className="w-6 h-6 inline" />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
              <img src="/icons/facebook.svg" alt="Facebook" className="w-6 h-6 inline" />
            </a>
            <a href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
              <img src="/icons/line.svg" alt="LINE" className="w-6 h-6 inline" />
            </a>
            <a href={`https://b.hatena.ne.jp/entry/${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer">
              <img src="/icons/hatena.svg" alt="Hatena" className="w-6 h-6 inline" />
            </a>
          </div>
        </header>
      </div>

      {/* タイトル・更新日 */}
      <h1 className="mt-8 text-3xl font-bold text-blue-700">{article.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        更新日: {new Date(article.updatedAt).toLocaleString()}
      </div>

      {/* タグ */}
      {Array.isArray(article.tags) && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* サムネイル */}
      {thumbnailUrl && (
        <div className="flex justify-center mb-6">
          <ModalImage src={thumbnailUrl} alt="サムネイル画像" />
        </div>
      )}

      {/* Markdown本文 */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ src = '', alt = '' }) => (
            <div className="flex justify-center my-4">
              <ModalImage src={src} alt={alt} />
            </div>
          ),
          code(props) {
            const { inline, className, children, ...rest } = props as {
              inline?: boolean
              className?: string
              children: ReactNode
            }
            const match = /language-(\w+)/.exec(className || '')
            if (inline) {
              return (
                <code className="bg-sky-100 text-red-600 px-1 py-0.5 rounded font-mono font-bold text-sm">
                  {children}
                </code>
              )
            }
            return (
              <div className="relative">
                <button
                  className="absolute top-2 right-2 copy-button"
                  onClick={() => navigator.clipboard.writeText(String(children))}
                >
                  Copy
                </button>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match?.[1]}
                  PreTag="div"
                  {...rest}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            )
          },
          div(props) {
            const content = props.children
            if (typeof content === 'string' && content.trimStart().startsWith('graph')) {
              return <Mermaid chart={content} />
            }
            return <div {...props} />
          },
        }}
      >
        {article.content}
      </ReactMarkdown>

      {/* 戻るボタン */}
      <div className="my-8 text-center">
        <Link href="/">
          <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600">
            ← 記事一覧に戻る
          </button>
        </Link>
      </div>

      {/* 求人バナー */}
      <div className="text-center text-sm mb-4">
        <strong>合同会社raisex</strong>では一緒に働く仲間を募集中です。
        <br />
        ご興味のある方は以下の採用情報をご確認ください。
      </div>
      <a
        href="https://en-gage.net/raisex_career/"
        target="_blank"
        rel="noopener noreferrer"
        className="block mb-10"
      >
        <img
          src="/recruit-banner.jpg"
          alt="採用バナー"
          className="w-full h-auto rounded shadow"
        />
      </a>
    </div>
  )
}