import { Router } from "express";
import auth from "./auth";
import comment from "./comment";
import rating from "./rating";
import subscription from "./subscription";
import videos from "./videos";

const router = Router();

router.use("/auth", auth);
router.use("/videos", videos);
router.use("/rating", rating);
router.use("/subscription", subscription);
router.use("/comment", comment);

export default router;
