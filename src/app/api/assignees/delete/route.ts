import { NextRequest, NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const {taskId, userId} = await req.json();

  await prisma.assignees.deleteMany({
    where: {
      userId,
      taskId
    }
  })

  return NextResponse.json({
    status: 'success'
  })
}