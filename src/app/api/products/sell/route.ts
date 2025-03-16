import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Sale from '@/models/Sale';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
    await connectDB();

    const { sku, quantity,tipo } = await req.json();

    if (!sku || !quantity) {
        return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const product = await Product.findOne({ sku });
    if (!product) {
        return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
    }

    if (product.quantity < quantity) {
        return NextResponse.json({ error: 'Stock insuficiente para la venta' }, { status: 400 });
    }

    const newSale = new Sale({
        productId: product._id,
        quantity: quantity,
        salePrice: product.price,
        date: new Date(),
        cost: product.cost,
        tipo,
        name: product.name
    });

    await newSale.save();

    // Actualizar el stock del producto
    product.quantity -= quantity;
    await product.save();

    return NextResponse.json({ message: 'Venta registrada correctamente' });
}

export async function GET() {
    await connectDB();

    const sales = await Sale.find().populate('productId');
    return NextResponse.json(sales);
}
