const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load Client model
const Donor = require('../models/donor');
const Owner = require('../models/owner');

module.exports = function(passport) {
  var isDonor = false;
  
  //var isOwner = false;
  passport.use('donor-local',
    new LocalStrategy({ usernameField: 'email',passwordField: 'password' }, (email, password, done) => {
        console.log('donor-local accessed');
        
      // Match user
      Donor.findOne({
        email: email
      }).then(user => {
        if (!user) {
          console.log('donor not found in the db');
        
          return done(null, false, { message: 'This email is not registered' });
        }
        console.log("wahya")
         isDonor=true;
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          console.log("wahya2");
          if (err) throw err;
          if (isMatch) {
            console.log(" Donor logged in");
            //Create session

            //
            return done(null, user);
          } else {
            console.log("wahya3");
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

//login for owner
//const passport = require('passport');
passport.use('owner-local',
    new LocalStrategy({ usernameField: 'email',passwordField: 'password' }, (email, password, done) => {
        console.log('owner-local accessed');
        
      // Match user
      Owner.findOne({
        email: email
      }).then(user => {
        if (!user) {
          console.log('donor not found in the db');
          return done(null, false, { message: 'This email is not registered' });
        }
        console.log("Owner wahya")
         isDonor=false;
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          console.log("owner wahya2");
          if (err) throw err;
          if (isMatch) {
            console.log(" Owner logged in");
            //Create session

            //
            return done(null, user);
          } else {
            console.log("owner wahya3");
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
 
  passport.deserializeUser(function(id, done) {
    console.log(isDonor);
    if(isDonor){
      Donor.findById(id, function(err, user) {
        done(err, user);
      });
    }
    else{
      Owner.findById(id, function(err, user) {
        done(err, user);
      });

    }
  });

};
//end owner



/*module.exports = function(passport) {
  passport.use('owner-local',
    new LocalStrategy({ usernameField: 'userName' }, (userName, password, done) => {
        console.log('login accessed');
      // Match user
      Owner.findOne({
        userName: userName
      }).then(user => {
        if (!user) {
          console.log('owner not found in the db');
          return done(null, false, { message: 'This username is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            console.log("you are logged in");
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Owner.findById(id, function(err, user) {
      done(err, user);
    });
  });
};*/