const path = require('path')
const express = require('express')
const app = express()

// load secrets from .env
require('dotenv').config({path: path.join(__dirname, '.env')})

// init Spotify API wrapper
const SpotifyWebApi = require('spotify-web-api-node')

// Add your Spotify app credentials to the .env file
const spotify = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
})

//
spotify.clientCredentialsGrant().then(
  data => {
    console.log(
      `Generated an access token, it expires in ${data.body['expires_in']}`
    )

    // Save the access token so that it's used in future calls
    spotify.setAccessToken(data.body['access_token'])
  },
  err => {
    console.log(
      `Something went wrong when retrieving an access token: ${err.message}`
    )
  }
)

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get('/search', (request, response) => {
  spotify.searchTracks(request.query.query).then(
    data => {
      response.send(data.body)
    },
    err => {
      console.log(err)
    }
  )
})

app.get('/features', (request, response) => {
  spotify.getAudioFeaturesForTrack(request.query.id).then(
    data => {
      response.send(data.body)
    },
    err => {
      console.log(err)
    }
  )
})

// listen for requests :)
const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Your app is listening on port: ${port}`)
})
