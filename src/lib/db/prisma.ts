import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Prisma v7 requires a driver adapter for PostgreSQL
function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    // During build time without a DB, return a stub that won't crash
    console.warn('DATABASE_URL is not set. Database operations will fail at runtime.')
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/signal',
  })

  const adapter = new PrismaPg(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
