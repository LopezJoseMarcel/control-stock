import  { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

export default models.User || model('User', userSchema,"User");
