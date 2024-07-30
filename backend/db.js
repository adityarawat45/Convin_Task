const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/convin")

//Info about the Amount
const expenseAmountSchema = new mongoose.Schema({
    payer: {
        type: String,
        required: true 
    },
    amount: {
        type: Number,
        required: true 
    }
});

 //ExpenseSchema
const expenseSchema = new mongoose.Schema({
    createrId : String,
    title: {
        type: String,
        required: true 
    },
    expensePayers: {
        type: Number,
        required: true
    },
    expenseAmount : [
    expenseAmountSchema
    ]
});

//UserSchema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    number: {
        type: Number,
        unique: true,
        required: true 
    },
    email: {
        type: String,
        unique: true,
        required: true 
    },
    expenses:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
    }],
});


const Expense = mongoose.model('Expense', expenseSchema);
const User = mongoose.model('User', userSchema);

module.exports = { User, Expense };


