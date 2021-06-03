import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "../../lib/db";

export default new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["email", "profile"],
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    const { sub: gid, name, email, picture } = profile._json;

    const {
      rows: [existingUser],
    } = await db.query(
      `
      select * from "User"
      where gid = $1
      `,
      [gid]
    );

    // null ~ no error
    if (existingUser) return done(null, existingUser);

    const {
      rows: [newUser],
    } = await db.query(
      `
      insert into "User"(name, email, picture, gid)
      values ($1, $2, $3, $4) returning *
      `,
      [name, email, picture, gid]
    );

    done(null, newUser);
  }
);
