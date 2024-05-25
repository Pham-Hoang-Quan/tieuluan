import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import Voting from "../models/voting.model.js";
import Candidate from "../models/candidate.model.js";

// hàm thêm một ứng viên truyền vào từ param và body: name, description, imgUrl
export const addCandidate = async (req, res) => {
    try {
        const { votingId } = req.params; 
        const { name, description, imgUrl } = req.body; 

        const newCandidate = new Candidate({
            idVoting: votingId, 
            name,
            description,
            imgUrl,
        });

        await newCandidate.save();

        const voting = await Voting.findById(votingId);
        if (!voting) {
            return res.status(404).json({ error: "Voting not found" });
        }

        voting.candidates.push(newCandidate._id);
        await voting.save();

        res.status(201).json(newCandidate);
    } catch (error) {
        console.log("Error in addCandidateToVoting controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// hàm lấy thông tin ứng 1 viên truyền vào từ param
export const getCandidateInfo = async (req, res) => {
    try {
        // id của candidate truyền vào params getCandidateInfo/:id
        const { canId } = req.params; 

        let candidateInfo = await Candidate.findById(canId);

        if (!candidateInfo) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        res.status(200).json(candidateInfo);
    } catch (error) {
        console.log("Error in getCandidateInfo controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

