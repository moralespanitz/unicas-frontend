import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { getToken } = getAuth(request)
  const token = await getToken({ template: 'test' })

  const response = await fetch('https://unicas-backend.onrender.com0/api/info', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  const data = await response.json()
 
  return NextResponse.json(data)
}