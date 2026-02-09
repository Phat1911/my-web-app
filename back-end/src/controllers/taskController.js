import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";

async function getOrCreateTask(req, res) {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastTaskAssigned: true },
    });

    const now = new Date();
    const oneHour = 60 * 60 * 1000;

    const pendingTask = await prisma.task.findFirst({
      where: {
        userId: userId,
        completed: false,
      },
      include: {
        game: true,
      },
      orderBy: { assignedAt: "desc" },
    });

    if (pendingTask) {
      const timeSinceAssigned = now - new Date(pendingTask.assignedAt);
      const timeRemaining = Math.max(0, oneHour - timeSinceAssigned);
      
      return res.status(200).json({
        task: pendingTask,
        timeRemaining: Math.floor(timeRemaining / 1000),
        isNew: false,
      });
    }

    if (user.lastTaskAssigned) {
      const timeSinceLast = now - new Date(user.lastTaskAssigned);
      if (timeSinceLast < oneHour) {
        return res.status(200).json({
          task: null,
          timeRemaining: Math.floor((oneHour - timeSinceLast) / 1000),
          message: "No pending task. Next task in " + Math.floor((oneHour - timeSinceLast) / 1000 / 60) + " minutes",
        });
      }
    }

    const games = await prisma.game.findMany();
    if (games.length === 0) {
      return res.status(400).json({ error: "No games available" });
    }

    const randomGame = games[Math.floor(Math.random() * games.length)];
    const targetScore = Math.floor(Math.random() * 50) + 10;

    const newTask = await prisma.task.create({
      data: {
        userId: userId,
        gameId: randomGame.id,
        targetScore: targetScore,
      },
      include: {
        game: true,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { lastTaskAssigned: now },
    });

    return res.status(201).json({
      task: newTask,
      timeRemaining: 3600,
      isNew: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to get/create task" });
  }
}

async function completeTask(req, res) {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const { taskId, achievedScore } = req.body;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.userId !== decoded.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (task.completed) {
      return res.status(400).json({ error: "Task already completed" });
    }

    if (achievedScore >= task.targetScore) {
      await prisma.task.update({
        where: { id: taskId },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });

      await prisma.user.update({
        where: { id: decoded.id },
        data: {
          score: { increment: 10 },
        },
      });

      return res.status(200).json({
        success: true,
        message: "Task completed! +10 points added",
        bonusPoints: 10,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Score ${achievedScore} is less than target ${task.targetScore}. Keep trying!`,
      });
    }
  } catch (err) {
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
