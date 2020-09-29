const passport = require("passport");
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const User = require("./model/user");

// jwt authantication 
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: process.env.SECRET_KEY,
    passReqToCallback: true
}, async (req, payload, done) => {
    try {
        const user = await User.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        // req.user = user;
        done(null, user);
    } catch (error) {
        done(error, false);
    }
}));
