import express from "express";
import { addParticipant, addParticipantWithPassword, checkUserJoinVoting, getAllParticipants, getVotingsByUser } from "../controllers/participant.controller.js";

const router = express.Router();

router.post("/checkUser/:votingId", checkUserJoinVoting); // ok
router.post("/addParticipant/:votingId", addParticipant); // ok
router.post("/addUserWithPassword/:votingId", addParticipantWithPassword); 
router.get("/getAllParticipants/:votingId", getAllParticipants);
router.get("/getVotingByUser/:votingId", getVotingsByUser);


export default router;
