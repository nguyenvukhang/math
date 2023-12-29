import type { NextApiRequest as Req, NextApiResponse as Res } from 'next'

const LATEST_RELEASE =
  'https://github.com/nguyenvukhang/math/releases/latest/download/minimath.pdf'

export default async function handler(_: Req, res: Res) {
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-disposition', 'attachment; filename=minimath.pdf')
  fetch(LATEST_RELEASE)
    .then((v) => v.blob())
    .then((v) => {
      res.setHeader('Content-Length', v.size)
      return v.arrayBuffer()
    })
    .then((v) => res.status(200).end(Buffer.from(v)))
    .catch((_) => res.status(404))
}

export const config = { api: { externalResolver: true } }
