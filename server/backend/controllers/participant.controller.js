import Voting from "../models/voting.model.js";
import bcrypt from "bcryptjs";
import Participant from "../models/participant.model.js";

// hàm kiểm tra user có tham gia vào cuộc bình chọn chưa
// truyền vào id cuộc bình chọn ở parameter
// truyền id của user ở body
export const checkUserJoinVoting = async (req, res) => {
    try {
        const { votingId } = req.params;
        const { userId } = req.body;

        const participant = await Participant.findOne({
            votingId,
            userId
        });

        if (participant) {
            return res.status(200).json({ isJoin: true });
        }

        res.status(200).json({ isJoin: false });
    } catch (error) {
        console.log("Error in checkUserJoinVoting controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// hàm thêm một participant vào cuộc bình chọn
// truyền votingId vào parameter và userId vào body
export const addParticipant = async (req, res) => {
    try {
        const { votingId } = req.params;
        const { userId } = req.body;

        const participant = new Participant({
            votingId,
            userId
        });

        await participant.save();

        res.status(201).json(participant);
    } catch (error) {
        console.log("Error in addParticipant controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// hàm lấy tất cả các participants của một voting
// truyền vào votingId ở parameter
export const getAllParticipants = async (req, res) => {
    try {
        const { votingId } = req.params;

        const participants = await Participant.find({
            votingId
        });

        // nếu không tìm thầy trả về không có
        if (!participants) {
            return res.status(404).json({ error: "Participants not found" });
        }

        res.status(200).json(participants);
    } catch (error) {
        console.log("Error in getAllParticipants controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// hàm lấy các votings mà user đã tham gia 
// truyền vào userId ở parameter
export const getVotingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const participants = await Participant.find({
            userId
        });

        res.status(200).json(participants);
    } catch (error) {
        console.log("Error in getVotingsByUser controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// hàm thêm một participant vào cuộc bình chọn
// truyền votingId vào parameter và userId, password của votings vào body
export const addParticipantWithPassword = async (req, res) => {
    try {
        const { votingId } = req.params;
        const { userId, password } = req.body;

        const voting = await Voting.findById(votingId);

        if (!voting) {
            return res.status(404).json({ error: "Voting not found" });
        }

        const isMatch = await bcrypt.compare(password, voting.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const participant = new Participant({
            votingId,
            userId
        });

        await participant.save();

        res.status(201).json(participant);
    } catch (error) {
        console.log("Error in addParticipantWithPassword controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};