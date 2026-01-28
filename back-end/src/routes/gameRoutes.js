import express from "express";
import { getAllGames, getValue } from "../controllers/gameController.js";

const router = express.Router();

router.get("/", getAllGames);
router.get("/:id", getValue);

export default router;