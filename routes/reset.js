const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

//GET Token
router.get('/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {
        user: req.user
      });
    });
  });
  
  
  //POST reset token
  router.post('/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
  
          //user.password = req.body.password;

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (err) throw err;
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
              user.password = hash;
              user
                .save()
                .then(user => {
                  res.redirect('/loggeduser');
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
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          console.log('Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });



  
module.exports = router;