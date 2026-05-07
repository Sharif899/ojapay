// src/app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name:          z.string().min(2).max(50).optional(),
  username:      z.string().min(3).max(20).regex(/^[a-z0-9_]+$/).optional(),
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  // Check username uniqueness
  if (parsed.data.username) {
    const existing = await prisma.user.findFirst({
      where: { username: parsed.data.username, NOT: { id: session.user.id } },
    })
    if (existing) return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data:  parsed.data,
    select: { id: true, name: true, email: true, username: true, walletAddress: true },
  })

  return NextResponse.json(user)
}
