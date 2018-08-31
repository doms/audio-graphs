var ctx

function resetCanvas() {
  // get feature chart and its parent container
  const featureChartContainer = document.getElementById(
    'features-chart-container'
  )
  const featureChart = document.getElementById('features-chart')

  // remove feature chart
  featureChartContainer.removeChild(featureChart)

  // re-add new <canvas> element
  let canvas = document.createElement('canvas')
  canvas.setAttribute('id', 'features-chart')
  featureChartContainer.appendChild(canvas)

  // set ctx to new features chart
  ctx = document.getElementById('features-chart')
}

function getFeatures(id) {
  // reset canvas for new search result
  resetCanvas()

  // set search query with id
  let query = `/features?id=${id}`

  $.get(query, function(data) {
    const labels = []
    const values = []

    // store labels (danceability, energy, valence, etc.) and their scores
    for (let feature in data) {
      if (
        data.hasOwnProperty(feature) &&
        feature !== 'key' &&
        feature !== 'mode'
      ) {
        if (data[feature] <= 1 && data[feature] >= 0) {
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

$(function() {
  console.log('test test 1 2 3 lemao')

  let trackID = ''
  let searchQuery = ''
  let resultIDs = []

  $('form').submit(function(event) {
    event.preventDefault()

    searchQuery = `/search?query=${$('input').val()}`

    // search for tracks
    fetch(searchQuery)
      .then(response => response.json())
      .then(json => {
        // clear previous search results
        document.getElementById('results').textContent = ''

        json.tracks.items.forEach(track => {
          resultIDs.push(track.id)

          let newEl = $(
            '<li class="text-salmon" onClick="getFeatures(&apos;' +
              track.id +
              '&apos;)"></li>'
          ).text(track.name + '   |   ' + track.artists[0].name)

          $('#results').append(newEl)

          /* TODO: figure out how to dynamically set onclick event listener */
          // let el = document.createElement('li')
          // el.className = 'text-salmon'
          // el.setAttribute('value', track.id)
          // el.textContent = `${track.name}   |   ${track.artists[0].name}`

          // attach event
          // el.onclick = getFeatures(el.id)

          // add result to results
          // results.appendChild(el)
        })
      })
  })
})
