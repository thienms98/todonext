import { NextResponse, NextRequest } from "next/server";
import {prisma} from '@/lib/prisma'

export async function GET () {
  return NextResponse.json({})
}