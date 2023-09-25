import { NextResponse, NextRequest } from "next/server";
import prisma from '@/lib/prisma'

export async function POST (request: NextRequest) {
  const data = await request.json();
  const {username, password} = data;

  const users = await prisma.users.findFirst({where: {username}})
  if(users) return NextResponse.json({
    success: false,
    message: 'This username already exists'
  })
  const newUser = await prisma.users.create({
    data
  })

  return NextResponse.json({
    success: true,
    data: newUser
  })
}