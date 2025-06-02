// pages/articles/[id].tsx
// Markdown表示（画像中央寄せ＋レスポンシブ対応＋原寸超え防止）
// 投稿更新日とタグ表示に対応（Strapi v5構造対応）
// インラインコードに黄色背景＋黒文字対応済み（classNameベース判定）
// ✅ Reactモーダルによる画像拡大表示対応済み
// ER図表示対応（Mermaid導入）
// 求人バナー表示対応（リロード不要で描画）
// SNSシェアボタン表示対応
// 🔁 記事内リンクは別タブで開く対応済み
// 📎 PDFリンク対応
// 📝 改行反映＋余分な行間除去対応済み
// ✅ 自サイトリンク：target="_self"、外部リンク：target="_blank" に切替対応済み

'use client'

import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Mermaid from '@/components/Mermaid'
import ModalImage from '@/components/ModalImage'

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

  const isInternalLink = (url: string) => {
    try {
      const link = new URL(url, 'https://my-blog-frontend.vercel.app')
      return link.hostname.includes('my-blog-frontend')
    } catch {
      return false
    }
  }

  if (!article) return <div>記事が見つかりませんでした。</div>

  const thumbnailUrl = article.thumbnail?.[0]?.formats?.medium?.url ?? null

  return (
    <div className="max-w-[1024px] mx-auto px-4">
      <Head>
        <title>{article.title} | レイズクロス Tech Blog</title>
      </Head>

      <article className="prose prose-slate max-w-none pt-6">
        <h1 className="text-3xl font-bold border-b pb-2">{article.title}</h1>
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
            <ModalImage src={thumbnailUrl} alt="サムネイル" />
          </div>
        )}

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img: ({ src = '', alt = '' }) => <ModalImage src={src} alt={alt} />,
            a: ({ href, children }) =>
              href ? (
                <a
                  href={href}
                  target={isInternalLink(href) ? '_self' : '_blank'}
                  rel={isInternalLink(href) ? undefined : 'noopener noreferrer'}
                  className="text-blue-600 underline"
                >
                  {children}
                </a>
              ) : (
                <>{children}</>
              ),
            code(props: any) {
              const { className, children } = props
              const codeString = String(children).replace(/\n$/, '')
              const match = /language-(\w+)/.exec(className || '')
              const isInline = !className || !className.includes('language-')
              if (isInline) {
                return (
                  <code className="bg-yellow-200 font-mono px-[0.3rem] py-[0.1rem] rounded whitespace-nowrap text-inherit">
                    {children}
                  </code>
                )
              }
              if (match?.[1] === 'mermaid' && isClient) {
                return <Mermaid chart={codeString} />
              }
              return (
                <div className="relative my-4">
                  <button
                    onClick={() => navigator.clipboard.writeText(codeString)}
                    className="absolute top-2 right-2 text-xs bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match?.[1] || 'text'}
                    PreTag="pre"
                    customStyle={{
                      background: 'transparent',
                      padding: '0.75rem',
                      margin: '0',
                      borderRadius: '0.5rem',
                      whiteSpace: 'pre-wrap',
                      overflowX: 'auto',
                      wordBreak: 'break-word'
                    }}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              )
            }
          }}
        >
          {article.content}
        </ReactMarkdown>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-block bg-gray-800 text-white no-underline px-4 py-2 rounded hover:bg-gray-700"
          >
            ← 記事一覧に戻る
          </Link>
        </div>
      </article>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.query
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}?populate[tags]=true&populate[thumbnail]=true`
  )
  if (!res.ok) return { props: { article: null } }
  const json = await res.json()
  return { props: { article: json.data } }
}