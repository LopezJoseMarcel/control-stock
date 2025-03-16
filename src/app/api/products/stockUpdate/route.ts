import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import StockActuali from '@/models/StockActuali';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
    await connectDB();

    const { sku, quantity, reason, cost, tipo } = await req.json();

    if (!sku || !quantity) {
        return NextResponse.json({ error: 'Producto y cantidad son obligatorios' }, { status: 400 });
    }

    const product = await Product.findOne({ sku });
    if (!product) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }


    const newStockActuali = new StockActuali({
        productId: product._id,
        quantity,
        note: reason || 'Actualización de inventario',
        date: new Date(),
        tipo,
        cost,
        name: product.name
    });

    await newStockActuali.save();

    product.quantity += quantity;
    product.cost = cost;
    await product.save();

    return NextResponse.json({ message: 'Stock actualizado correctamente' });
}

export async function GET() {
    await connectDB();

    const updates = await StockActuali.find().populate('productId');
    return NextResponse.json(updates);
}
