import { prisma } from "../config/db.js";

async function getAllGames (req, res) {
    const games = await prisma.game.findMany();

    return res.status(200).json(games);
}


export { getAllGames };