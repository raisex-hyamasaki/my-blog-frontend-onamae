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
      theme: 'dark',
      themeVariables: {
        background: '#1e1e2f',
        primaryColor: '#1e1e2f',
        primaryTextColor: '#ffffff',     // テーブルのカラム名など
        secondaryTextColor: '#ffffff',   // タイトルや補足情報
        tertiaryTextColor: '#ffffff',    // edgeのラベル文字など
        nodeTextColor: '#ffffff',        // ノード内のテキスト全般
        lineColor: '#ffffff',            // コネクタ線の色
        edgeLabelBackground: '#1e1e2f',
        fontSize: '14px',
        fontFamily: 'sans-serif',
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