import { Router } from "express";
import auth from "./auth";
import rating from "./rating";
import videos from "./videos";

const router = Router();

router.use("/auth", auth);
router.use("/videos", videos);
router.use("/rating", rating);

export default router;
