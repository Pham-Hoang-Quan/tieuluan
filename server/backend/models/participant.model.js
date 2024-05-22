import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    voteCount: {
        type: Number,
        default: 0
    },
    votingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voting',
        required: true
    },
},
    { timestamps: true }
);

const Participant = mongoose.model('Participant', participantSchema);

export default Participant;