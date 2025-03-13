import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export async function PATCH(req: NextRequest) {
    await connectDB();
    
    const { sku, quantitySold } = await req.json();
    
    // Buscar el producto por SKU
    const product = await Product.findOne({ sku });
    if (!product) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    // Verificar si hay suficiente stock
    if (product.quantity < quantitySold) {
        return NextResponse.json({ error: 'Stock insuficiente' }, { status: 400 });
    }

    // Reducir la cantidad en el inventario
    product.quantity -= quantitySold;
    await product.save();

    return NextResponse.json(product);
}
