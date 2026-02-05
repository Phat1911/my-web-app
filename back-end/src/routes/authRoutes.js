import express from "express";
import multer from "multer";
import { register, login, logout, findUser, updateProfile, updateAVT, updateScore, getAll, getAllByName } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/register", register); 
router.post("/login", login);
router.post("/logout", logout);
router.post("/update", authMiddleware, updateProfile);
router.post("/updateSc", authMiddleware, updateScore);
router.post("/updateAvt", upload.single("previewURL"), updateAVT);
router.get("/me", findUser);
router.get("/getAll", getAll);
router.get("/getAllByName/:name", getAllByName);

export default router;