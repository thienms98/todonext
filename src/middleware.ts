import { NextRequest, NextResponse } from 'next/server'

type User = {
  username: string,
  name: string,
  image: string,
}

export async function middleware(request: NextRequest) {
  console.log('middleware ', request.nextUrl.pathname)
  const accessToken = request.cookies.get('Authorization')?.value.split(' ')[1] || request.headers.get('Authorization');
  if(!accessToken || !process.env.SECRET_KEY_AC) return NextResponse.redirect(new URL('/login', request.url))

  const requestHeaders = request.headers
  requestHeaders.set('Authorization', accessToken)
  return NextResponse.next({
    headers: requestHeaders
  })
  // return NextResponse.next()
}

export const config = {
  matcher: [
  '/', 
  '/tasks', 
  '/api/tasks',
  '/api/users',
  '/api/tasks/:taskId*',
  '/api/auth/',
  '/api/auth/refresh',
  '/api/auth/logout',
],
}