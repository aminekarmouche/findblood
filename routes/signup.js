var express = require('express');
var router = express.Router();
const Donor = require('../models/donor');
const Owner = require('../models/owner');
const Center = require('../models/center');
const Address = require('../models/address');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');


/* donor signup */
router.get('/donor', (req, res, next)=> {
  res.render('signupDonor');
});

router.post('/donor',[
  check('firstName').isLength({min:2}).withMessage('The first name must be entered'),
  check('lastName').isLength({min:2}).withMessage('The last name must be entered'),
  check('userName').isLength({min:2}).withMessage('The username must be entered'),
  check('email').isEmail().withMessage('The username should be formatted as an email'),
  check('password').isLength({min:6}).withMessage('Password should be at least 6 characters'),
  check('password2').isLength({min:2}).withMessage('Re enter the password')
],
(req,res,next)=>{
   errs = validationResult(req);
  if (!errs.isEmpty()) {
    return res.status(422).json({ errs: errs.array()});
  }
  else{

    
    const { firstName, lastName, userName,email, password, password2, bloodType } = req.body;
    console.log(bloodType);
    
    let errors = [];

    if (!bloodType) {
      errors.push({ msg: 'Please enter all fields' });
    }

    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
      res.render('signupDonor', {
        errors,
        firstName,
        lastName,
        userName,
        email,
        password,
        password2,
        bloodType
      });
    } else {
      Donor.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('signupDonor', {
            errors,
            firstName,
            userName
          });
        } else {
          const newDonor = new Donor({
            firstName,
            lastName,
            userName,
            email,
            password,
            bloodType
          });
          //res.redirect('/users/login');

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newDonor.password, salt, (err, hash) => {
              if (err) throw err;
              newDonor.password = hash;
              newDonor
                .save()
                .then(user => {
                  res.redirect('/signup/donor');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
}
});
/* owner of centers signup*/
router.get('/owner', (req, res, next)=> {
  res.render('signupOwner');
});

router.post('/owner',[
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

    
    const { firstName, lastName, userName,email, password, password2,centerName, city, district, street, zipcode } = req.body;
    
    
    let errors = [];

    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
      res.render('signupOwner', {
        errors,
        firstName,
        userName
      });
    } else {
      Owner.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('signupOwner', {
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
          const newOwner = new Owner({
            firstName,
            lastName,
            userName,
            email,
            password
          });

          const newCenter = new Center({
            centerName,
            address : newAddress._id,
            owner : newOwner._id
          });

          newAddress.save();
          newCenter.save();

          //res.redirect('/users/login');

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newOwner.password, salt, (err, hash) => {
              if (err) throw err;
              newOwner.password = hash;
              newOwner
                .save()
                .then(user => {
                  res.redirect('/signup/owner');
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
