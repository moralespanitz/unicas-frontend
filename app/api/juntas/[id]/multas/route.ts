// app/api/multas/route.js
import { NextRequest, NextResponse } from 'next/server';
// Import getAuth for authentication
import { getAuth } from '@clerk/nextjs/server';

interface Multa {
  id: number;
  reason: string; // Updated field
  amount: string; // Updated field
  status: string; // Updated field
}
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { getToken } = getAuth(request);
  const token = await getToken({ template: 'test' });

  const response = await fetch(`http://localhost:8000/api/multas/junta/${params.id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const multas = await response.json(); // Get multas from the response
  return NextResponse.json(multas);
}

export async function POST(request: NextRequest) {
  try {
    const { getToken } = getAuth(request);
    const token = await getToken({ template: 'test' });
    const data = await request.json();
    const response = await fetch('http://localhost:8000/api/multas/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error posting multa:', error);
    return NextResponse.json({ error: 'Failed to post multa' }, { status: 500 });
  }
}