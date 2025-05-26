'use client'

import { useEffect, useRef } from 'react'

interface MermaidProps {
  chart: string
}

export default function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    import('mermaid').then((mermaid) => {
      mermaid.default.initialize({ startOnLoad: true })
      if (ref.current) {
        ref.current.innerHTML = chart
        mermaid.default.contentLoaded()
      }
    })
  }, [chart])

  return <div ref={ref} className="mermaid my-6 bg-white rounded-md shadow p-4" />
}
