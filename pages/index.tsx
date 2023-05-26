import { useEffect, useState } from 'react'
import React from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

import styles from '@/styles/Home.module.css'

export default function Home() {
  // 1. search tracks from query
  const [searchTerm, setSearchTerm] = useState('')

  // 2. set tracks from search
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([])

  // 3. use track from `tracks` to get audio features of specific track
  const [trackFeatures, setTrackFeatures] =
    useState<SpotifyApi.AudioFeaturesObject>(
      {} as SpotifyApi.AudioFeaturesObject
    )

  const [trackListBorder, setTrackListBorder] = useState({ border: 'none' })

  useEffect(() => {
    const nextBorderStyles =
      tracks.length > 0 ? { border: '1px solid #000' } : { border: 'none' }
    setTrackListBorder(nextBorderStyles)
  }, [tracks])

  return (
    <>
      <header className={styles.header}>
        <h1>
          Audio Graphs{' '}
          <span className={styles.author}>
            by{' '}
            <a href='//github.com/doms' target='_blank' rel='noreferrer'>
              @doms
            </a>
          </span>
        </h1>
      </header>

      <main className={styles.main}>
        <div className={styles.inputWrapper}>
          <input
            type='text'
            maxLength={50}
            placeholder='Search for a song...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={async () => {
              try {
                const response = await fetch(`/api/get-tracks?q=${searchTerm}`)
                const tracks = await response.json()
                setTracks(tracks.tracks.items)
              } catch (error) {
                console.log('[get-tracks] error', error)
              }
            }}
          >
            Search
          </button>
        </div>
        <br />
        <div className={styles.tracks} style={trackListBorder}>
          {tracks.map((track) => (
            <div
              className={styles.track}
              key={track.id}
              onClick={async () => {
                try {
                  const response = await fetch(
                    `/api/get-audio-features?id=${track.id}`
                  )

                  const feature = await response.json()
                  setTrackFeatures(feature)
                } catch (error) {
                  console.log('[get-audio-features] error', error)
                }
              }}
            >
              {track.artists.map(({ name }) => name).join(', ')} -- {track.name}
            </div>
          ))}
        </div>

        {Object.keys(trackFeatures).length ? (
          <Bar
            data={layout(assembleGraph(trackFeatures))}
            options={{ plugins: { legend: { display: false } } }}
          />
        ) : null}
      </main>
    </>
  )
}

/*

*/

function assembleGraph(data: SpotifyApi.AudioFeaturesObject) {
  const labels = []
  const values = []
  const features = [
    'acousticness',
    'danceability',
    'energy',
    'instrumentalness',
    'liveness',
    'loudness',
    'mode',
    'speechiness',
    'tempo',
    'valence',
  ]

  for (const [feature, value] of Object.entries(data)) {
    if (features.indexOf(feature) !== -1) {
      if (value <= 1 && value > 0) {
        labels.push(feature)
        values.push(value)
      }
    }
  }

  return { labels, values }
}

const layout = (data: { labels: string[]; values: number[] }) => {
  const { labels, values } = data
  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          'rgba(30,215,96, 0.9)',
          'rgba(245,115,160, 0.9)',
          'rgba(80,155,245, 0.9)',
          'rgba(255,100,55, 0.9)',
          'rgba(180,155,200, 0.9)',
          'rgba(250,230,45, 0.9)',
          'rgba(0,100,80, 0.9)',
          'rgba(175,40,150, 0.9)',
          'rgba(30,50,100, 0.9)',
        ],
        borderColor: [
          'rgba(30,215,96, 1)',
          'rgba(245,115,160, 1)',
          'rgba(80,155,245, 1)',
          'rgba(255,100,55, 1)',
          'rgba(180,155,200, 1)',
          'rgba(250,230,45, 1)',
          'rgba(0,100,80, 1)',
          'rgba(175,40,150, 1)',
          'rgba(30,50,100, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }
}
