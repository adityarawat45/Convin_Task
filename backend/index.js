const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user');
const expenseRouter = require('./routes/expense')

const app = express();
app.use(cors());
app.use(express.json());


//directs to UserRouter(Signup/SignIn)
app.use('/api/v1/users', userRouter);

//directs to expenseRouter(add Expense, retrieve overall expense and individual userExpense)
app.use('/api/v1/expenses', expenseRouter);

app.listen(3000);