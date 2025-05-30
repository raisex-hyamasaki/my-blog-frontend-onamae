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
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Mermaid from '@/components/Mermaid'
import ModalImage from '@/components/ModalImage'
import Head from 'next/head'
import Script from 'next/script'
import type { ReactNode } from 'react'

interface Article {
  id: number
  title: string
  content: string
  updatedAt: string
  tags?: { id: number; name: string }[]
  thumbnail?: { formats?: { medium?: { url?: string } } }[]
}

type Props = {
  article: Article | null
}

export default function ArticlePage({ article }: Props) {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

  if (!article) return <div>記事が見つかりませんでした。</div>

  const thumbnailUrl = article.thumbnail?.[0]?.formats?.medium?.url ?? null

  return (
    <div className="max-w-[1024px] mx-auto px-4">
      <Head>
        <title>{article.title} | レイズクロス Tech Blog</title>
      </Head>

      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-12 flex items-center justify-between px-4">
        <Link href="/" className="text-blue-600 no-underline hover:text-gray-600 text-lg font-bold">
          📋 レイズクロス Tech Blog
        </Link>
        <div className="flex gap-3">
          <a href="https://twitter.com/share" target="_blank" rel="noopener noreferrer">
            <img src="/icons/x.svg" alt="Share on X" className="h-7 w-7" />
          </a>
          <a href="https://www.facebook.com/sharer/sharer.php" target="_blank" rel="noopener noreferrer">
            <img src="/icons/facebook.svg" alt="Share on Facebook" className="h-7 w-7" />
          </a>
          <a href="https://social-plugins.line.me/lineit/share" target="_blank" rel="noopener noreferrer">
            <img src="/icons/line.svg" alt="Share on LINE" className="h-7 w-7" />
          </a>
        </div>
      </header>

      <article className="prose prose-slate max-w-none pt-6">
        <h1 className="text-3xl font-bold">{article.title}</h1>

        <div className="text-sm text-gray-500 mb-4">
          投稿更新日: {new Date(article.updatedAt).toLocaleString()}
        </div>

        {article.tags?.length ? (
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
        ) : null}

        {thumbnailUrl && (
          <div className="w-full flex justify-center mb-6">
            <img src={thumbnailUrl} alt="サムネイル" className="w-full max-w-[800px] h-auto rounded" />
          </div>
        )}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img: ({ ...props }) =>
              typeof props.src === 'string' ? (
                <ModalImage {...(props as { src: string; alt?: string })} />
              ) : null,
            table: ({ children }) => (
              <table className="border border-gray-400 w-full text-sm">{children}</table>
            ),
            thead: ({ children }) => (
              <thead className="bg-cyan-100 text-black">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="border border-gray-400 px-2 py-1 text-left">{children}</th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 px-2 py-1">{children}</td>
            ),
            code: function CodeBlock({ inline, className, children }: { inline?: boolean; className?: string; children?: ReactNode }) {
              const match = /language-(\w+)/.exec(className || '')
              const codeString = String(children).replace(/\n$/, '')

              if (inline) {
                return <code className="bg-yellow-200 text-black px-1 whitespace-nowrap border-none inline">{children}</code>
              }

              if (match?.[1] === 'mermaid' && isClient) {
                return <Mermaid chart={codeString} />
              }

              const handleCopy = async () => {
                await navigator.clipboard.writeText(codeString)
                alert('Copied!')
              }

              return (
                <div className="relative bg-[#1e1e2f] rounded-md p-4">
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 text-xs bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match?.[1] || 'text'}
                    PreTag="div"
                    customStyle={{ background: 'transparent', margin: 0 }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              )
            },
          }}
        >
          {article.content}
        </ReactMarkdown>

        <div className="text-center mt-8">
          <Link href="/" className="inline-block bg-gray-800 text-white no-underline px-4 py-2 rounded hover:bg-gray-700">
            ← 記事一覧に戻る
          </Link>
        </div>

        <div className="my-12 text-center">
          <p className="font-bold text-gray-800">合同会社raisexでは一緒に働く仲間を募集中です。</p>
          <p className="text-sm text-gray-600 mb-4">ご興味のある方は以下の採用情報をご確認ください。</p>
          <div className="flex justify-center">
            <div
              className="engage-recruit-widget"
              data-height="300"
              data-width="500"
              data-url="https://en-gage.net/raisex_jobs/widget/?banner=1"
            />
          </div>
          <Script
            src="https://en-gage.net/common_new/company_script/recruit/widget.js?v=74abd4d08c3f541ffc47d90ca4e4bec1babf87cd5ec5620798da6c97ecc886c7"
            strategy="afterInteractive"
          />
        </div>
      </article>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext) => {
  const { id } = context.query
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}?populate[tags]=true&populate[thumbnail]=true`
  )

  if (!res.ok) {
    return { props: { article: null } }
  }

  const json = await res.json()
  return { props: { article: json.data } }
}