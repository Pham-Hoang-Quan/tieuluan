import express from "express";
import { addUser, addVote, getAllVotes, getAllVotesFromContract, getVoteUpdates, getVoteUpdatesByIdVotingAndUser, getVotesByIdCandidate, getVotesByIdUser, getVotesByIdVoting, updateVote } from "../smartcontract/interact.js";
const router = express.Router();

router.get("/getAllVotes", getAllVotes);//ok 1
router.post("/addUser", addUser); //ok 2
router.post("/addVote", addVote); // postman, app 3
router.post("/updateVote", updateVote); // postman, app 4
router.get("/getVoteUpdatesByIdVotingAndUser/:_idVoting/:_idUser", getVoteUpdatesByIdVotingAndUser); // 5 postman, app
router.get("/getVotesByIdCandidate/:_idCandidate", getVotesByIdCandidate); // 6
router.get("/getVoteByIdUser/:_idUser", getVotesByIdUser); // 7 postman, app
router.get("/getVoteByIdVoting/:_idVoting", getVotesByIdVoting); // 8
router.get("/getVoteUpdates", getVoteUpdates); // 9
router.get("/getAllVotesFromContract", getAllVotesFromContract); // 10

export default router;