const googleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');

passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            scope: ['profile', 'email']
        },
        function (accessToken, refreshToken, profile, callback) {
            callnbackll(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
