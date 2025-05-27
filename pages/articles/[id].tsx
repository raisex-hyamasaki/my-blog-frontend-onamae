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
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

const Mermaid = dynamic(() => import('@/components/Mermaid'), { ssr: false })

interface Tag {
  id: number
  name: string
}

interface Article {
  id: number
  title: string
  content: string
  publishedAt: string
  updatedAt: string
  tags?: Tag[]
  thumbnailUrl?: string | null
}

interface Props {
  article: Article | null
}

export default function ArticleDetail({ article }: Props) {
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href)
    }

    const script = document.createElement('script')
    script.src = 'https://en-gage.net/raisex_jobs/widget/?banner=1'
    script.async = true
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  if (!article) return <p>記事が見つかりません</p>

  const { title, content, updatedAt, tags, thumbnailUrl } = article

  return (
    <main className="px-6 sm:px-8 lg:px-12 py-10 max-w-3xl mx-auto">
      <div className="sticky top-0 z-10 bg-white py-2">
        <Link href="/">
          <button className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
            ← 記事一覧に戻る
          </button>
        </Link>
      </div>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            {title}
          </h1>

          {Array.isArray(tags) && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <span key={tag.id} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-500 mt-3">
            投稿更新日: {new Date(updatedAt).toLocaleString()}
          </p>

          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt="サムネイル画像"
              className="mx-auto my-6 rounded shadow-md max-w-full h-auto"
            />
          )}
        </header>

        <section className="prose prose-neutral prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return inline ? (
                  <code
                    className="bg-yellow-200 text-black px-1 rounded text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <div className="relative">
                    <button
                      className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => {
                        navigator.clipboard.writeText(String(children))
                      }}
                    >
                      Copy
                    </button>
                    <SyntaxHighlighter
                      language={match?.[1] || ''}
                      style={oneDark}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                )
              },
              div({ node, ...props }) {
                if (
                  typeof props?.className === 'string' &&
                  props.className.includes('mermaid')
                ) {
                  return <Mermaid chart={String(props.children)} />
                }
                return <div {...props} />
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </section>
      </article>

      <div className="text-center mt-10">
        <Link href="/">
          <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700">
            ← 記事一覧に戻る
          </button>
        </Link>
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-700 text-base font-medium">
          合同会社raisexでは一緒に働く仲間を募集中です。
        </p>
        <p className="text-gray-600 text-sm mt-1">
          ご興味のある方は以下の採用情報をご確認ください。
        </p>
        <div className="flex justify-center mt-4">
          <a
            href="https://en-gage.net/raisex_jobs/widget/?banner=1"
            className="engage-recruit-widget"
            data-height="300"
            data-width="500"
            data-url="https://en-gage.net/raisex_jobs/widget/?banner=1"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
      </div>

      <footer className="text-center text-gray-400 text-sm mt-12">
        © 2024 raisex, LLC. All rights reserved.
      </footer>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (
  context: GetServerSidePropsContext
) => {
  const { id } = context.params ?? {}

  if (typeof id !== 'string') {
    return { props: { article: null } }
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
    const fetchUrl = `${apiUrl}/api/articles?filters[documentId][$eq]=${id}&populate=tags&populate=thumbnail`
    const res = await fetch(fetchUrl)
    const json = await res.json()

    if (!json.data || json.data.length === 0) {
      return { props: { article: null } }
    }

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
          title: attr.title,
          content: attr.content,
          publishedAt: attr.publishedAt,
          updatedAt: attr.updatedAt,
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