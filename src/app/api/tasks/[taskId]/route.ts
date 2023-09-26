import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma'
import { verifyToken } from "@/utils/verifyToken";
import { cookies } from "next/headers";

export async function GET(request: NextRequest, {params}: {params: {taskId: string}}){
  const {taskId} = params

  if(taskId?.trim() && +taskId){
    let task = await prisma.tasks.findUnique({
      where: {id: +taskId},
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            image: true
          }
        },
        assignees: {
          include: {
            users: {
              select: {
                id: true,
                username: true,
                image: true
              }
            }
          }
        }
      }
    })
    if(task) return NextResponse.json({
      success: true,
      task: {
        id: task.id,
        title: task.title,
        createdDate: task.created_at,
        deadline: task.due_at,
        creator: task.creator,
        assignees: task.assignees,
        completed: task.isDone
      }
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
  const accessToken = request.headers.get('cookie')?.slice(6,)
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
  await prisma.tasks.update({data, where: {id: +taskId}})

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

export async function DELETE(request: NextRequest, {params}: {params: {taskId: string}}) {

  let {taskId} = params
  const id = parseInt(taskId)

  if(taskId){
    try{
      await prisma.assignees.deleteMany({where: {taskId: id}})
      await prisma.tasks.delete({where: {id}})
    }
    catch(err){
      return NextResponse.json({
        success: false,
        message: err
      })
    }
    return NextResponse.json({
      succes: true,
      message: `delete task ${taskId}`
    })

  }else return NextResponse.json({
    success: false,
    message: 'taskId must be a number'
  })
}