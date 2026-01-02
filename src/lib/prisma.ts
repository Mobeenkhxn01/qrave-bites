import Prisma from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const { PrismaClient } = Prisma;

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient>;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient().$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
