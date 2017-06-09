var express = require('express');
var router = express.Router();

var loginCtrl = require('../controllers/spotify_login');
var spotifyCtrl = require('../controllers/spotify_methods');


router.get('/login', loginCtrl.login);

router.get('/callback', loginCtrl.callback);

router.get('/refresh_token', loginCtrl.refreshToken);

router.post('/artists', spotifyCtrl.getArtists);

router.post('/test', spotifyCtrl.test);

module.exports = router;