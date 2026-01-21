import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../generated/prisma/client.js'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"], 
})

const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("DB connected via Prisma");
    } catch(error) {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
}

const disConnectDB = async () => {
    await prisma.$connect();
}

export {prisma, connectDB, disConnectDB};