// pages/articles/[id].tsx
// Markdown表示（画像中央寄せ＋レスポンシブ対応＋原寸超え防止）
// 投稿更新日とタグ表示に対応（Strapi v5構造対応）
// インラインコードに黄色背景＋黒文字対応済み（classNameベース判定）
// モーダルウィンドウ・原寸大対応
// ER図表示対応（Mermaid導入）
// 求人バナー表示対応
// SNSシェアボタン表示対応

import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Mermaid from '@/components/Mermaid'
import ModalImage from '@/components/ModalImage'
import ShareButtons from '@/components/ShareButtons'
import JobBanner from '@/components/JobBanner'

type Article = {
  id: number
  title: string
  content: string
  updatedAt: string
  tags: string[]
  thumbnail?: string
}

type Props = {
  article: Article
}

export default function ArticleDetail({ article }: Props) {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur py-4">
        <h1 className="text-2xl font-bold">{article.title}</h1>
      </header>

      {article.thumbnail && (
        <div className="mt-6">
          <ModalImage
            src={article.thumbnail}
            alt={article.title}
            width={800}
            height={400}
            className="w-full h-auto max-w-[800px] mx-auto rounded"
            unoptimized
          />
        </div>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-500 mt-6">
        <span>更新日: {new Date(article.updatedAt).toLocaleDateString()}</span>
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="prose prose-neutral max-w-none mt-8">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            code({ node, inline, className, children, ...props }) {
              if (inline) {
                return (
                  <code className="bg-yellow-200 text-black px-1 rounded text-sm font-mono whitespace-nowrap border-none inline">
                    {children}
                  </code>
                )
              }

              // Mermaid対応
              const match = /language-(\w+)/.exec(className || '')
              const lang = match?.[1]
              if (lang === 'mermaid' && hydrated) {
                return <Mermaid chart={String(children).trim()} />
              }

              return (
                <pre className={className}>
                  <code {...props}>{children}</code>
                </pre>
              )
            },
            img({ src, alt }) {
              if (!src) return null
              return (
                <ModalImage
                  src={src}
                  alt={alt || ''}
                  width={800}
                  height={600}
                  className="w-full h-auto max-w-full mx-auto rounded"
                  unoptimized
                />
              )
            }
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      <JobBanner />

      <ShareButtons title={article.title} />

      <div className="mt-8">
        <Link
          href="/"
          className="inline-block text-blue-600 hover:underline hover:text-blue-800 text-sm"
        >
          ← 記事一覧に戻る
        </Link>
      </div>
    </div>
  )
}

// 🔽 Strapi構造に準拠したサーバーサイド取得
export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const id = context.params?.id
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`
  )
  const json = await res.json()

  if (!json || !json.data) {
    return { notFound: true }
  }

  const raw = json.data
  const article: Article = {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    updatedAt: raw.updatedAt,
    tags: raw.tags || [],
    thumbnail: raw.thumbnail?.[0]?.formats?.medium?.url || null
  }

  return {
    props: {
      article
    }
  }
}