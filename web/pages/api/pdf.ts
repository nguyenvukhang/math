import type { NextApiRequest as Req, NextApiResponse as Res } from 'next'

const LATEST_RELEASE =
  'https://github.com/nguyenvukhang/math/releases/download/v1.1.3/minimath.pdf'

export default async function handler(_: Req, res: Res) {
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-disposition', 'attachment; filename=minimath.pdf')
  fetch(LATEST_RELEASE)
    .then((v) => v.blob())
    .then((v) => v.arrayBuffer())
    .then((v) => res.status(200).end(Buffer.from(v)))
    .catch((_) => res.status(404))
}

export const config = { api: { externalResolver: true } }
