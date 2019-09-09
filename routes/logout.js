var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/donor', (req, res) => {
    req.logout();
    res.redirect('/login/donor');
  });

  router.get('/owner', (req, res) => {
    req.logout();
    res.redirect('/');
    //res.redirect('/');
  });

module.exports = router;
