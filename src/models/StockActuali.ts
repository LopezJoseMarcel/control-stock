import mongoose, { Schema, models } from 'mongoose';

const stockUpdateSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    cost: { type: Number, required: true },
    date: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        default: ''
    },
    tipo: {
        type: String,
        enum: ['efectivo', 'transferencia'],
        required: true, 
      },
      name: {
        type: String,
       
        required: true, 
      },
});

const StockActuali = models.StockAjus || mongoose.model('StockAjus', stockUpdateSchema, "StockAjus");
export default StockActuali;
