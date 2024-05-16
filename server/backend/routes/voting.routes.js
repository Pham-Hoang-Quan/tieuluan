import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { createConversationUser, getConversationsByUserId } from "../controllers/conversation.controller.js";
import { createVoting, getVotingInfo, getAllCandidates, checkPassword, getVotings, getPrivateVotings, getPublicVotings } from "../controllers/voting.controller.js";
const router = express.Router();

router.get("/:id", getVotingInfo);
router.post("/create", createVoting);
router.get("/getAllCandiddates/:id", getAllCandidates);
router.post("/check-password", checkPassword);
router.get("/getVotings/all", getVotings);
router.get("/getVotings/private", getPrivateVotings);
router.get("/getVotings/public", getPublicVotings);

export default router;