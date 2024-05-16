import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";

export const getConversationsByUserId = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        let conversations = await Conversation.find({ participants: { $in: [loggedInUserId] } }).populate("participants", "_id fullName profilePic");

        // Modify each conversation
        conversations = conversations.map(conversation => {
            // If the conversation type is 'user', set the name and img to the other user's fullName and profilePic
            if (conversation.type === 'user') {
                const otherUser = conversation.participants.find(participant => participant._id.toString() !== loggedInUserId.toString());
                conversation.name = otherUser.fullName;
                conversation.img = otherUser.profilePic;
            }

            return conversation;
        });

        res.status(200).json(conversations);
    } catch (error) {
        console.log("Error in getConversations controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
// hàm tạo một conversation có kiểu là user khi 2 người đồng ý kết bạn
export const createConversationUser = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const loggedInUserId = req.user._id;
        
        // Create a new conversation with type 'user' and participants
        const conversation = new Conversation({
            type: 'user',
            participants: [receiverId, loggedInUserId]
        });

        // Save the conversation to the database
        await conversation.save();

        res.status(201).json(conversation);
    } catch (error) {
        console.log("Error in createConversation controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};