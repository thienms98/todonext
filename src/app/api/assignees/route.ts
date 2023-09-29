import prisma from "@/lib/prisma";
import { verifyToken } from "@/utils/verifyToken";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  if(req.headers.get('coookie')?.slice(6,)) return NextResponse.json({
    success: false,
    message: 'Unauthorization'
  })

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
  const token = req.headers.get('cookie')?.slice(6,)
  if(!token) return NextResponse.json({
    success: false,
    message: 'Unauthorization'
  })
  const data:any = verifyToken(token)
  if(!data) return NextResponse.json({
    success: false,
    message: 'Unauthorization'
  })
  
  const {taskId, userId}: {taskId:number, userId:number} = await req.json();
  const selfId:number = data.id;

  try{
     // nguoi bi xoa chinh la minh => xoa
    if(userId === selfId)
      await prisma.assignees.delete(
        {
          where: {
            userId_taskId: {
              userId,
              taskId
            },
          }
        }
      )
    // nguoi bi xoa khong phai la minh => | minh la nguoi tao => xoa
    //                                    | khong phai nguoi tao => khong xoa
    else
      await prisma.assignees.delete(
        {
          where: {
            userId_taskId: {
              userId,
              taskId
            },
            tasks: {
              creatorid: selfId
            }
          }
        }
      )
    return NextResponse.json({
      success: true
    })
  }
  catch(err){
    return NextResponse.json({
      success: false,
      message: JSON.stringify(err)
    })
  }
}