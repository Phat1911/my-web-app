import express from "express";
import { sendMessage, getConversation, getConversationList, followUser, getFollowingList } from "../controllers/chatController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/conversation/:partnerId", authMiddleware, getConversation);
router.get("/conversations", authMiddleware, getConversationList);
router.post("/follow", authMiddleware, followUser);
router.get("/following", authMiddleware, getFollowingList);

export default router;
