// components/YoutubeEmbed.tsx

type Props = {
  url: string
}

export default function YoutubeEmbed({ url }: Props) {
  const id = getYoutubeId(url)
  if (!id) return null

  return (
    <div className="my-6">
      <iframe
        className="w-full aspect-video rounded-md"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}

function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/playlist\?list=([^&]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}