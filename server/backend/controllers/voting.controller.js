import Voting from "../models/voting.model.js";
import bcrypt from "bcryptjs";


// hàm lấy thông tin voting truyền vào từ param
export const getVotingInfo = async (req, res) => {
    try {
        // id của voting truyền vào params getVotingInfo/:id
        const { id: votingId } = req.params; 

        let votingInfo = await Voting.findOne({
            _id: votingId,
        }).populate('candidates').populate('owner'); // giả định 'candidates' là trường chứa thông tin về các ứng cử viên, 'owner' là trường chứa thông tin về chủ sở hữu

        if (!votingInfo) {
            return res.status(404).json({ error: "Voting not found" });
        }

        res.status(200).json(votingInfo);
    } catch (error) {
        console.log("Error in getVotingInfo controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// hàm tạo một voting mới
export const createVoting = async (req, res) => {
    try {
        const { title, description, imgUrl, startAt, endAt, owner, password, isPrivate } = req.body; 

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newVoting = new Voting({
            title,
            description,
            imgUrl,
            startAt,
            endAt,
            owner,
            password: hashedPassword, // Sử dụng mật khẩu đã mã hóa
            isPrivate,
        });

        await newVoting.save();

        res.status(201).json(newVoting);
    } catch (error) {
        console.log("Error in createVoting controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// hàm lấy tất cả candidates của một voting truyền vào từ param
export const getAllCandidates = async (req, res) => {
    try {
        // id của voting truyền vào params getAllCandidates/:id
        const { id: votingId } = req.params; 

        let voting = await Voting.findById(votingId).populate('candidates');

        if (!voting) {
            return res.status(404).json({ error: "Voting not found" });
        }

        res.status(200).json(voting.candidates);
    } catch (error) {
        console.log("Error in getAllCandidates controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// hàm check password của voting truyền vào từ body
export const checkPassword = async (req, res) => {
    try {
        const { votingId, password } = req.body; 

        let voting = await Voting.findById(votingId);

        if (!voting) {
            return res.status(404).json({ error: "Voting not found" });
        }

        const isMatch = await bcrypt.compare(password, voting.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.log("Error in checkPassword controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// hàm lấy tất cả các votings
export const getVotings = async (req, res) => {
    try {
        let votings = await Voting.find().populate('owner');

        res.status(200).json(votings);
    } catch (error) {
        console.log("Error in getVotings controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Hàm lấy các votings có isPrivate là true
export const getPrivateVotings = async (req, res) => {
    try {
        let votings = await Voting.find({ isPrivate: true });

        res.status(200).json(votings);
    } catch (error) {
        console.log("Error in getPrivateVotings controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// lấy các votings có isPrivate là false
export const getPublicVotings = async (req, res) => {
    try {
        let votings = await Voting.find({ isPrivate: false });

        res.status(200).json(votings);
    } catch (error) {
        console.log("Error in getPublicVotings controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// hàm cập nhật thông tin của một voting truyền vào id từ param 
// và body gồm có title, description, imgUrl, startAt, endAt
export const updateVoting = async (req, res) => {
    try {
        // id của voting truyền vào params updateVoting/:id
        const { id: votingId } = req.params;

        // Lấy dữ liệu từ body
        const { title, description, imgUrl, startAt, endAt} = req.body;

        // Tìm và cập nhật thông tin của voting
        const updatedVoting = await Voting.findByIdAndUpdate(
            votingId,
            {
                title,
                description,
                imgUrl,
                startAt,
                endAt,
            },
            { new: true, runValidators: true } // Trả về document đã cập nhật
        );

        if (!updatedVoting) {
            return res.status(404).json({ error: "Voting not found" });
        }

        res.status(200).json(updatedVoting);
    } catch (error) {
        console.log("Error in updateVoting controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// hàm lấy các voting bằng owner truyền vào từ param
export const getVotingsByOwner = async (req, res) => {
    try {
        // id của owner truyền vào params getVotingsByOwner/:owner
        const { owner } = req.params;

        let votings = await Voting.find({ owner });

        res.status(200).json(votings);
    } catch (error) {
        console.log("Error in getVotingsByOwner controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};