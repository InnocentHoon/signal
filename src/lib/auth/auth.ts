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

  session: {
    strategy: 'jwt',
  },

  trustHost: true,

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      name: 'credentials',

      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: {
              email: email.trim().toLowerCase(),
            },
          })

          if (!user || !user.password) {
            return null
          }

          const isValidPassword = await bcrypt.compare(
            password,
            user.password
          )

          if (!isValidPassword) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('[AUTH] Credentials error:', error)
          return null
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string

        if (token.email) {
          session.user.email = token.email as string
        }

        if (token.name) {
          session.user.name = token.name as string
        }

        if (token.picture) {
          session.user.image = token.picture as string
        }
      }

      return session
    },

    async signIn({ user, account }) {
      console.log(
        '[AUTH] Sign-in:',
        account?.provider,
        user?.email
      )

      return true
    },
  },

  debug: true,
})