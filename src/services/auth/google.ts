import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import User from "../../models/User";

declare var process: {
  env: {
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
  };
};

export default new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["email", "profile"],
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
);
