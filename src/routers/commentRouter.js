import express from "express";
import { asyncHandler } from "../middlewares/async-handler.js";
import * as commentController from "../controllers/commentController.js";

const router = express.Router();

router.patch("/:id", asyncHandler(commentController.update));
router.delete("/:id", asyncHandler(commentController.remove));

export default router;
