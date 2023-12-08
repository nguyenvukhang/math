// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const LATEST_RELEASE =
  'https://github.com/nguyenvukhang/math/releases/download/v1.1.3/minimath.pdf'

import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-disposition', 'attachment; filename=minimath.pdf')
  const pdfRes = await fetch(LATEST_RELEASE)
  res.status(200).end(Buffer.from(await pdfRes.arrayBuffer()))
}
