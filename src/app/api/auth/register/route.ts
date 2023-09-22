import { NextResponse, NextRequest } from "next/server";
import {prisma} from '@/lib/prisma'

export async function POST (request: NextResponse) {
  const data = await request.json();
  const {username, name, password} = data;

  if(!name.trim() || !password.trim()) return

  const users = await prisma.users.findFirst({where: {username}})
  if(users) return
  await prisma.users.create({
    data
  })

  return NextResponse.json({
    status: 'success',
  })
}