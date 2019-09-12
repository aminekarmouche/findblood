var express = require('express');
var router = express.Router();
// var googleMapsClient = require('@google/maps').createClient({
//     key: ''
//     });
  
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('centers', { title: 'Center' });
});

module.exports = router;



