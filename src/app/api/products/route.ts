import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
    await connectDB();
    
    const { name,laboratorio, sku, price, cost, quantity } = await req.json();

    // Verificar que no exista el SKU
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
        return NextResponse.json({ error: 'El producto con este código ya existe' }, { status: 400 });
    }

    const newProduct = new Product({ name, sku, price, cost, quantity,laboratorio});
    await newProduct.save();

    return NextResponse.json(newProduct, { status: 201 });
}

export async function GET(req: NextRequest) {
    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const searchTerm = searchParams.get('search') || '';

    const query = searchTerm
        ? { name: { $regex: searchTerm, $options: 'i' } } // Búsqueda insensible a mayúsculas/minúsculas
        : {};

    const products = await Product.find(query);
    return NextResponse.json(products);
}



