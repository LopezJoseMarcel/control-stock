import mongoose, { Schema, model, models } from 'mongoose';

const saleSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    tipo: {
        type: String,
        enum: ['efectivo', 'transferencia'],
        required: true, 
      },
    salePrice: { type: Number, required: true },
    cost: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    name: { type: String, required: true},

});

const Sale = models.SalesProducts || model('SalesProducts', saleSchema, 'SalesProducts');
export default Sale;
