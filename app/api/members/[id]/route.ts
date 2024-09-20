import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server'
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { getToken } = getAuth(request)
        const token = await getToken({ template: 'test' })
        const response = await fetch(`https://unicas-backend.onrender.com/api/junta-users/${params.id}/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
        const users = await response.json();
        return NextResponse.json(users)
    } catch (error) {
        console.error('Error handling GET request:', error);
        return NextResponse.json({ error: 'Failed to handle GET request' }, { status: 500 });
    }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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
        console.log(data)
        console.log(JSON.stringify(
            {
                junta_id: params.id,
                user_id: data.id
            }
        ))

        const newResponse = await fetch('https://unicas-backend.onrender.com/api/juntas/add', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    junta_id: params.id,
                    user_id: data.id
                }
            )
        })
        if (!newResponse.ok) {
            return NextResponse.json({"Error": "Not user added to junta"})
        }
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



