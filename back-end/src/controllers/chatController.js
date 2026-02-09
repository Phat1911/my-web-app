import { prisma } from "../config/db.js";
import jwt from "jsonwebtoken";

async function sendMessage(req, res) {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const { receiverId, content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }
    if (content.length > 2000) {
      return res.status(400).json({ error: "Message too long (max 2000)" });
    }
    if (!receiverId) {
      return res.status(400).json({ error: "Receiver required" });
    }

    // Validate receiver exists
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    const sender = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { following: true },
    });

    if (!sender.following.includes(receiverId)) {
      return res.status(403).json({ error: "You can only message users you follow" });
    }

    const message = await prisma.message.create({
      data: { senderId: decoded.id, receiverId, content: content.trim() },
      include: {
        sender: { select: { id: true, name: true, previewURL: true } },
        receiver: { select: { id: true, name: true, previewURL: true } },
      },
    });

    return res.status(201).json(message);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send message" });
  }
}

async function getConversation(req, res) {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const { partnerId } = req.params;

    // Check user follows partner (IDOR fix)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { following: true },
    });
    if (!user.following.includes(partnerId)) {
      return res.status(403).json({ error: "You can only view conversations with users you follow" });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: decoded.id, receiverId: partnerId },
          { senderId: partnerId, receiverId: decoded.id },
        ],
      },
      include: { sender: { select: { id: true, name: true, previewURL: true } } },
      orderBy: { createdAt: "asc" },
      take: 100,
    });

    await prisma.message.updateMany({
      where: { senderId: partnerId, receiverId: decoded.id, read: false },
      data: { read: true },
    });

    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to get conversation" });
  }
}

async function getConversationList(req, res) {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { following: true },
    });

    if (!user.following || user.following.length === 0) {
      return res.status(200).json([]);
    }

    const followingUsers = await prisma.user.findMany({
      where: { id: { in: user.following } },
      select: { id: true, name: true, previewURL: true },
    });

    const conversationsWithUnread = await Promise.all(
      followingUsers.map(async (followedUser) => {
        const [unreadCount, lastMessage] = await Promise.all([
          prisma.message.count({
            where: { senderId: followedUser.id, receiverId: decoded.id, read: false },
          }),
          prisma.message.findFirst({
            where: {
              OR: [
                { senderId: decoded.id, receiverId: followedUser.id },
                { senderId: followedUser.id, receiverId: decoded.id },
              ],
            },
            orderBy: { createdAt: "desc" },
          }),
        ]);
        return { user: followedUser, unreadCount, lastMessage };
      })
    );

    return res.status(200).json(conversationsWithUnread);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to get conversations" });
  }
}

async function followUser(req, res) {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({ error: "Target user required" });
    }
    if (decoded.id === targetUserId) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }

    // Validate target exists
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { following: true },
    });

    if (currentUser.following.includes(targetUserId)) {
      await prisma.user.update({
        where: { id: decoded.id },
        data: { following: currentUser.following.filter((id) => id !== targetUserId) },
      });
      return res.status(200).json({ followed: false, message: "Unfollowed" });
    } else {
      await prisma.user.update({
        where: { id: decoded.id },
        data: { following: [...currentUser.following, targetUserId] },
      });
      return res.status(200).json({ followed: true, message: "Now following" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to follow/unfollow" });
  }
}

async function getFollowingList(req, res) {
  try {
    const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { following: true },
    });

    if (!user.following || user.following.length === 0) {
      return res.status(200).json([]);
    }

    const followingUsers = await prisma.user.findMany({
      where: { id: { in: user.following } },
      select: { id: true, name: true, previewURL: true, score: true },
    });

    return res.status(200).json(followingUsers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to get following list" });
  }
}

export { sendMessage, getConversation, getConversationList, followUser, getFollowingList };