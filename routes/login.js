var express = require('express');
var router = express.Router();
var passport = require('passport');
const {ensureAuthenticated} = require('../config/secure_content');
var email;

/* GET login page. */
router.get('/', (req, res, next)=>{
  res.render('login');
});

router.post('/', (req, res, next) => {
  email = req.body.email;
    passport.authenticate('user-local', {
      successRedirect: '/centers',
      failureRedirect: '/',
      failureFlash: true
    })(req, res, next);
  });    

router.get('/loggedUser',ensureAuthenticated, (req, res, next)=>{
  res.render('loggedUser', {email: email, user: req.user});
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
