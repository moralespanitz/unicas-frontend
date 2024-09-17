// app/api/loan-payments/route.ts
import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

interface LoanPayment {
  id: number;
  request_date: string; // Updated field
  amount: string; // Updated field
  monthly_interest: string; // Updated field
  number_of_installments: number; // Updated field
  approved: boolean; // Updated field
  rejected: boolean; // Updated field
  rejection_reason: string; // Updated field
  paid: boolean; // Updated field
  remaining_amount: string; // Updated field
  remaining_installments: number; // Updated field
  member: number; // Updated field
  junta: number; // Updated field
}

let loanPayments: LoanPayment[] = [
  {
    id: 1,
    request_date: "2024-09-16", // Updated field
    amount: "100.00", // Updated field
    monthly_interest: "1.0000", // Updated field
    number_of_installments: 4, // Updated field
    approved: true, // Updated field
    rejected: false, // Updated field
    rejection_reason: "", // Updated field
    paid: false, // Updated field
    remaining_amount: "100.00", // Updated field
    remaining_installments: 4, // Updated field
    member: 5, // Updated field
    junta: 1 // Updated field
  }
];

export async function GET(request: NextRequest) {
  // Fetch loan payments from an external API instead of using the local array
  const { getToken } = getAuth(request)
  const token = await getToken({ template: 'test' })

  const response = await fetch('http://localhost:8000/api/prestamos/', {
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
    const response = await fetch('http://localhost:8000/api/prestamos/',
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

    const response = await fetch(`http://localhost:8000/api/prestamos/${id}/`, {
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
