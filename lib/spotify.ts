import querystring from 'querystring'

const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

const getAccessToken = async () => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  })

  return response.json()
}

const AUDIO_FEATURES_ENDPOINT = '/v1/audio-features'
export const getAudioFeatures = async (id: string) => {
  return await fetchWebApi(`${AUDIO_FEATURES_ENDPOINT}/${id}`)
}

const SEARCH_ENDPOINT = '/v1/search'
export const getTracks = async (query: string) => {
  return await fetchWebApi(
    `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&type=track`
  )
}

async function fetchWebApi(endpoint: string, method: string = 'GET') {
  const { access_token } = await getAccessToken()

  const response = await fetch(`https://api.spotify.com${endpoint}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method,
  })

  return await response.json()
}
