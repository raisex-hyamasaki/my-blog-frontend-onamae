// components/Mermaid.tsx（静的HTML対応版）
'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Mermaid 初期化（1回だけ）
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        background: '#1e1e2f',
        primaryColor: '#1e1e2f',
        primaryTextColor: '#ffffff',
        secondaryTextColor: '#ffffff',
        tertiaryTextColor: '#ffffff',
        nodeTextColor: '#ffffff',
        lineColor: '#ffffff',
        edgeLabelBackground: '#1e1e2f',
        fontSize: '14px',
        fontFamily: 'sans-serif',
      },
    })

    const renderMermaid = async () => {
      try {
        const uniqueId = `mermaid-${Date.now()}`
        const { svg } = await mermaid.render(uniqueId, chart)
        if (ref.current) {
          ref.current.innerHTML = svg
        }
      } catch (err) {
        console.error('Mermaid render error:', err)
        if (ref.current) {
          ref.current.innerHTML = `<pre class="bg-red-100 text-red-800 p-2 rounded">Mermaid構文エラー: ${String(err)}</pre>`
        }
      }
    }

    renderMermaid()
  }, [chart])

  return <div ref={ref} />
}