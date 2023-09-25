import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const {taskId, userId} = await req.json();
  
  await prisma.assignees.create({
    data: {
      userId,
      taskId
    }
  })

  return NextResponse.json({
    success: true
  })
}

export async function DELETE(req: NextRequest) {
  const {taskId, userId} = await req.json();

  await prisma.assignees.deleteMany({
    where: {
      userId,
      taskId
    }
  })

  return NextResponse.json({
    success: true
  })
}