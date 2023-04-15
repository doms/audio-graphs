import { getTracks } from '@/lib/spotify'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const q = String(req.query.q) ?? ''
  if (!q) return

  const tracks = await getTracks(q)
  return res.status(200).json(tracks)
}
