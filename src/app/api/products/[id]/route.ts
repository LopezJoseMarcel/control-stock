import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();

    const { name, sku, price, cost, quantity } = await req.json();
  
    const { id } = await params;
     
    const product = await Product.findById(id);
    if (!product) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    if (sku) product.sku = sku;
    if (name) product.name = name;
    if (price) product.price = price;
    if (cost) product.cost = cost;
    if (quantity !== undefined) product.quantity = quantity;

    await product.save();

    return NextResponse.json(product);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await connectDB();

    const { id } = await params;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Producto eliminado' });
}
