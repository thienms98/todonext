import { NextResponse, NextRequest } from "next/server";
import {cookies} from 'next/headers'
import {prisma} from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST (request: NextResponse) {
  const data = await request.json();
  const {username, password} = data;

  const user = await prisma.users.findFirst({
    where: {username, password},
    select: {
      id: true,
      username: true,
      name: true,
      image: true
    }
  });
  console.log(user)
  if(!user) return NextResponse.json({
    status: 'failure',
    message: 'Username or password is not correct'});
  if(!process.env.SECRET_KEY_AC || !process.env.SECRET_KEY_RF ) return;

  const accessToken = jwt.sign({...user, password: '*****'}, process.env.SECRET_KEY_AC, {expiresIn: '24h'})
  const refreshToken = jwt.sign({...user, password: '*****'}, process.env.SECRET_KEY_RF)

  await prisma.users.update({where: {username}, data: {refreshToken}})

  cookies().set('Authorization', `Bearer ${accessToken}`)

  return NextResponse.json({
    status: 'success',
    data: {...user,
      password: '***************',
      accessToken,
      refreshToken}
  })
}