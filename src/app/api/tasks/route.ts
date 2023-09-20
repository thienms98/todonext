import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import type { User, Task } from "@/utils/types";

export async function GET(request: NextRequest) {
  // const page_str = request.nextUrl.searchParams.get("page");
  // const limit_str = request.nextUrl.searchParams.get("limit");

  // const page = page_str ? parseInt(page_str, 10) : 1;
  // const limit = limit_str ? parseInt(limit_str, 10) : 10;
  // const skip = (page - 1) * limit;
  const tasks = await prisma.tasks.findMany({
    include: {
      assignees: {
        include: {
          users: true
        }
      }
    }
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
        state: 'success',
      })
    }
    catch(err){
      return NextResponse.json({
        state: 'failure',
        message: err 
      })
    }
  }
    catch(err){
      return NextResponse.json({
        state: 'failure',
        message: err 
      })
    }
  }