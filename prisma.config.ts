import { defineConfig } from "prisma/config";

// Prisma v7 config — connection URL is passed to PrismaClient at runtime.
// For migrations: set DATABASE_URL env var and run `npx prisma db push`.
export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
});
