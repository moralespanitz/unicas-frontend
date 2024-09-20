import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { getToken } = getAuth(request);
  const token = await getToken({ template: 'test' });
  console.log('Params id', params.id)
  const response = await fetch(`${process.env.BACKEND_API_URL}/api/capital/social/junta/${params.id}/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  // const capitalSocial = await response.json(); // Get multas from the response
  // console.log('Capital social')
  // console.log(capitalSocial)
  // if (!response.ok) {
  //   throw new Error(`HTTP error! status: ${response.status}`);
  // }
  // ;
  // return NextResponse.json(capitalSocial);
  console.log('Capital social')
  // console.log(capitalSocial)
  return NextResponse.json({});
}