import { getAuth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const { getToken } = getAuth(request)
        const token = await getToken({ template: 'test' })
        const data = await request.json();
        const response = await fetch(`https://unicas-backend.onrender.com/api/junta-users/${data.id}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        const users = await response.json();
        return NextResponse.json(users)

    } catch (error) {
        console.error('Error fetching members:', error);
        return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { getToken } = getAuth(request)
        const token = await getToken({ template: 'test' })
        const requestBody = await request.json()
        const parserBody = JSON.stringify(
            {
                "is_superuser": requestBody.is_superuser,
                "document_type": requestBody.document_type,
                "full_name": requestBody.full_name,
                "document_number": requestBody.document_number,
                "birth_date": requestBody.birth_date,
                "province": requestBody.province,
                "district": requestBody.district,
                "address": requestBody.address,
                "username": requestBody.document_number
            }
        )
        console.log('Parser body', parserBody)
        const response = await fetch('https://unicas-backend.onrender.com/api/users/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: parserBody
        })
        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

}

export async function DELETE(request: NextRequest) {
    const { getToken } = getAuth(request)
    const token = await getToken({ template: 'test' })
    const requestBody = await request.json()
    console.log(requestBody)
    if (requestBody.id) {
        const response = await fetch(`https://unicas-backend.onrender.com/api/users/${requestBody.id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to delete user' }, { status: response.status });
        }
        return NextResponse.json("deleted")
    }
}


