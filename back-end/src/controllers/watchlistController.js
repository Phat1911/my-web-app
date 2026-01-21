import { prisma } from "../config/db.js";
import { addToWatchlistSchema } from "../validator/watchlistValidator.js";

const addToWatchlist = async (req, res) => {
    const { movieId, status, rating, notes } = req.body;

    const movie = await prisma.movie.findUnique({
        where: {id: movieId},
    });

    if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
    }

    const existingInWatchItem = await prisma.watchListItem.findUnique({
        where: {
            userId_movieId: {
                userId: req.user.id,
                movieId: movieId,
            },
        },
    });

    if (existingInWatchItem) {
        return res.status(400).json({ error: "Movie already in the watchlist" });
    }

    const watchListItem = await prisma.watchListItem.create({
        data: {
            userId: req.user.id,
            movieId,
            status: status || "PLANNED",
            rating,
            notes,
        },
    });

    res.status(201).json({
        status: "Success",
        data: {
            watchListItem,
        },
    });

}

const removeFromWatchlist = async (req, res) => {
    const item = await prisma.watchListItem.findUnique({
        where: { id: req.params.id },
    });

    if (!item) {
        return res.status(404).json({ error: "Watchlist item not found" });
    }

    if (req.user.id !== item.userId) {
        return res.status(403).json({ error: "Not allowed to update this watchlist item" });
    }

    await prisma.watchListItem.delete({ where: { id: req.params.id } });
    return res.status(200).json({
        status: "Success!",
        message: "Movie removed from watchlist",
    });
};

const updateWatchlistItem = async (req, res) => {
    const { status, rating, notes } = req.body;

    const item = await prisma.watchListItem.findUnique({
        where: { id: req.params.id },
    });

    if (!item) return res.status(404).json({ error: "Watchlist item not found" });

    if (req.user.id !== item.userId) {
        return res.status(403).json({ error: "Not allowed to update this watchlist item" });
    }

    await prisma.watchListItem.update({
        where: { id: req.params.id },
        data: {
            status: status,
            rating: rating,
            notes: notes,
        }
    })

    return res.status(200).json({
        status: "Success!",
        message: "Movie updated!",
    });
}

export { addToWatchlist, removeFromWatchlist, updateWatchlistItem };