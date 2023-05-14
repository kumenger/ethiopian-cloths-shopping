const router = require('express').Router();
const User = require('../models/User')
const Token = require('../models/Token')
const bcrypt = require("bcrypt");
const crypto = require('crypto')
const nodemailer = require("nodemailer");
require('dotenv').config()
router.post('/signup', async (req, res) => {
    try {
        let {password} = req.body
        const user = await User.findOne({email: req.body.email})
        if (user) {
            res.status(404).json({msg: "This email is taken"})
        }
        let hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;

        let newUser = await User.create(req.body);
         let newToken=  await Token.create({UserId:newUser._id, token: crypto.randomBytes(16).toString("hex")})
         var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
        
              user: process.env.GMAIL_USER,
              pass:process.env.GMAIL_APP_PASS
            },
          });
            var mailOptions = {
              from: process.env.GMAIL_USER,
              to: newUser.email,
              subject: "Habesha Cloths  Account Verification ",
              html: `Hello, ${newUser.firstName} Thanks for registering in Ethiopian CLoth Store<br></br> please verify account by following this <a href='http://localhost:3002/user/confirmation/${newToken.token} 
           ' ><strong>link</strong> </a> `,
             
            };
            transporter.sendMail(mailOptions, function (err) {
              if (err) {
                return res.status(500).json({ msg: err.message });
              }
              res.status(200).json({
                msg:
                  "A verification email has been sent to " +
                  newUser.email +
                  " " +
                  "you have 12 hours to complete activation if not you have to request reactivation again" +
                  " please chek your email to activate your account.",
              });
            });
    
    } catch (error) {
       return res.status(500).json(error)
    }

})
router.get('/confirmation/:token',async(req,res)=>{
const token= await Token.findOne({token:req.params.token})
if(!token){
    res.status(404).json({msg:"We were unable to find a valid activation. Your activation may have expired"})
}
const user=await User.findOne({_id:token.UserId})
if(!user){
     res.status(404).json({msg: "We were unable to find a user for this activation."}) 
}
if (user.isVerified) {
    return res.status(200).json({
     msg: "This user has already been verified.",
    });
  }
  user.isVerified=true
  let verifiedUser=await user.save()

    if(!verifiedUser){
        return res.status(400).json({ type: "error", msg: err.message }); 
    }
    res.status(200).json({msg:` Thank you ${user.firstName} The account has been verified. Please log in to continue.`})
  
})

router.delete('/deleteuser', async (req, res) => {
    try {
        let email = req.body.email

  let user = await User.findOneAndDelete({email: email})

        if (! user) {
            res.status(400).json({msg: "user not found"})
        }
await Token.findOneAndDelete({
            UserId:user._id})
        res.json({msg: `${
                user.firstName
            }  is deleted form database`})
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})
module.exports = router
