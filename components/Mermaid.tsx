import { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      mermaid.render('mermaid-chart', chart, (svgCode) => {
        ref.current!.innerHTML = svgCode
      })
    }
  }, [chart])

  return <div ref={ref} />
}
