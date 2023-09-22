import { NextRequest, NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'
import { verifyToken } from "@/utils/verifyToken";

export async function GET(request: NextRequest){
  const taskId = request.nextUrl.pathname.split('/').at(-1);

  if(taskId?.trim() && +taskId){
    let task = await prisma.tasks.findUnique({where: {id: +taskId}})
    if(task) return NextResponse.json({
      status: 'success',
      task
    })
    else return NextResponse.json({
      success: false,
      message: `task with taskId ${taskId} doesn't exist`
    })
  }
  else return NextResponse.json({
    success: false,
    message: 'taskId must be a number'
  })
}

export async function PUT(request: NextRequest) {
  const accessToken = request.headers.get('Authorization')
  console.log('update task     ', accessToken)
  if(!accessToken || !verifyToken(accessToken)) return NextResponse.json({
    success: false,
    message: 'Unauthorization'
  })
  const taskId = parseInt(request.nextUrl.pathname.split('/').at(-1) || '');
  const data = await request.json();

  if(!taskId) return NextResponse.json({
    success: false,
    message: 'taskId must be a number'
  })
  if(data.title && !data.title.trim()) return NextResponse.json({
    success: false,
    message: `task title can not be empty`
  })
  try{
    await prisma.tasks.update({data, where: {id: +taskId}})
    
    return NextResponse.json({
      success: true,
      message: `update task ${taskId}`
    })
  }
  catch(err){
    return NextResponse.json({
      success: false,
      message: err
    })
  }
}

export async function DELETE(request: NextRequest) {

  const taskId = request.nextUrl.pathname.split('/').at(-1);

  if(taskId?.trim() && +taskId){
    try{
      await prisma.tasks.delete({where: {id: +taskId}})
    }
    catch(err){
      return NextResponse.json({
        success: false,
        message: err
      })
    }
    return NextResponse.json({
      status: 'success',
      message: `delete task ${taskId}`
    })

  }else return NextResponse.json({
    success: false,
    message: 'taskId must be a number'
  })
}