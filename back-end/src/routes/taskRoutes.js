import express from "express";
import { getOrCreateTask, completeTask, getTaskHistory } from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/current", authMiddleware, getOrCreateTask);
router.post("/complete", authMiddleware, completeTask);
router.get("/history", authMiddleware, getTaskHistory);

export default router;
