import { NextRequest, NextResponse } from "next/server";
import {verify} from 'jsonwebtoken'
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const DEFAULT_LIMIT = 12,
      DEFAULT_PAGE = 1;

export async function GET(req: NextRequest) {
  const {limit = DEFAULT_LIMIT, page = DEFAULT_PAGE, q, sortBy = 'id', sort = 'asc', isDone} = 
  JSON.parse('{"' + decodeURI(req.nextUrl.searchParams.toString()).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
  const take =  limit < 0 || limit > 20 ? DEFAULT_LIMIT : +limit
  let skip = (+page - 1) * take
  skip = skip < 0 ? 0 : skip

  console.log({take, skip})
  revalidatePath('/tasks', "page")
  const token = req.headers.get('cookie')?.slice(6,);
  if(!token) return NextResponse.json({
    success: false,
    status: 401,
    message: 'Unauthorization'
  })
  if(!process.env.SECRET_KEY_AC) return NextResponse.json({
      success: false,
      message: 'env err'
    })
  const {username} = verify(token, process.env.SECRET_KEY_AC)  as {username: string}

  const where:Prisma.tasksWhereInput = {
    title: {
      contains: q
    },
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
  }
  if(isDone) where.isDone = isDone === 1 ? true : false

  const [total, tasks] = await prisma.$transaction([
    prisma.tasks.count({ 
      where
    }),
    prisma.tasks.findMany({
      where,
      include: {
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
        },
        creator: {
          select: {
            id: true,
            username: true,
            image: true
          }
        }
      },
      skip,
      take,
      orderBy: {
        [sortBy]: sort
      }
    })
  ])
  
  let json_response = {
    success: true,
    pagination: {
      pageNumber: page,
      pageSize: limit,
      totalCount: total
    },
    tasks: {
      ...tasks,
    }
  };
  return NextResponse.json(json_response)
}


export async function POST(req: NextRequest) {
  
  const accessToken = req.headers.get('cookie')?.slice(6,)
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