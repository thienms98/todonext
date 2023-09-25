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

  const requestHeaders = request.headers
  requestHeaders.set('Access-Control-Allow-Origin', '*')
  requestHeaders.set("Access-Control-Allow-Credentials", "true"),
  requestHeaders.set("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT"),
  requestHeaders.set("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version")

  return NextResponse.next({
    headers: requestHeaders
  })
  // return NextResponse.next()
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