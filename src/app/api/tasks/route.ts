import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { User, Task } from "@/utils/types";

export async function GET(request: NextRequest) {
  const tasks = await prisma.tasks.findMany({
    include: {
      assignees: {
        include: {
          users: true
        }
      }
    },
    orderBy: {id: "asc"}
  });
  
  let json_response = {
    status: "success",
    results: tasks.length,
    tasks: {
      ...tasks,
    }
  };
  return NextResponse.json(json_response);
}


export async function POST(request: NextRequest) {
  const {assignees, ...data} = await request.json();

  try{
    const task = await prisma.tasks.create({
      data
    })
    try{
      await prisma.assignees.createMany({
        data: assignees.map((user:User) => ({
          userId: user.id,
          taskId: task.id
        }))
      })
      
      return NextResponse.json({
        status: 'success',
      })
    }
    catch(err){
      return NextResponse.json({
        status: 'failure',
        message: err 
      })
    }
  }
    catch(err){
      return NextResponse.json({
        status: 'failure',
        message: err 
      })
    }
  }