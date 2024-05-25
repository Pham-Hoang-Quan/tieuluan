import { ethers, JsonRpcProvider } from 'ethers';
import { contract } from './contract.js';

const API_URL = "https://eth-sepolia.g.alchemy.com/v2/tVskwpkt-IvpSVkM408zyEAubbCQB4u3";
const PRIVATE_KEY = "238a3f6304dbefb10abaee88d8de3132b7a4b15136c00ba1209c982a9b410a10";
const CONTRACT_ADDRESS = "0xe9fE15A6Be86a57c9A8dbB3dcD4441CFE24471C0";

const alchemyProvider = new JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, alchemyProvider);
const votingContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, signer);

// 1 hàm api trả về các votes
export const getAllVotes = async (req, res) => {
    try {
        const votes = await votingContract.getAllvotes();
        res.status(200).json(votes);
    } catch (error) {
        console.error("Error in getAllVotes controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// 2 hàm thêm user vào mảng users (postman, app)
export const addUser = async (req, res) => {
    try {
        const { user } = req.body;

        // Kiểm tra input từ người dùng (ví dụ)
        if (!user) {
            return res.status(400).json({ error: "Invalid user data" });
        }

        const tx = await votingContract.addUser(user);
        await tx.wait(1); // Wait for one confirmation

        console.log("Transaction mined! Hash:", tx.hash);
        res.status(201).json({ message: "User added successfully", txHash: tx.hash }); 

    } catch (error) {
        console.error("Error in addUser controller:", error);
        res.status(500).json({ error: error.message });
    }
};


// 3 Hàm thêm vote
export const addVote = async (req, res) => {
    try {
      const { _id, _idUser, _idCandidate, _idVoting, _time } = req.body;
  
      // Kiểm tra input (nếu cần)
      if (!_id || !_idUser || !_idCandidate || !_idVoting || !_time) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const tx = await votingContract.addVote(_id, _idUser, _idCandidate, _idVoting, _time);
      await tx.wait(1);
  
      console.log("Vote added! Hash:", tx.hash);
      res.status(201).json({ message: "Vote added successfully", txHash: tx.hash });
  
    } catch (error) {
      console.error("Error in addVote controller:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  // 4 Hàm cập nhật vote
  export const updateVote = async (req, res) => {
    try {
      const { _id, _idUser, _idCandidateNew, _idCandidateOld, _idVoting, _time } = req.body;
  
      // Kiểm tra input (nếu cần)
      if (!_id || !_idUser || !_idCandidateNew || !_idCandidateOld || !_idVoting || !_time) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      const tx = await votingContract.updateVote(
        _id,
        _idUser,
        _idCandidateNew,
        _idCandidateOld,
        _idVoting,
        _time
      );
      await tx.wait(1);
  
      console.log("Vote updated! Hash:", tx.hash);
      res.status(200).json({ message: "Vote updated successfully", txHash: tx.hash });
  
    } catch (error) {
      console.error("Error in updateVote controller:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  // 5 Các hàm đọc dữ liệu từ smart contract
  export const getVoteUpdatesByIdVotingAndUser = async (req, res) => {
    try {
      const { _idVoting, _idUser } = req.params; 
      const data = await votingContract.getVoteUpdatesByIdVotingAndUser(_idVoting, _idUser);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error in getVoteUpdatesByIdVotingAndUser controller:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  // 6
  export const getVotesByIdCandidate = async (req, res) => {
    try {
      const { _idCandidate } = req.params; 
      const data = await votingContract.getvotesByIdCandidate(_idCandidate);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error in getVotesByIdCandidate controller:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  // 7
  export const getVotesByIdUser = async (req, res) => {
    try {
      const { _idUser } = req.params; 
      const data = await votingContract.getvotesByIdUser(_idUser);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error in getVotesByIdUser controller:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  // 8
  export const getVotesByIdVoting = async (req, res) => {
    try {
      const { _idVoting } = req.params; 
      const data = await votingContract.getvotesByIdVoting(_idVoting);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error in getVotesByIdVoting controller:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  // 9
  export const getVoteUpdates = async (req, res) => {
    try {
      const data = await votingContract.voteUpdates();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error in getVoteUpdates controller:", error);
      res.status(500).json({ error: error.message });
    }
  };
  // 10
  export const getAllVotesFromContract = async (req, res) => {
    try {
      const data = await votingContract.votes();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error in getAllVotesFromContract controller:", error);
      res.status(500).json({ error: error.message });
    }
  };