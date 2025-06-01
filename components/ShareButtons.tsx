// components/ShareButtons.tsx
import React from 'react'
import {
  FacebookShareButton,
  TwitterShareButton,
  LineShareButton,
  FacebookIcon,
  TwitterIcon,
  LineIcon,
} from 'react-share'

import { useRouter } from 'next/router'

type Props = {
  title: string
}

const ShareButtons: React.FC<Props> = ({ title }) => {
  const router = useRouter()
  const url = typeof window !== 'undefined'
    ? window.location.href
    : `https://my-blog-frontend.vercel.app${router.asPath}`

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">この記事をシェアする</h3>
      <div className="flex gap-4 items-center">
        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <LineShareButton url={url} title={title}>
          <LineIcon size={32} round />
        </LineShareButton>
      </div>
    </div>
  )
}

export default ShareButtons
