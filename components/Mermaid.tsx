// components/Mermaid.tsx
'use client'

import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    try {
      console.log('Mermaid chart input:', chart) // チャート入力ログ

      mermaid.parse(chart) // 構文エラーチェック（構文ミスで止める）
      ref.current.innerHTML = `<div class="mermaid">${chart}</div>`

      mermaid.init(undefined, ref.current)

      console.log('Mermaid rendering completed.') // 成功ログ
    } catch (err) {
      console.error('Mermaid parse error:', err)
      ref.current.innerHTML = `<pre class="bg-red-100 text-red-800 p-2 rounded">Mermaid構文エラー</pre>`
    }
  }, [chart])

  return <div ref={ref} />
}
