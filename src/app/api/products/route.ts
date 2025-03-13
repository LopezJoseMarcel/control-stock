import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
    await connectDB();
    
    const { name, sku, price, cost, quantity } = await req.json();

    // Verificar que no exista el SKU
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
        return NextResponse.json({ error: 'El producto con este código ya existe' }, { status: 400 });
    }

    const newProduct = new Product({ name, sku, price, cost, quantity });
    await newProduct.save();

    return NextResponse.json(newProduct, { status: 201 });
}

export async function GET() {
    await connectDB();

    const products = await Product.find();
    return NextResponse.json(products);
}



