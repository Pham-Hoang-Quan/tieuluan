import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
export const getUserById = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		res.status(200).json(user);
	} catch (error) {
		console.error("Error in getUserById: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// hàm lất tất cả các users có type là "user"
export const getUsers = async (req, res) => {
	try {
		const users = await User.find({ role: "user" }).select("-password");
		res.status(200).json(users);
	} catch (error) {
		console.error("Error in getUsers: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// hàm update user truyền vào id ở param và body gồm có name, email, avtUrl
export const updateUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const { name, email, avtUrl } = req.body;

		// Tìm người dùng và cập nhật thông tin
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ name, email, avtUrl },
			{ new: true, runValidators: true, context: 'query' }
		).select("-password");

		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json(updatedUser);
	} catch (error) {
		console.error("Error in updateUser: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// hàm lấy thông tin của một user truyền id từ param
export const getUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		res.status(200).json(user);
	} catch (error) {
		console.error("Error in getUser: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}

// viết hàm block một user cho "userId = 0" với _id truyền vào parameter
export const blockUser = async (req, res) => {
	try {
		const { id: userId } = req.params;

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ userId: "0" }, // 0 là bị block
			{ new: true, runValidators: true }
		).select("-password");
		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" });
		}
		res.status(200).json(updatedUser);
	} catch (err) {
		console.error("Error in blockUser: ", err.message);
		res.status(500).json({ error: "Internal server error" });
	}
}

// viết hàm unblock một user cho "userId = 1" với _id truyền vào parameter
export const unblockUser = async (req, res) => {
	try {
		const { id: userId } = req.params;

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ userId: "" }, // 1 là bị unblock
			{ new: true, runValidators: true }
		).select("-password");
		if (!updatedUser) {
			return res.status(404).json({ error: "User not found" });
		}
		res.status(200).json(updatedUser);
	} catch (err) {
		console.error("Error in unblockUser: ", err.message);
		res.status(500).json({ error: "Internal server error" });
	}
}

//hàm lấy các user bị block (userId  == 0)
export const getBlockedUsers = async (req, res) => {
	try {
		const blockedUsers = await User.find({ userId: "0" }).select("-password");
		res.status(200).json(blockedUsers);
	} catch (error) {
		console.error("Error in getBlockedUsers: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}

// hàm lấy các user không bị block (userId == "")
export const getUnblockedUsers = async (req, res) => {
	try {
		const unblockedUsers = await User.find({ userId: "" }).select("-password");
		res.status(200).json(unblockedUsers);
	} catch (error) {
		console.error("Error in getUnblockedUsers: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
}