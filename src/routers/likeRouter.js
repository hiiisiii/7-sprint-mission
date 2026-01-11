import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import { auth } from "../middlewares/auth.js";
import * as likeController from "../controllers/likeController.js";

const router = express.Router();

router.post("/:id/like", auth, asyncHandler(likeController.likeProduct));
router.delete("/:id/like", auth, asyncHandler(likeController.unlikeProduct));

export default router;
