const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");


const { upload } = require("../config/cloudinaryConfig");

// ─── USER (chính chủ) ─────────────────────────────────────
router.get("/profile", protect, userController.getProfile);


router.put("/profile", protect, upload.single("avatar"), userController.updateProfile);

router.put("/change-password", protect, userController.changePassword);

// ─── ADMIN ────────────────────────────────────────────────
router.get("/", protect, adminOnly, userController.getUsers);
router.put("/:id", protect, adminOnly, userController.updateUser);
router.delete("/:id", protect, adminOnly, userController.deleteUser);

module.exports = router;