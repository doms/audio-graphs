import Head from 'next/head'
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

  return (
    <>
      <Head>
        <title>Audio Graphs 📊</title>
        <meta
          name='description'
          content='Allows you to view the audio features of a song in a simple way'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header>
        <input
          type='text'
          maxLength={50}
          placeholder='Track Name...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className=''
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
        <br />
      </header>

      <main>
        <div className='tracks'>
          {tracks.map((track) => (
            <div
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
              {track.name}
            </div>
          ))}
        </div>
        <section className='features'></section>
      </main>
    </>
  )
}

// chart options
const options = {
  legend: {
    display: false,
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          max: 1,
        },
      },
    ],
  },
}

// const labels: string[] = []
// const values = []
// const features = [
//   'acousticness',
//   'danceability',
//   'energy',
//   'instrumentalness',
//   'liveness',
//   'loudness',
//   'mode',
//   'speechiness',
//   'tempo',
//   'valence',
// ]

// for (let feature in data) {
//   if (data.hasOwnProperty(feature) && features.indexOf(feature) !== -1) {
//     if (data[feature] <= 1 && data[feature] > 0) {
//       labels.push(feature)
//       values.push(data[feature])
//     }
//   }
// }

// const layout = {
//   labels: labels,
//   datasets: [
//     {
//       data: values,
//       backgroundColor: [
//         'rgba(30,215,96, 0.9)',
//         'rgba(245,115,160, 0.9)',
//         'rgba(80,155,245, 0.9)',
//         'rgba(255,100,55, 0.9)',
//         'rgba(180,155,200, 0.9)',
//         'rgba(250,230,45, 0.9)',
//         'rgba(0,100,80, 0.9)',
//         'rgba(175,40,150, 0.9)',
//         'rgba(30,50,100, 0.9)',
//       ],
//       borderColor: [
//         'rgba(30,215,96, 1)',
//         'rgba(245,115,160, 1)',
//         'rgba(80,155,245, 1)',
//         'rgba(255,100,55, 1)',
//         'rgba(180,155,200, 1)',
//         'rgba(250,230,45, 1)',
//         'rgba(0,100,80, 1)',
//         'rgba(175,40,150, 1)',
//         'rgba(30,50,100, 1)',
//       ],
//       borderWidth: 1,
//     },
//   ],
// }
