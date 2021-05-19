import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import prisma from "../../lib/prisma";

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
    const existingUser = await prisma.user.findFirst({
      where: {
        provider: "GOOGLE",
        providerAccountId: profile.id,
      },
    });

    // null ~ no error
    if (existingUser) return done(null, existingUser);

    const newUser = await prisma.user.create({
      data: {
        name: profile._json.name,
        email: profile._json.email,
        picture: profile._json.picture,
        provider: "GOOGLE",
        providerAccountId: profile.id,
      },
    });

    done(null, newUser);
  }
);
