var express = require('express');
var router = express.Router();

/* GET logout user. */

  router.get('/', (req, res) => {
    req.logout();
    res.redirect('/');
    //res.redirect('/');
  });

module.exports = router;
