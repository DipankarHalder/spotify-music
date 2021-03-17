const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');

const config = require('./config');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: config.redirectUri,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    refreshToken
  });
  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn
      });
    })
    .catch(() => res.sendStatus(400));
});

app.post('/login', (req, res) => {
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
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in
      });
    })
    .catch(() => res.sendStatus(400));
});

app.listen(3001);