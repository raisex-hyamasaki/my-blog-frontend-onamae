// pages/index.tsx
// 静的HTML出力対応（getStaticProps）
// 記事一覧ページ（カード/リスト切替、検索、ページネーション対応＋SEO強化）

import { GetStaticProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import Head from 'next/head'
import Seo from '@/components/Seo'

const PAGE_SIZE = 15

type Article = {
  id: number
  documentId: string | null
  title: string
  content: string
  updatedAt: string
  tags: { id: number; name: string }[]
  thumbnail: { url: string | null }
}

export default function Home({ articles }: { articles: Article[] }) {
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = articles.filter((article) => {
    const keyword = searchQuery.toLowerCase()
    return (
      article.title.toLowerCase().includes(keyword) ||
      article.content?.toLowerCase().includes(keyword)
    )
  })

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE)
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const renderTags = (tags: { id: number; name: string }[]) => (
    <div className="flex flex-wrap gap-1 mt-2">
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
        >
          {tag.name}
        </span>
      ))}
    </div>
  )

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'レイズクロス Tech Blog',
    description:
      '最新の技術トレンド、プログラミング、ソフトウェア開発、ツールのレビュー、プロジェクト管理等についての考察をお届け',
    url: 'https://blog.raisex.jp/',
  }

  return (
    <main className="max-w-6xl mx-auto p-4 sm:p-8">
      <Seo
        title="レイズクロスTechBlog | さいたま市大宮区システム会社raisex運営"
        description="最新の技術トレンド、プログラミング、ソフトウェア開発、ツールのレビュー、プロジェクト管理等についての考察をお届け"
        url="https://blog.raisex.jp/"
        image={articles[0]?.thumbnail?.url ? `https://blog.raisex.jp${articles[0].thumbnail.url}` : undefined}
      >
        <link rel="canonical" href="https://blog.raisex.jp/" />
        <meta name="robots" content="index, follow" />

        {/* OGP拡張 */}
        <meta property="og:site_name" content="レイズクロス Tech Blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@raisex_llc" />
        <meta name="twitter:title" content="レイズクロス Tech Blog" />
        <meta name="twitter:description" content="最新の技術トレンドなどを解説" />

        {/* JSON-LD 構造化データ */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Seo>

      <div className="mb-10">
        <Image
          src="/hero.jpg"
          alt="Raisex Hero Banner"
          width={1200}
          height={300}
          className="w-full h-64 object-cover rounded-xl shadow"
          priority
        />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold whitespace-nowrap">📝 レイズクロス Tech Blog</h1>
        <input
          type="text"
          placeholder="記事検索"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="flex-grow sm:flex-grow-0 w-full sm:w-60 px-3 py-2 border rounded shadow-sm text-sm"
        />
        <div className="flex">
          <button
            onClick={() => setViewMode('card')}
            className={`px-3 py-1 text-sm rounded-l border ${viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            カード
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-sm rounded-r border ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            リスト
          </button>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedArticles.map(({ id, title, updatedAt, documentId, thumbnail, tags }) => (
            <Link
              key={id}
              href={`/articles/${documentId}`}
              prefetch={false}
              className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
            >
              {thumbnail?.url && (
                <div className="w-full h-40 relative">
                  <Image
                    src={thumbnail.url}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-blue-600 mb-2">{title}</h2>
                <p className="text-sm text-gray-500">
                  投稿更新日: {updatedAt ? new Date(updatedAt).toLocaleString() : '不明'}
                </p>
                {Array.isArray(tags) && renderTags(tags)}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <ul className="space-y-6">
          {paginatedArticles.map(({ id, title, updatedAt, documentId, tags }) => (
            <li key={id} className="border rounded-lg p-4 hover:shadow-md transition bg-white">
              <Link href={`/articles/${documentId}`} prefetch={false}>
                <h2 className="text-xl font-semibold text-blue-600 hover:underline">{title}</h2>
              </Link>
              <p className="text-gray-500 text-sm mt-1">
                投稿更新日: {updatedAt ? new Date(updatedAt).toLocaleString() : '不明'}
              </p>
              {Array.isArray(tags) && renderTags(tags)}
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-center items-center mt-10 gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          ← 前へ
        </button>
        <span className="text-sm text-gray-700">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          次へ →
        </button>
      </div>

      <footer className="text-center text-gray-400 text-sm mt-12">
        © 2024 raisex, LLC. All rights reserved.
      </footer>
    </main>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    console.error('❌ NEXT_PUBLIC_API_URL is not defined')
    return { props: { articles: [] } }
  }

  try {
    const fetchUrl = `${apiUrl}/api/articles?populate[thumbnail]=true&populate[tags]=true&pagination[pageSize]=9999`
    const res = await fetch(fetchUrl)
    const json = await res.json()

    const sorted: Article[] = (json.data || [])
      .map((item: any) => {
        const thumbnailItem = Array.isArray(item.thumbnail) ? item.thumbnail[0] : item.thumbnail
        return {
          id: item.id,
          documentId: item.documentId ?? null,
          title: item.title,
          content: item.content,
          updatedAt: item.updatedAt,
          tags: item.tags ?? [],
          thumbnail: {
            url: thumbnailItem?.formats?.medium?.url ?? thumbnailItem?.url ?? null,
          },
        }
      })
      .filter((article: Article) => article.documentId !== null)
      .sort((a: Article, b: Article) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    return {
      props: { articles: sorted },
    }
  } catch (err) {
    console.error('❌ 記事取得中にエラー:', err)
    return { props: { articles: [] } }
  }
}