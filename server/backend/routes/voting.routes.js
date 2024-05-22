import express from "express";
import { createVoting, getVotingInfo, getAllCandidates, checkPassword, getVotings, getPrivateVotings, getPublicVotings, updateVoting, getVotingsByOwner } from "../controllers/voting.controller.js";
const router = express.Router();

router.get("/:id", getVotingInfo);
router.post("/create", createVoting);
router.get("/getAllCandiddates/:id", getAllCandidates);
router.post("/check-password", checkPassword);
router.get("/getVotings/all", getVotings);
router.get("/getVotings/private", getPrivateVotings);
router.get("/getVotings/public", getPublicVotings);
router.put('/updateVoting/:id', updateVoting);
router.get('/getYourVotings/:owner', getVotingsByOwner);
export default router;