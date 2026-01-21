import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

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

export { register, login, logout };