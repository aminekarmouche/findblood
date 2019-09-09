const express = require('express');
const router = express.Router();
const Owner = require('../models/owner');
const bcrypt = require('bcryptjs');
const Donor = require('../models/donor');
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

router.get('/reset/:token', function(req, res) {
  Owner.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {
      user: req.user
    });
  });
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
      Owner.findOne({"email": req.body.email}, function(err, user) {
        if(err)
          console.log(err);
        if (!user) {
          console.log('No account with that email address exists.');
          return res.redirect('/forgot');
        } else {
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 36000000;

          user.save(function(err) { 
            done(err, token, user);
          });
        }
      });
    }, function(token, owner, done){
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'dessie.orn@ethereal.email',
            pass: 'QQhVFt3Kj4WHYVhMKp'
        }
    });

      var mailOptions = {
        to: owner.email,
        from: 'no-reply@findblood.com', 
        subject: 'Password reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/forgot/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'  
      };

      smtpTransport.sendMail(mailOptions, function(err){
        req.flash('info', 'An email has been sent to ' + owner.email + ' with further instructions');
        done(err, 'done');
      });
    }
  ],function(err) {
    if(err)
      return next(err);
      res.redirect('/forgot/sent');
  });
}); 

//POST reset token
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      Owner.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, function(err, user) {
        if (!user) {
          return res.redirect('back');
        } else 
        if(err)

        user.resetPasswordToken = undefined;
        user.resetPasswordToken = undefined;


        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .then(user => {
                res.redirect('/login');
                done(err, user);
              })
              .catch(err => console.log(err));
          });
        });
      });
    },
    function(user, done) {
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
        'http://' + req.headers.host + '/forgot/reset/' + req.params.token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'  
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});

module.exports = router;