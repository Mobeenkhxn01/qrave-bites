
import { PrismaClient } from '@prisma/client'


const prisma =  new PrismaClient()

if (process.env.NODE_ENV !== 'production'){}

export default prisma