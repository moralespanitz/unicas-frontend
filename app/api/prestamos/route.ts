// app/api/loan-payments/route.ts
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Fetch loan payments from an external API instead of using the local array
  const { getToken } = getAuth(request)
  const token = await getToken({ template: 'test' })

  const response = await fetch('https://unicas-backend.onrender.com/api/prestamos/', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const loanPayments = await response.json(); // Get loan payments from the response
  return NextResponse.json(loanPayments);
}

export async function POST(request: NextRequest) {
  try {
    const { getToken } = getAuth(request)
    const token = await getToken({ template: 'test' })
    const data = await request.json();
    const response = await fetch('https://unicas-backend.onrender.com/api/prestamos/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      }
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error posting loan payment:', error);
    return NextResponse.json({ error: 'Failed to post loan payment' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { getToken } = getAuth(request)
    const token = await getToken({ template: 'test' })
    const { id } = await request.json(); // Expecting an ID in the request body

    const response = await fetch(`https://unicas-backend.onrender.com/api/prestamos/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return NextResponse.json({ message: 'Loan payment deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting loan payment:', error);
    return NextResponse.json({ error: 'Failed to delete loan payment' }, { status: 500 });
  }
}
