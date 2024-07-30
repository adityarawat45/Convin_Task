const express = require('express');
const router = express.Router();
const { z } = require('zod');
const jwt_key = require('../secret');
const Expense = require('../db').Expense;
const User = require('../db').User;
const jwt = require('jsonwebtoken');
const { SiThingiverse } = require('react-icons/si');


const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify the token
        const decoded = jwt.verify(token, jwt_key);
        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    } catch (e) {
        return res.status(500).json({
            message: "Internal Error"
        });
    }
};


router.use(auth)

const expenseInput = z.object({
    title: z.string(),
    expensePayers: z.number(),
    expenseAmount: z.array(z.object({
      payer: z.string(),
      amount: z.number(),
    })),
  });
  

  //There should be one route to add expenses to avoid complications.
  //The different mehtods to add expenses like exact, equal or percentage
  //is a frontend thing and should be done from the frontend side where the user
  // can select in what way he wants to add his expense.
  //and then the final expenses should be send to add route.
  router.post('/add', async (req, res) => {
    try {
      const { title, expensePayers, expenseAmount } = req.body;
  
      const validation = expenseInput.safeParse({ title, expensePayers, expenseAmount});
      if (!validation.success) {
        return res.status(400).json({ message: 'Invalid input' });
      }

      const newExpense = new Expense({
        title,
        expensePayers,
        expenseAmount,
        createrId: req.user._id,
      });
  
     
      await newExpense.save();
  
      req.user.expenses.push(newExpense._id);
      await req.user.save();
  
      res.status(201).json({
        message: 'Expense added successfully',
        expense: newExpense,
      });
    } catch (e) {
      res.status(500).json({ message: 'Error adding expense' });
    }
  });
  
router.get('/bulk', auth, async (req, res) => {
  try {
    // Populate the expenses field with the actual expense documents
    const userWithExpenses = await User.findById(req.user._id).populate('expenses');

    if (!userWithExpenses) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ expenses: userWithExpenses.expenses });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
});
module.exports = router;