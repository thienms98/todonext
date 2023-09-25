import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get('authorization')?.split(' ')[1];
  if(!accessToken) return NextResponse.json({
    success: false,
    status: 401,
    message: 'Unauthorization'
  })

  const users = await prisma.users.findMany({
    select: {
      id: true,
      username: true,
      image: true
    }, orderBy: {id: 'asc'}});

  const json_response = {
    success: true,
    results: users.length,
    users
  }

  return NextResponse.json(json_response)
}