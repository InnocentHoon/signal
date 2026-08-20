import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'

const deleteAccountSchema = z.object({
  password: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const body = await req.json()
    const result = deleteAccountSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input data', details: result.error.format() }, { status: 400 })
    }

    const { password } = result.data

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found or no password set' }, { status: 404 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 403 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.auditLog.create({
        data: {
          userId: userId,
          action: 'DELETE_ACCOUNT',
          resource: 'USER',
          resourceId: userId,
          metadata: { note: 'User initiated account deletion' },
        },
      })

      await tx.user.delete({
        where: { id: userId },
      })
    })

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
