const router = require('express').Router();
const User=require('../models/User')
const bcrypt = require("bcrypt");
router.post('/signup',async(req,res)=>{
    try {
        let {password}=req.body
        const user=await User.findOne({email:req.body.email})
        if(user){
            res.status(404).json({msg:"This email is taken"})
        }
        let hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
        console.log(req.body);
        let newUser = await User.create(req.body);
        res.status(200).json(newUser)
    } catch (error) {
        res.status(500).json(error)
    }

})
module.exports=router