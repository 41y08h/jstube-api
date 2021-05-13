import passport from "passport";
import google from "./google";

export default function configure() {
  passport.use(google);
}
