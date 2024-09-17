import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { getToken } = getAuth(request);
    const token = await getToken({ template: 'test' });
    const response = await fetch(`http://localhost:8000/api/capital/ingreso/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: params.id })
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const capitalSocial = await response.json(); // Get multas from the response
    return NextResponse.json(capitalSocial);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    // try {
        const { getToken } = getAuth(request);
        const token = await getToken({ template: 'test' });
        const body = await request.json(); 
        const response = await fetch(`http://localhost:8000/api/capital/ingreso/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                type : body.type,
                amount: body.amount,
                capital_social: body.capital_social
            })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const capitalSocial = await response.json(); // Get multas from the response
        return NextResponse.json(body);
    // } catch (error) {
    //     return NextResponse.json({ error: 'Failed to add capital' }, { status: 500 });
    // }

}