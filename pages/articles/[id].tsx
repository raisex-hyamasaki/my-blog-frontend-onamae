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
import mermaid from 'mermaid'
import { useEffect } from 'react'
import Link from 'next/link'

type Article = {
  id: number
  title: string
  content: string
  updatedAt: string
  tags?: string[]
  thumbnail?: { formats?: { medium?: { url?: string } } }[]
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}?populate=thumbnail&populate=tags`
    )
    const json = await res.json()

    if (!json || !json.data) {
      return { notFound: true }
    }

    const article: Article = json.data
    return { props: { article } }
  } catch (err) {
    return { props: { article: null } }
  }
}

export default function ArticlePage({ article }: Props) {
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true })
    mermaid.init()
  }, [])

  if (!article) return <div>記事が見つかりませんでした。</div>

  const thumbnailUrl =
    article.thumbnail?.[0]?.formats?.medium?.url || ''

  return (
    <div className="prose prose-slate mx-auto p-4">
      {/* 固定ヘッダー */}
      <header className="sticky top-0 z-50 bg-white flex items-center justify-between px-4 py-2 shadow border-b">
        <div className="text-blue-600 font-bold text-lg flex items-center gap-2">
          <span>📝</span>
          <Link href="/">レイズクロス Tech Blog</Link>
        </div>
        <div className="flex gap-3 items-center">
          <a
            href={`https://twitter.com/share?url=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.href : ''
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/x.svg" alt="X" className="w-5 h-5" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.href : ''
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.href : ''
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/icons/line.svg" alt="LINE" className="w-5 h-5" />
          </a>
          <a href="#disqus_thread">
            <img src="/icons/disqus.svg" alt="Disqus" className="w-5 h-5" />
          </a>
        </div>
      </header>

      {/* タイトルとメタ情報 */}
      <h1 className="mt-8">{article.title}</h1>
      <div className="text-sm text-gray-500 mb-2">
        投稿更新日: {new Date(article.updatedAt).toLocaleString()}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags?.map((tag, index) => (
          <span
            key={index}
            className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* サムネイル画像 */}
      {thumbnailUrl && (
        <div className="flex justify-center mb-4">
          <img
            src={thumbnailUrl}
            alt="サムネイル画像"
            className="max-w-full h-auto"
          />
        </div>
      )}

      {/* Markdown本文 */}
      <div className="prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img: ({ node, ...props }) => (
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img {...props} className="max-w-full h-auto" />
              </div>
            ),
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      {/* 戻るボタン */}
      <div className="my-6">
        <Link href="/">
          <button className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
            ← 記事一覧に戻る
          </button>
        </Link>
      </div>

      {/* 求人バナー */}
      <div className="bg-gray-100 p-4 rounded shadow mb-10">
        <p className="mb-2">
          合同会社raisexでは一緒に働く仲間を募集中です。
          <br />
          ご興味のある方は以下の採用情報をご確認ください。
        </p>
        <a
          href="https://en-gage.net/raisex_career/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/recruit-banner.jpg"
            alt="採用バナー"
            className="w-full h-auto"
          />
        </a>
      </div>
    </div>
  )
}