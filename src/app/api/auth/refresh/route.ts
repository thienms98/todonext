import { NextResponse, NextRequest } from "next/server";
import prisma from '@/lib/prisma'
import { verify, sign } from 'jsonwebtoken'

export async function POST (request: NextRequest) {
  console.log('refresh')
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  const {refreshToken} = await request.json()
  
  if(!accessToken || !process.env.SECRET_KEY_AC) return NextResponse.json({status: 'failure'})
  let username
  try{
    const data = verify(accessToken, process.env.SECRET_KEY_AC) as {username: string}
    username = data.username
  } 
  catch(err) {
    return NextResponse.json({status: 'failure', message: err})
  }

  const user = await prisma.users.findUnique({where: {username}, select: {username: true, name: true, image: true, refreshToken: true}});
  if(!user) return NextResponse.json({status: 'failure'})

  if(!user.refreshToken || user.refreshToken !== refreshToken || !process.env.SECRET_KEY_RF) return NextResponse.json({status: 'failure'});
  const newAccessToken = sign(user, process.env.SECRET_KEY_AC, {expiresIn: '24h'})

  return NextResponse.json({
    status: 'success',
    data: {
      ...user,
      accessToken: newAccessToken,
    }
  })
}