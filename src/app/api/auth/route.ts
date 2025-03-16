import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

const SECRET_KEY = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    await connectDB();

    const { username, password } = await req.json();
    const user = await User.findOne({ username });

    if (!user) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '5d' });

    const response = NextResponse.json({ message: 'Login exitoso' });

    response.cookies.set('token', token, {
        httpOnly: true,        // 🔒 Seguridad ante XSS
        secure: process.env.NODE_ENV === 'production', // 🔒 Requiere HTTPS en producción
        sameSite: 'strict',    // 🔒 Evita envíos no autorizados
        path: '/',             // 🌍 Accesible en todas las rutas
        maxAge: 5 * 24 * 60 * 60,       // 🕒 Expira en 1 hora
    });

    return response;
}
