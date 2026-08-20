import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { auth } from '@/lib/auth/auth'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const body = await req.json()
    const result = changePasswordSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input data', details: result.error.format() }, { status: 400 })
    }

    const { currentPassword, newPassword } = result.data

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found or no password set' }, { status: 404 })
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 403 })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      })

      await tx.auditLog.create({
        data: {
          userId: userId,
          action: 'UPDATE_PASSWORD',
          resource: 'USER',
          resourceId: userId,
          metadata: { note: 'User changed their password' },
        },
      })
    })

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
