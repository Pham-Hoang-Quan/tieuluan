import mongoose from "mongoose";

const votingSchema = new mongoose.Schema(
    {
        imgUrl: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        startAt: {
            type: String,
            required: true,
        },
        endAt: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        candidates: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Candidate",
                default: [],
            },
        ],
        password: {
            type: String,
            default: "",
        },
        isPrivate: {
            type: Boolean,
            default: false,
        },
    },

    { timestamps: true }
);

const Voting = mongoose.model("Voting", votingSchema);

export default Voting;

// UI -> 