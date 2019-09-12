const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
//const { validationResult } = require('express-validator');
const { check } = require('express-validator');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('forgot', { title: 'FindBlood' });
});

router.get('/sent', function(req, res) {
    res.render('sent');
  });



//POST forget 
router.post('/', [check('email').isEmail().withMessage('The username should be formatted as an email')], function(req, res, next){
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({"email": req.body.email}, function(err, user) {
        if(err)
          console.log(err);
        if (!user) {
          return res.redirect('/');
        } else {
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000;

          user.save(function(err) { 
            done(err, token, user);
          });
        }
      });
    }, function(token, user, done){
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'dessie.orn@ethereal.email',
            pass: 'QQhVFt3Kj4WHYVhMKp'
        }
    });

      var mailOptions = {
        to: user.email,
        from: 'no-reply@findblood.com', 
        subject: 'Password reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'  
      };

      smtpTransport.sendMail(mailOptions, function(err){
        req.flash('info', 'An email has been sent to ' + user.email + ' with further instructions');
        done(err, 'done');
      });
    }
  ],function(err) {
    if(err)
      return next(err);
      res.redirect('/forgot/sent');
  });
}); 


module.exports = router;