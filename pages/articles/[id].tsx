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
import type { HTMLAttributes, ReactNode } from 'react'

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

  if (!article) {
    return <div>記事が見つかりませんでした。</div>
  }

  const thumbnailUrl =
    article.thumbnail?.[0]?.formats?.medium?.url ??
    article.thumbnail?.[0]?.url ??
    null

  return (
    <div className="prose prose-slate mx-auto px-4">
      <Head>
        <title>{article.title} | RaiseX Blog</title>
      </Head>

      <h1>{article.title}</h1>

      {thumbnailUrl && (
        <div className="mb-4">
          <ModalImage src={thumbnailUrl} alt="記事サムネイル" />
        </div>
      )}

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

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ ...props }) =>
            typeof props.src === 'string' ? (
              <ModalImage {...(props as { src: string; alt?: string })} />
            ) : null,
          code: function CodeBlock({
            inline,
            className,
            children,
            ...props
          }: {
            inline?: boolean
            className?: string
            children?: ReactNode
          } & HTMLAttributes<HTMLElement>) {
            const match = /language-(\w+)/.exec(className || '')
            const codeString = String(children).replace(/\n$/, '')

            if (inline) {
              return (
                <code className="bg-yellow-200 text-black px-1 py-0.5 rounded">
                  {children}
                </code>
              )
            }

            if (match?.[1] === 'mermaid' && isClient) {
              return <Mermaid chart={codeString} />
            }

            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match?.[1] || 'text'}
                PreTag="div"
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            )
          },
        }}
      >
        {article.content}
      </ReactMarkdown>

      <div className="text-center mt-8">
        <Link
          href="/"
          className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          ← 記事一覧に戻る
        </Link>
      </div>

      <div className="my-12 border rounded-lg p-6 bg-yellow-50">
        <p className="font-bold mb-2">RaiseXではエンジニアを募集中です！</p>
        <p className="text-sm text-gray-600">最新技術に携わりたい方、ぜひご応募ください。</p>
      </div>
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

  if (!res.ok) {
    return { props: { article: null } }
  }

  const json = await res.json()
  return { props: { article: json.data } }
}
