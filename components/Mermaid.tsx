// components/Mermaid.tsx
'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark', // ← ダークテーマに合わせる（背景黒＋白線）
      themeVariables: {
        primaryColor: '#ffffff',
        edgeLabelBackground: '#1e1e2f',
        fontSize: '14px',
        fontFamily: 'sans-serif',
        lineColor: '#ffffff', // ← コネクタ線を白
        textColor: '#ffffff', // ← ラベル文字も白
        nodeTextColor: '#000000', // ← テーブル内部のテキストは黒（逆に明るく見やすく）
        clusterBkg: '#f3f4f6', // クラスタ背景（灰色）
        clusterBorder: '#cccccc',
      },
    })

    const renderMermaid = async () => {
      try {
        const { svg } = await mermaid.render('mermaid-er', chart)
        ref.current!.innerHTML = svg
      } catch (err) {
        console.error('Mermaid render error:', err)
        ref.current!.innerHTML = `<pre class="bg-red-100 text-red-800 p-2 rounded">Mermaid構文エラー: ${String(err)}</pre>`
      }
    }

    renderMermaid()
  }, [chart])

  return <div ref={ref} />
}
