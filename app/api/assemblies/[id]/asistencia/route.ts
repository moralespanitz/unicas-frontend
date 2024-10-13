import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
}
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
}