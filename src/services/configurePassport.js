const passport = require("passport");
const User = require("../models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        const query = {
          "provider.name": "GOOGLE",
          "provider.accountId": profile.id,
        };

        const existingUser = await User.findOne(query);

        // null ~ no error
        if (existingUser) return done(null, existingUser);

        const newUser = new User({
          name: profile._json.name,
          email: profile._json.email,
          picture: profile._json.picture,
          provider: { name: "GOOGLE", accountId: profile.id },
        });

        done(null, await newUser.save());
      }
    )
  );
}

module.exports = configurePassport;
