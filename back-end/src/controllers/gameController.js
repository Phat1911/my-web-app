import { prisma } from "../config/db.js";

async function getAllGames (req, res) {
    const games = await prisma.game.findMany();

    return res.status(200).json(games);
}

async function getValue (req, res) {
    const game = await prisma.game.findUnique({ where: {id: Number(req.params.id)} });
    return res.status(200).json(game); 
}

export { getAllGames, getValue };