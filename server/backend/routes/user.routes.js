import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar, getUserById, getUsers, updateUser, getBlockedUsers, getUnblockedUsers, blockUser, unblockUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsersForSidebar);
router.get("/:id", getUserById);
router.get("/getUsers/user", getUsers);
router.post("/updateUser/:id", updateUser);
router.get("/getUsers/blocked", getBlockedUsers);
router.get("/getUsers/unblocked", getUnblockedUsers);
router.put("/blockUser/:id", blockUser);
router.put("/unblockUser/:id", unblockUser);

export default router;
