import { NextRequest, NextResponse } from "next/server";
import {verify} from 'jsonwebtoken'
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  console.log('get api tasks')
  // const searchParams:{limit: number, start: number} = req.nextUrl.searchParams 
  const accessToken = req.headers.get('token')?.split(' ')[1];
  console.log('accessToken', accessToken)
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
  console.log(username)
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
  
  const data = await req.json();
  
  const normalize_assignees
    = (data.assignees as {id: number}[])?.map((user) => ({userId: user.id}))

  const normalize_data = {
    ...data,
    creator: {connect: data.creator},
    assignees: {
      createMany: {
        data: normalize_assignees
      }
    }
  }
  
  console.log(normalize_data)
  try{
    const task = await prisma.tasks.create({data: normalize_data})
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