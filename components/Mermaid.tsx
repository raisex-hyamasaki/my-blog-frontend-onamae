// components/Mermaid.tsx
'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    mermaid.initialize({ startOnLoad: false }) // 初期化を明示

    const renderMermaid = async () => {
      try {
        const { svg } = await mermaid.render('mermaid-diagram', chart)
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
