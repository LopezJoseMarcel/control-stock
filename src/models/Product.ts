import { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    quantity: { type: Number, required: true },
}, { timestamps: true });

export default models.Product || model('Product', productSchema, 'Product');
