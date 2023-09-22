import {prisma} from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await prisma.users.findMany({
    select: {
      name: true,
      image: true
    }, orderBy: {id: 'asc'}});

  const json_response = {
    status: "success",
    results: users.length,
    users
  }

  return NextResponse.json(json_response)
}