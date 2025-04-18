import { InferSelectModel } from "drizzle-orm";
import asyncHandler from "@/lib/asyncHandler";
import AuthService from "@/services/auth";
import { usersTable } from "@/db/schema";

export default asyncHandler((req, res) => {
  const token = AuthService.serializeUser(
    req.user as InferSelectModel<typeof usersTable>
  );
  const { state } = req.query;
  const clientLocation = typeof state === "string" ? state : undefined;

  if (clientLocation)
    res.redirect(
      `${process.env.AUTH_REDIRECT_URL}?token=${token}&state=${clientLocation}`
    );
  else res.redirect(`${process.env.AUTH_REDIRECT_URL}?token=${token}`);
});
