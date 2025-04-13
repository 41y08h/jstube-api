import { InferSelectModel } from "drizzle-orm";
import asyncHandler from "@/lib/asyncHandler";
import AuthService from "@/services/auth";
import { usersTable } from "@/db/schema";

export default asyncHandler((req, res) => {
  const token = AuthService.serializeUser(
    req.user as InferSelectModel<typeof usersTable>
  );
  res.redirect(`${process.env.AUTH_REDIRECT_URL}?token=${token}`);
});
