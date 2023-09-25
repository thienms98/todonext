import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if(req.headers.get('coookie')?.slice(6,)) return NextResponse.json({
    success: false,
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