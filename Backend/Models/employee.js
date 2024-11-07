const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    empNumber: { type: String, required: true, unique: true },
    empPassword: { type: String, required: true },
})

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;