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
import Mermaid from '@/components/Mermaid'
import ModalImage from '@/components/ModalImage'
import { useRouter } from 'next/router'

interface Article {
  id: number
  documentId: string
  title: string
  content: string
  updatedAt: string
  tags?: { id: number; name: string }[]
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { id } = context.query

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}?populate[tags]=true`, {
    headers: { Accept: 'application/json' },
  })
  const json = await res.json()

  if (!json || !json.data) {
    return { notFound: true }
  }

  const article: Article = json.data
  return { props: { article } }
}

export default function ArticlePage({ article }: { article: Article }) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const copyButtons = document.querySelectorAll('.copy-button')
    copyButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const code = button.previousElementSibling?.textContent
        if (code) {
          navigator.clipboard.writeText(code)
          setCopied(true)
          setTimeout(() => setCopied(false), 1000)
        }
      })
    })
  }, [])

  return (
    <div className="prose prose-img:mx-auto max-w-3xl px-4 py-8 mx-auto">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        投稿更新日: {new Date(article.updatedAt).toLocaleString()}
      </div>

      {Array.isArray(article.tags) && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag) => (
            <span key={tag.id} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ node, ...props }) => <ModalImage {...props} />,
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const codeString = String(children).replace(/\n$/, '')
            if (match && match[1] === 'mermaid') {
              return <Mermaid chart={codeString} />
            }
            return !inline ? (
              <div className="relative">
                <button className="copy-button absolute top-1 right-1 text-xs bg-gray-200 px-2 py-1 rounded">
                  Copy
                </button>
                <pre>
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="bg-yellow-200 text-black px-1 py-0.5 rounded" {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {article.content}
      </ReactMarkdown>

      <div className="my-8">
        <img src="/recruit/recruit_banner_600_120.png" alt="求人バナー" className="mx-auto w-full max-w-md h-auto" />
      </div>

      <div className="flex gap-4 mb-8 justify-center">
        <Link
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            article.title + ' - ' + process.env.NEXT_PUBLIC_SITE_URL + router.asPath
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline"
        >
          Twitterでシェア
        </Link>
        <Link
          href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
            process.env.NEXT_PUBLIC_SITE_URL + router.asPath
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-green-500 hover:underline"
        >
          LINEでシェア
        </Link>
      </div>

      <div className="text-center mt-12">
        <Link href="/" className="text-blue-600 hover:underline">
          ← 記事一覧に戻る
        </Link>
      </div>
    </div>
  )
}