import { NextRequest, NextResponse } from 'next/server'

type User = {
  username: string,
  name: string,
  image: string,
}

export async function middleware(request: NextRequest) {
  console.log('middleware ', `[${request.method}]`, request.nextUrl.pathname)
  
  const token = request.headers.get('cookie')?.slice(6,)

  if(!token || !process.env.SECRET_KEY_AC) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const res = NextResponse.next()
  res.headers.append('Access-Control-Allow-Credentials', "true")
  res.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
  res.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  res.headers.append(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  return res
}

export const config = {
  matcher: [
    '/', 
    '/tasks', 
    '/tasks/:taskId*', 
    '/api/tasks',
    '/api/users',
    '/api/tasks/:taskId*',
    '/api/auth/refresh',
  ],
}