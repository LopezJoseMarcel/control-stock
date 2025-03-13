import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET!;
const protectedRoutes = ['/dashboard', '/api/products'];

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    
    console.log('Ruta solicitada:', req.nextUrl.pathname);
    console.log('Token recibido:', token);

    if (!token && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        if (!token) {
            throw new Error('Token is undefined');
        }
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Token válido:', decoded);
    } catch (error) {
        console.error('Error verificando token:', error);
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/api/products/:path*'],
};
