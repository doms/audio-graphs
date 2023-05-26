import { getAudioFeatures } from '@/lib/spotify'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const id = String(req.query.id) ?? ''
  if (!id) return

  const features = await getAudioFeatures(id)
  return res.status(200).json(features)
}
