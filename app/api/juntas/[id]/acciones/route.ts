// app/api/acciones/route.ts
import { NextRequest, NextResponse } from 'next/server';
// Import getAuth for authentication
import { getAuth } from '@clerk/nextjs/server';

interface AccionPurchase {
  id: number;
  member: string;
  date: string;
  quantity: number;
  value: number;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { getToken } = getAuth(request);
  const token = await getToken({ template: 'test' });

  const response = await fetch(`http://localhost:8000/api/acciones/junta/${params.id}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const acciones = await response.json(); // Get acciones from the response
  return NextResponse.json(acciones);
}

export async function POST(request: NextRequest) {
  try {
    const { getToken } = getAuth(request);
    const token = await getToken({ template: 'test' });
    const data = await request.json();
    const jsonBody = {
      "member": data.member,
      "date": data.date,
      "quantity": data.quantity,
      "value": data.value,
      "junta": data.junta
    }
    const response = await fetch('http://localhost:8000/api/acciones/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(
        jsonBody
      ),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return NextResponse.json(jsonBody, { status: 201 });
  } catch (error) {
    console.error('Error posting accion:', error);
    return NextResponse.json({ error: 'Failed to post accion' }, { status: 500 });
  }
}