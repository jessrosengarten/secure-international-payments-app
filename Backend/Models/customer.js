const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const customerSchema = new Schema({
    fullName: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    idNumber: { type: String, required: true, unique: true },
    accountNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;