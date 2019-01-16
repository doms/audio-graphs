;(() => {
  function resetCanvas() {
    const featureChartContainer = document.getElementById(
      'features-chart-container'
    )

    const featureChart = document.getElementById('features-chart')
    featureChartContainer.removeChild(featureChart)

    let canvas = document.createElement('canvas')
    canvas.setAttribute('id', 'features-chart')
    featureChartContainer.appendChild(canvas)

    ctx = document.getElementById('features-chart')
  }

  const tracks = document.getElementById('tracks')
  const form = document.querySelector('form')
  let ctx

  form.addEventListener('submit', event => {
    event.preventDefault()

    let searchQuery = `/search?query=${document.querySelector('input').value}`
    getTracks(searchQuery)
  })

  function getTracks(query) {
    fetch(query)
      .then(response => response.json())
      .then(json => {
        // clear out previous search results
        tracks.textContent = ''

        let resultIDs = []
        json.forEach(track => {
          resultIDs.push(track.id)

          let el = document.createElement('button')
          el.className = 'track'
          el.value = track.id
          el.textContent = `${track.name}   |   ${track.artists[0].name}`

          el.onclick = () => {
            getFeatures(track.id)
          }
          tracks.appendChild(el)
        })

        tracks.addEventListener('click', closestTrack)
      })
      .catch(err => {
        console.log('oops 😆 \n', err)
      })
  }

  function closestTrack(event) {
    const button = event.target.closest('.track')
    if (!button) return

    getFeatures(button.value)
  }

  function getFeatures(id) {
    resetCanvas()

    // set search query with id
    let query = `/features?id=${id}`

    fetch(query)
      .then(response => response.json())
      .then(data => {
        // [{...}]
        data = data[0]

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
          'valence'
        ]

        for (let feature in data) {
          if (data.hasOwnProperty(feature) && features.indexOf(feature) !== -1) {
            if (data[feature] <= 1 && data[feature] > 0) {
              labels.push(feature)
              values.push(data[feature])
            }
          }
        }

        // chart options
        const options = {
          legend: {
            display: false
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  max: 1
                }
              }
            ]
          }
        }

        // chart data (layout)
        const layout = {
          labels: labels,
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
                'rgba(30,50,100, 0.9)'
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
                'rgba(30,50,100, 1)'
              ],
              borderWidth: 1
            }
          ]
        }

        var myChart = new Chart(ctx, {
          type: 'bar',
          data: layout,
          options: options
        })
      })
  }

  // https://koddsson.com/posts/emoji-favicon/
  const favicon = document.querySelector('link[rel=icon]')
  if (favicon) {
    const emoji = favicon.getAttribute('data-emoji')

    if (emoji) {
      const canvas = document.createElement('canvas')
      canvas.height = 64
      canvas.width = 64

      const ctx = canvas.getContext('2d')
      ctx.font = '64px serif'
      ctx.fillText(emoji, 0, 64)

      favicon.href = canvas.toDataURL()
    }
  }
})()
