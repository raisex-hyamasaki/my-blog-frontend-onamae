// components/Mermaid.tsx
'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    try {
      mermaid.parse(chart) // 構文エラーチェック（型エラー対策）
      ref.current.innerHTML = `<div class="mermaid">${chart}</div>`
      mermaid.init(undefined, ref.current)
    } catch (err) {
      console.error('Mermaid parse error:', err)
      ref.current.innerHTML = `<pre class="bg-red-100 text-red-800 p-2 rounded">Mermaid構文エラー</pre>`
    }
  }, [chart])

  return <div ref={ref} />
}
