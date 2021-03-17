const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const config = require('./config');

const app = express();

app.post('/', (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: config.redirectUri,
    clientId: config.clientId,
    clientSecret: config.clientSecret
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token ,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in
      })
    })
})