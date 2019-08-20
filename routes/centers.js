var express = require('express');
var router = express.Router();
var googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyBODpepyJZhwLboDrq761_rtwsz7cP3umU'
    });
  
/* GET users listing. */
router.get('/', function(req, res, next) {
// Geocode an address.
googleMapsClient.geocode({
  address: '1600 Amphitheatre Parkway, Mountain View, CA'
}, function(err, response) {
  if (!err) {
    console.log(response);
  }
  else
    console.log(err);
});


    res.render('centers', { title: 'Center' });
});

module.exports = router;



