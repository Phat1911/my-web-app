import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import path from "path";
import sharp from "sharp";
import fs from "fs";

const register = async (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
        where: { email: email }
    });

    if (userExists) {
        return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
        },
    });

    return res.status(201).json({
        status: "Success!",
        data: {
            id: user.id,
            name: name,
            email: email,
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) return res.status(400).json({
        error: "Invalid email or password",
    });

    const isPasswordExists = await bcrypt.compare(password, user.password);

    if (!isPasswordExists) {
        return res.status(401).json({ message: "Invalid email or password" });
    } 

    const token = generateToken(user.id, res);

    return res.status(201).json({
        status: "Success!",
        data: {
            id: user.id,
            name: user.name,
            email: email,
        },
        token,
    });
};

const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    })

    return res.status(201).json({
        status: "Success!",
        message: "log out successfully!",
    });
};

const findUser = async (req, res) => {
    let token;
    
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
      }
    
      if (!token) {
        return res.status(401).json({ error: "Not authorized, no token provided" });
      }
    
      try {

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log(decoded.id);
    
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: { id: true, name: true, email: true, score: true },
        });
    
        if (!user) {
          return res.status(401).json({ error: "User no longer exists" });
        }
    
        return res.status(200).json(user);
      } catch (err) {
        return res.status(401).json({ error: "Not authorized, token failed" });
      }
}

async function updateProfile (req, res) {
    let token;
    const {name, email} = req.body;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
      }
    
      if (!token) {
        return res.status(401).json({ error: "Not authorized, no token provided" });
      }
    
      try {

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          console.log(decoded.id);
    
        const user = await prisma.user.update({
          where: { id: decoded.id },
          data: { name: name, email: email },
        });
    
        if (!user) {
          return res.status(401).json({ error: "User no longer exists" });
        }
    
        return res.status(200).json(user);
      } catch (err) {
        return res.status(401).json({ error: "Not authorized, token failed" });
      }
}

async function updateAVT(req, res) {
  const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const uploadDir = path.resolve("../front-end/public");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${decoded.id}.jpg`;
  const filePath = path.join(uploadDir, fileName);

  await sharp(req.file.buffer)
    .resize(256, 256)
    .jpeg({ quality: 80 })
    .toFile(filePath);

  const avatarUrl = `/uploads/avatars/${fileName}`;

  await prisma.user.update({
    where: { id: decoded.id },
    data: {
      previewURL: avatarUrl, 
    },
  });

  return res.status(200).json({
    message: "Update successfully",
    avatarUrl,
  });
}


export { register, login, logout, findUser, updateProfile, updateAVT };