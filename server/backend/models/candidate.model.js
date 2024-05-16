import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
	{
		// createdAt, updatedAt
        idVoting: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Voting",
            required: true,
        },
        imgUrl: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
	},
	{ timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;

// UI -> 