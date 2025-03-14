import { connectDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    await connectDB();
    return NextResponse.json({ message: 'Conexión exitosa con MongoDB' });
}
