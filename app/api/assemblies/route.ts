import { NextRequest, NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({});
}

export async function POST(request: NextRequest) {
  try {
    // const newAssembly = await request.json();
    
    // // Add an id to the new assembly
    // const id = assemblies.length + 1;
    // const assemblyWithId = { id, ...newAssembly };
    
    // // Add the new assembly to our mock data
    // assemblies.push(assemblyWithId);
    
    // return NextResponse.json(assemblyWithId, { status: 201 });
    const data = await request.json() 
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating assembly', error }, { status: 500 });
  }
}