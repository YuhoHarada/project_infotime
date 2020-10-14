require('dotenv').config()
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const User = require('../models/companies')
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECTRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    (accessToken, refreshToken, profile, done) => {
        console.log(profile)

        User.find({ googleId: profile.id }).then(user => {

            console.log(user)
            if (user.length > 0) {
                //user.exist
                console.log('user already exist')
                done(null, user)

            } else {
                //user don't exist
                new User({
                    googleId: profile.id,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    emails: profile.emails[0].value,
                    picture: profile.photos[0].value,
                    signUp: true
                }).save()
                    .then((result) => {
                        console.log('user Created');
                        done(null, result)
                    })
            }
        })



    }
))