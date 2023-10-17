const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User'); 


const router = express.Router();

router.use(passport.initialize());

passport.use(new GoogleStrategy({
    clientID: '555073022548-v084egu77mcpoc22r6gc3slhe5rs62v0.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3001/auth/google/callback', //call back url
},
(accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));
router.use(passport.initialize());
router.use(passport.session());
//Set the route
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        try {
            const profile = req.user; 

            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
                //if already exists set as logged in
                req.session.user = existingUser;
                res.redirect('/member'); //after login redirect to member 
            } else {
                //if new user store in database
                const newUser = new User({
                    googleId: profile.id,
                    username: profile.displayName
                });
                await newUser.save();

                //set as logged in
                req.session.user = newUser;
                res.redirect('/member'); 
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
);

//User selialize
passport.serializeUser((user, done) => {
    done(null, user.id); //store userin in session
});
passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            if (!user) {
                return done(null, false); // if no user exist
            }
            done(null, user); // recover user infomation
        })
        .catch(err => {
            done(err, null);
        });
});






module.exports = router;
