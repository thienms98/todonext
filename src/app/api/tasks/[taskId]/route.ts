import { NextRequest, NextResponse } from "next/server";
import {prisma} from '@/lib/prisma'

export async function GET(request: NextRequest){
  const taskId = request.nextUrl.pathname.split('/').at(-1);

  if(taskId?.trim() && +taskId){
    let task = await prisma.tasks.findUnique({where: {id: +taskId}})
    if(task) return NextResponse.json({
      status: 'success',
      task
    })
    else return NextResponse.json({
      status: 'failure',
      message: `task with taskId ${taskId} doesn't exist`
    })
  }
  else return NextResponse.json({
    status: 'failure',
    message: 'taskId must be a number'
  })
}

export async function PUT(request: NextRequest) {
  const taskId = request.nextUrl.pathname.split('/').at(-1);
  const data = await request.json();

  if(taskId?.trim() && +taskId){
    if(!data.title.trim()) return NextResponse.json({
      status: 'failure',
      message: `task title can not be empty`
    })
    try{
      await prisma.tasks.update({data, where: {id: +taskId}})
    }
    catch(err){
      return NextResponse.json({
        status: 'failure',
        message: err
      })
    }
    return NextResponse.json({
      status: 'success',
      message: `update task ${taskId}`
    })

  }else return NextResponse.json({
    status: 'failure',
    message: 'taskId must be a number'
  })
}

export async function DELETE(request: NextRequest) {
  const taskId = request.nextUrl.pathname.split('/').at(-1);

  if(taskId?.trim() && +taskId){
    try{
      await prisma.tasks.delete({where: {id: +taskId}})
    }
    catch(err){
      return NextResponse.json({
        status: 'failure',
        message: err
      })
    }
    return NextResponse.json({
      status: 'success',
      message: `delete task ${taskId}`
    })

  }else return NextResponse.json({
    status: 'failure',
    message: 'taskId must be a number'
  })
}