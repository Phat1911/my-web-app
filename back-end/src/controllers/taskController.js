import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";

async function getOrCreateTask(req, res) {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Use transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { lastTaskAssigned: true },
      });

      const now = new Date();
      const oneHour = 60 * 60 * 1000;

      const pendingTask = await tx.task.findFirst({
        where: { userId: userId, completed: false },
        include: { game: true },
        orderBy: { assignedAt: "desc" },
      });

      if (pendingTask) {
        const timeSinceAssigned = now - new Date(pendingTask.assignedAt);
        const timeRemaining = Math.max(0, oneHour - timeSinceAssigned);
        return { task: pendingTask, timeRemaining: Math.floor(timeRemaining / 1000), isNew: false };
      }

      if (user.lastTaskAssigned) {
        const timeSinceLast = now - new Date(user.lastTaskAssigned);
        if (timeSinceLast < oneHour) {
          return {
            task: null,
            timeRemaining: Math.floor((oneHour - timeSinceLast) / 1000),
            message: "Next task in " + Math.floor((oneHour - timeSinceLast) / 1000 / 60) + " minutes",
          };
        }
      }

      const games = await tx.game.findMany();
      if (games.length === 0) {
        throw new Error("No games available");
      }

      const randomGame = games[Math.floor(Math.random() * games.length)];
      const targetScore = Math.floor(Math.random() * 50) + 10;

      const newTask = await tx.task.create({
        data: { userId, gameId: randomGame.id, targetScore },
        include: { game: true },
      });

      await tx.user.update({
        where: { id: userId },
        data: { lastTaskAssigned: now },
      });

      return { task: newTask, timeRemaining: 3600, isNew: true };
    });

    return res.status(result.isNew ? 201 : 200).json(result);
  } catch (err) {
    console.error(err);
    if (err.message === "No games available") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Failed to get/create task" });
  }
}

async function completeTask(req, res) {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const { taskId } = req.body;

    // Validate taskId format
    if (!taskId || typeof taskId !== "string") {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    // Use transaction to prevent race condition (double completion)
    const result = await prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id: taskId } });

      if (!task) throw { status: 404, message: "Task not found" };
      if (task.userId !== decoded.id) throw { status: 403, message: "Not authorized" };
      if (task.completed) throw { status: 400, message: "Task already completed" };

      // Mark task completed
      await tx.task.update({
        where: { id: taskId },
        data: { completed: true, completedAt: new Date() },
      });

      // Add 10 points
      await tx.user.update({
        where: { id: decoded.id },
        data: { score: { increment: 10 } },
      });

      return { success: true, message: "Task completed! +10 points", bonusPoints: 10 };
    });

    return res.status(200).json(result);
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error(err);
    return res.status(500).json({ error: "Failed to complete task" });
  }
}

async function getTaskHistory(req, res) {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const tasks = await prisma.task.findMany({
      where: { userId: decoded.id },
      include: { game: true },
      orderBy: { assignedAt: "desc" },
      take: 20,
    });
    return res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to get task history" });
  }
}

export { getOrCreateTask, completeTask, getTaskHistory };