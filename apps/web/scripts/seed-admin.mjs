import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

try {
  const email = process.env.ADMIN_EMAIL || "admin@taskmate.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", name: "Admin" },
    create: { name: "Admin", email, password: hash, role: "ADMIN" },
  });

  console.log(`Admin ready: ${email}`);
} finally {
  await prisma.$disconnect();
}
