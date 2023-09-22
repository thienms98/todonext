import { NextRequest, NextResponse } from 'next/server'
import {verify} from 'jsonwebtoken'

type User = {
  username: string,
  name: string,
  image: string,
}

export async function middleware(request: NextRequest) {
  console.log('middleware')
  const requestHeaders = new Headers(request.headers)
  const accessToken = request.headers.get('Authorization')?.split(' ')[1]
  // console.log(accessToken , process.env.SECRET_KEY)
  if(accessToken && process.env.SECRET_KEY_AC){
    const user = verify(accessToken, process.env.SECRET_KEY_AC)
    // console.log('user', user)
  }


  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/tasks'],
}