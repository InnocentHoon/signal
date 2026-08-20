import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    // ─── Google OAuth ───────────────────────────────────────────────────
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // links Google to existing email account
    }),

    // ─── Email + Password ────────────────────────────────────────────────
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)
          
          const user = await prisma.user.findUnique({ where: { email } })
          
          if (!user || !user.password) return null
          
          const isValidPassword = await bcrypt.compare(password, user.password)
          if (!isValidPassword) return null

          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'LOGIN',
              resource: 'USER',
              resourceId: user.id,
              metadata: { method: 'credentials' },
            },
          })
          
          return user
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      // Log Google sign-in
      if (account?.provider === 'google' && user?.id) {
        try {
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'LOGIN',
              resource: 'USER',
              resourceId: user.id,
              metadata: { method: 'google' },
            },
          })
          // Auto-create UserSettings if first Google sign-in
          await prisma.userSettings.upsert({
            where: { userId: user.id },
            update: {},
            create: {
              userId: user.id,
              emailNotifications: true,
              weeklyReport: true,
              theme: 'dark',
              simpleMode: true,
            },
          })
        } catch {
          // Non-fatal
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
})
