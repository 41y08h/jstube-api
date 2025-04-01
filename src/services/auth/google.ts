import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "../../db";
import { usersTable } from "../../db/schema";
import { eq } from "drizzle-orm";

export default new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback",
    scope: ["email", "profile"],
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    const { sub: gid, name, email, picture } = profile._json;

    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.gid, gid));

    // null ~ no error
    if (existingUser) return done(null, existingUser);

    const [newUser] = await db
      .insert(usersTable)
      .values({ name, email, picture, gid })
      .returning();

    done(null, newUser);
  }
);
