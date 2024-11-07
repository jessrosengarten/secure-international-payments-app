const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const paymentSchema = new Schema({
    //paymentId: {type: String, required:true, unique:true},
    accountNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, enum: ['USD', 'EUR', 'ZAR', 'GBP'] },
    provider: { type: String, required: true, enum: ['SWIFT', 'PayPal'] },
    providerCode: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
