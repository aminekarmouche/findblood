var express = require('express');
var router = express.Router();
var passport = require('passport');
const {ensureAuthenticated} = require('../config/secure_content');
var email;

/* GET users listing. */
router.get('/', (req, res, next)=>{
  res.render('login');
});

/* GET users listing. */
router.get('/owner', (req, res, next)=>{
    res.render('loginOwner');
});

router.get('/donor', (req, res, next)=>{
  res.render('loginDonor');
});


router.post('/owner', (req, res, next) => {
  email = req.body.email;
    passport.authenticate('owner-local', {
      successRedirect: '/login/loggedOwner',
      failureRedirect: '/login/owner',
      failureFlash: true
    })(req, res, next);
  });


  router.post('/donor', (req, res, next) => {
    email = req.body.email;
      passport.authenticate('donor-local', {
        successRedirect: '/login/loggedDonor',
        failureRedirect: '/login/donor',
        failureFlash: true
      })(req, res, next);
    });

router.get('/loggedOwner',ensureAuthenticated, (req, res, next)=>{
  res.render('loggedOwner', {email});
});

router.get('/loggedDonor',ensureAuthenticated, (req, res, next)=>{
  res.render('loggedDonor', {email});
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
