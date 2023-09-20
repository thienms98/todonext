import { NextRequest, NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'

export async function PUT(request: NextRequest){
  const searchParams = request.nextUrl.searchParams
  const taskId = searchParams.get('task_id')
  if(!taskId) return;

  const data = await request.json()

  const result = await prisma.tasks.update({
    where: {
      id: +taskId
    },
    data
  })

  return NextResponse.json({
    status: 'success',
  })
}