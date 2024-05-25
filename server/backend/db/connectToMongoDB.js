import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		await mongoose.connect("mongodb+srv://quanpham3012:zeSyuSGbxZEiSRQz@cluster0.wx0hrv2.mongodb.net/");
		// await mongoose.connect("");
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;
