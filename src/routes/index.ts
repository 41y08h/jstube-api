import { Router } from "express";
import auth from "./auth";
import rating from "./rating";
import subscription from "./subscription";
import videos from "./videos";

const router = Router();

router.use("/auth", auth);
router.use("/videos", videos);
router.use("/rating", rating);
router.use("/subscription", subscription);

export default router;
