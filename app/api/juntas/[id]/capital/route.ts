import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { getToken } = getAuth(request);
  const token = await getToken({ template: 'test' });
  const response = await fetch(`https://unicas-backend.onrender.com0/api/capital/social/${params.id}/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const capitalSocial = await response.json(); // Get multas from the response
  return NextResponse.json(capitalSocial);
}