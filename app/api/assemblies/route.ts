import { NextRequest, NextResponse } from 'next/server';

// Mock data
let assemblies = [
  {
    id: 1,
    date: '2023-09-16',
    attendees: [
      { memberId: 1, present: true },
      { memberId: 2, present: false },
    ],
    agenda: ['Discuss budget', 'Plan next event'],
    previousMinutesApproved: true,
    finesPaid: [{ memberId: 1, amount: 50 }],
    sharesPurchased: [{ memberId: 2, amount: 100 }],
    loanPayments: [{ memberId: 1, amount: 200 }],
    newLoans: [{ memberId: 2, amount: 1000 }],
    decisions: ['Approved budget', 'Set date for next event'],
  },
];

export async function GET() {
  return NextResponse.json(assemblies);
}

export async function POST(request: NextRequest) {
  try {
    const newAssembly = await request.json();
    
    // Add an id to the new assembly
    const id = assemblies.length + 1;
    const assemblyWithId = { id, ...newAssembly };
    
    // Add the new assembly to our mock data
    assemblies.push(assemblyWithId);
    
    return NextResponse.json(assemblyWithId, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating assembly', error }, { status: 500 });
  }
}