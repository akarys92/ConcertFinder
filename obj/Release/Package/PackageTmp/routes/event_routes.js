var express = require('express');
var router = express.Router();

var tmCtrl = require('../controllers/ticketmaster_methods');

router.post('/all', tmCtrl.getAll);

module.exports = router;