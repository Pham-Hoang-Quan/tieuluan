import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createConversationUser, getConversationsByUserId } from "../controllers/conversation.controller.js";

const router = express.Router();

router.get("/", protectRoute, getConversationsByUserId);
router.post("/:id", protectRoute, createConversationUser); // id của người nhận

export default router;