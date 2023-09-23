import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import type { User, Task } from "@/utils/types";
import { revalidatePath } from "next/cache";
import {verify} from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  
  // const searchParams:{limit: number, start: number} = req.nextUrl.searchParams 
  const accessToken = req.headers.get('authorization')?.split(' ')[1];
  if(!accessToken) return NextResponse.json({
    success: false,
    status: 401,
    message: 'Unauthorization'
  })
  if(!process.env.SECRET_KEY_AC) return NextResponse.json({
      success: false,
      message: 'env err'
    })
  const {username} = verify(accessToken, process.env.SECRET_KEY_AC)  as {username: string}
  const tasks = await prisma.tasks.findMany({
    where: {
      OR: [
        {
          creator: {
            username: username
          },
        },
        {
          assignees: {
            some: {
              users: {
                username: username
              }
            }
          }
        }
      ]
    },
    include: {
      assignees: {
        include: {
          users: true
        }
      },
      creator: true
    },
    orderBy: {id: "asc"}
  });
  
  let json_response = {
    sucess: true,
    results: tasks.length,
    tasks: {
      ...tasks,
    }
  };
    return NextResponse.json(json_response)
}


export async function POST(req: NextRequest) {
  
  const accessToken = req.headers.get('authorization')
  if(!accessToken) return NextResponse.json({
    success: false,
    status: 401,
    message: 'Unauthorization'
  })
  
  const data:Prisma.tasksCreateInput = await req.json();
  console.log(data)

  try{
    const task = await prisma.tasks.create({data})
    console.log('create task ---- ok');
    return NextResponse.json({
      success: true,
      task,
    })

  }
    catch(err){
  console.log('create task ---- ko ok');
  return NextResponse.json({
        success: false,
        message: err 
      })
    }
  }