const express = require('express');
const router = express.Router();
const { z } = require('zod');
const jwt_key = require('../secret');
const User = require('../db').User;
const jwt = require('jsonwebtoken');

const signupInput = z.object({
    name: z.string(),
    email: z.string().email(),
    number: z.number()
});

const signInInput = z.object({
    name: z.string(),
    email: z.string().email(),
});

router.post('/signup', async (req, res) => {
   const name = req.body.name;
   const email = req.body.email;
   const number = req.body.number;

   const validation = signupInput.safeParse({name,email,number})
   if(!validation.success) {
    return res.status(400).json({
        message : "Inputs are not correct"
    })
   }
   try {
    const user = await User.create({
        name,email,number
    })
    const token = jwt.sign({userId : user._id},jwt_key)
    return res.status(201).json({
        message : "User Created Succesfully",
        user, 
        token
    })
   }
   catch(e) {
    return res.status(401).json({
        message : "Error while creating new account"
    })
   }
});


router.post('/signin',async (req,res)=>{  
   const name = req.body.name;
   const email = req.body.email;

   const validation = signInInput.safeParse({name,email})
   if(!validation.success) {
    return res.status(400).json({
        message : "Inputs are not correct"
    })
   }
   try {
    const user = await User.findOne({
        email
    })
    if(!user){
        res.status(401).json({
            message : "User not found"
        })
    }
    const token = jwt.sign({userId : user._id},jwt_key)
    return res.status(201).json({
        message : "Sign in succesfully",
        token
    })
   }
   catch(e) {
    return res.status(401).json({
        message : "Error while Signing In"
    })
   }
})

module.exports = router;