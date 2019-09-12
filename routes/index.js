var express = require('express');
var router = express.Router();
const sql = require('mssql');
const request = require('request')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FindBlood' });
});

router.get('/about', function(req, res){
  res.render('about', { title: 'Aboutus' });
});

module.exports = router;
