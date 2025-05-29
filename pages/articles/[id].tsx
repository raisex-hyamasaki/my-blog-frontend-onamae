// pages/articles/[id].tsx
// Markdown表示（画像中央寄せ＋レスポンシブ対応＋原寸超え防止）
// 投稿更新日とタグ表示に対応（Strapi v5構造対応）
// インラインコードに黄色背景＋黒文字対応済み（CSSで補強）
// モーダルウィンドウ・原寸大対応
// ER図表示対応（Mermaid導入）
// 求人バナー表示対応
// SNSシェアボタン表示対応

import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Mermaid from '@/components/Mermaid'
import ModalImage from '@/components/ModalImage'
import Link from 'next/link'

interface Tag {
  id: number
  name: string
}

interface Article {
  id: number
  title: string
  content: string
  updatedAt: string
  tags?: Tag[]
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`)
  const json = await res.json()

  if (!json.data) {
    return { notFound: true }
  }

  return {
    props: {
      article: json.data,
    },
  }
}

export default function ArticlePage({ article }: { article: Article }) {
  const router = useRouter()

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Head>
        <title>{article.title} | RaiseX Blog</title>
        <meta name="description" content={article.title} />
      </Head>

      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      <div className="text-sm text-gray-500 mb-4">
        投稿更新日: {new Date(article.updatedAt).toLocaleString()}
      </div>

      {article.tags && article.tags.length > 0 && (
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

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          img: ({ node, ...props }) =>
            typeof props.src === 'string' ? <ModalImage {...props} /> : null,
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const codeString = String(children).replace(/\n$/, '')
            if (!inline && match) {
              return (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  children={codeString}
                  {...props}
                />
              )
            }
            return (
              <code
                className="bg-yellow-200 text-black px-1 py-0.5 rounded"
                {...props}
              >
                {children}
              </code>
            )
          },
          pre({ node, children, ...props }) {
            const codeNode = node.children[0]
            const isMermaid =
              codeNode?.properties?.className?.[0] === 'language-mermaid'
            if (isMermaid && 'children' in codeNode) {
              const code = codeNode.children[0]?.value
              return code ? <Mermaid chart={code} /> : <pre {...props}>{children}</pre>
            }
            return <pre {...props}>{children}</pre>
          },
        }}
        className="prose prose-neutral max-w-none"
      >
        {article.content}
      </ReactMarkdown>

      <div className="mt-8">
        <Link
          href="/"
          className="text-sm text-blue-500 hover:underline block text-center"
        >
          ← 記事一覧に戻る
        </Link>
      </div>

      <div className="mt-12 border-t pt-6 flex flex-col items-center">
        <div className="text-sm text-gray-600 mb-2">この記事をシェアする</div>
        <div className="flex gap-4">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(
              `https://my-blog-two-smoky.vercel.app/articles/${article.id}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Twitter
          </a>
          <a
            href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
              `https://my-blog-two-smoky.vercel.app/articles/${article.id}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:underline"
          >
            LINE
          </a>
        </div>
      </div>

      <div className="mt-12 p-6 border rounded-lg bg-yellow-50 shadow-md">
        <p className="text-lg font-semibold mb-2">RaiseXでは一緒に働く仲間を募集しています！</p>
        <p className="text-sm text-gray-700">
          現在、エンジニア・デザイナー・マーケターなど様々な職種を募集しています。詳細は
          <a
            href="https://raisex.jp/recruit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline ml-1"
          >
            採用ページ
          </a>
          をご覧ください。
        </p>
      </div>
    </div>
  )
}