var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Center = require('../models/center');
const Address = require('../models/address');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const { check } = require('express-validator');

/* GET signup page. */
router.get('/', (req, res, next)=>{
  res.render('signup');
});

router.post('/',[
  check('firstName').isLength({min:2}).withMessage('The first name must be entered'),
  check('lastName').isLength({min:2}).withMessage('The last name must be entered'),
  check('userName').isLength({min:2}).withMessage('The username must be entered'),
  check('email').isEmail().withMessage('The username should be formatted as an email'),
  check('password').isLength({min:6}).withMessage('Password should be at least 6 characters'),
  check('password2').isLength({min:6}).withMessage('re enter the password'),
  check('centerName').isLength({min:1}).withMessage('center name must be entered'),
  check('city').isLength({min:1}).withMessage('city must be entered'),
  check('district').isLength({min:1}).withMessage('district must be entered'),
  check('street').isLength({min:1}).withMessage('street must be entered'),
  check('zipcode').isLength({min:1}).withMessage('zipcode must be entered')
],
(req,res,next)=>{
  const errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.status(422).json({ errs: errs.array()});
  }
  else{

    
    const { firstName, lastName, userName, email, role, password, password2, centerName, city, district, street, zipcode } = req.body;
    
    
    let errors = [];

    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
      res.render('signup', {
        errors,
        firstName,
        userName
      });
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('signup', {
            errors,
            firstName,
            userName
          });
        } else {
          const newAddress = new Address({
            city,
            district,
            street,
            zipcode
          });
          const newUser = new User({
            firstName,
            lastName,
            userName,
            email,
            password
          });

          const newCenter = new Center({
            centerName,
            address : newAddress._id,
            owner : newUser._id
          });

          newAddress.save();
          newCenter.save();

          //res.redirect('/users/login');
          newUser.role = role;
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.resetPasswordToken = undefined;
              newUser.resetPasswordExpires = undefined;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  res.redirect('/signup');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
}
});

module.exports = router;
