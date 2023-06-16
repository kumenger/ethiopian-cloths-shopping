const router = require('express').Router();

require('../google/passport')
const User = require('../models/User')
const Token = require('../models/Token')
const bcrypt = require("bcrypt");
const crypto = require('crypto')
const nodemailer = require("nodemailer");
const passport = require('passport');
require('dotenv').config()
router.get('/auth/google',(req,res)=>{
    passport.authenticate('google',{scope:['email','profile']})
})
router.get('/auth/google/callback',(req,res)=>{
    passport.authenticate('google',{
        successRedirect:'/auth/protected',
        failureRedirect:"/auth/google/failer"
    })
})
router.get('/auth/protected',(req,res)=>{
    res.send("hello there")
})
router.get('/auth/google/failer',(req,res)=>{
    res.send("failed to login")
})
router.get("/allusers",(req, res) => {
    User.find({})
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        err.status(400).json("Eror") + " " + err;
      });
  });
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
        let newToken = await Token.create({UserId: newUser._id, token: crypto.randomBytes(16).toString("hex")})
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {

                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASS
            }
        });
        var mailOptions = {
            from: process.env.GMAIL_USER,
            to: newUser.email,
            subject: "Habesha Cloths  Account Verification ",
            html: `Hello, ${
                newUser.firstName
            } Thanks for registering in Ethiopian CLoth Store<br></br> please verify account by following this <a href='http://localhost:3002/user/confirmation/${
                newToken.token
            } 
           ' ><strong>link</strong> </a> `

        };
        transporter.sendMail(mailOptions, function (err) {
            if (err) {
                return res.status(500).json({msg: err.message});
            }
            res.status(200).json({
                msg: "A verification email has been sent to " + newUser.email + " " + "you have 12 hours to complete activation if not you have to request reactivation again" + " please chek your email to activate your account."
            });
        });

    } catch (error) {
        return res.status(500).json(error)
    }

})
router.get('/confirmation/:token', async (req, res) => {
    const token = await Token.findOne({token: req.params.token})
    if (! token) {
        res.status(404).json({msg: "We were unable to find a valid activation. Your activation may have expired"})
    }
    const user = await User.findOne({_id: token.UserId})
    if (! user) {
        res.status(404).json({msg: "We were unable to find a user for this activation."})
    }
    if (user.isVerified) {
        return res.status(200).json({msg: "This user has already been verified."});
    }
    user.isVerified = true
    let verifiedUser = await user.save()

    if (! verifiedUser) {
        return res.status(400).json({type: "error", msg: err.message});
    }
    res.status(200).json({
            msg: ` Thank you ${
            user.firstName
        } The account has been verified. Please log in to continue.`
    })

})
router.post('/resetpassword', async (req, res) => {
    try {
        let user = await User.findOne({email: req.body.email})
        if (! user) {
            res.status(404).json({msg: "Email not found "})
        }
        user.resetPassword = crypto.randomBytes(16).toString('hex')
        let updateduser = await user.save()
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {

                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASS
            }
        });
        var mailOptions = {
            from: process.env.GMAIL_USER,
            to: updateduser.email,
            subject: "Habesha Cloths Reset password",
            html: `Hello, ${
                updateduser.firstName
            } Thanks for requesting reset password <br></br> please follow  this <a href='http://localhost:3002/user/resetpassword/${
                updateduser.resetPassword
            } '><strong>link</strong>   </a>  you have 10 minutes to changed password`

        };
        transporter.sendMail(mailOptions, function (err) {
            if (err) {
                return res.status(500).json({msg: err.message});
            }
            res.status(200).json({
                msg: "A reset pasword link has been sent to " + updateduser.email + " " + " please chek your email to reset password."
            });
        });
    } catch (error) {
        res.status(500).json({msg: error})
    }

})
router.post('/resetpassword/:resetToken', async (req, res) => {
    try {
        const user = await User.findOne({resetPassword: req.params.resetToken})
        if (! user) {
            res.status(404).json({msg: "user not found or activation link is expired"})
        }

        let newPasword = await bcrypt.hash(req.body.password, 10)
        user.password = newPasword
        let updateduser = await user.save()
        res.status(200).json({
                msg: `${
                updateduser.firstName
            } password is successfully Changed please login In!!`
        })
    } catch (error) {
        res.status(500).json({msg: error})
    }

})
router.delete('/deleteuser', async (req, res) => {
    try {
        let email = req.body.email

        let user = await User.findOneAndDelete({email: email})

        if (! user) {
            res.status(400).json({msg: "user not found"})
        }
        await Token.findOneAndDelete({UserId: user._id})
        res.json({
                msg: `${
                user.firstName
            }  is deleted form database`
        })
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})
router.post('/login', async (req, res) => {
    try {
        
        const user = await User.findOne({email:req.body.email})
        if (!user) {
            res.status(404).json({msg: "We cound not find any account with this email"})
        }

        const isPassWordMatch = await  bcrypt.compare(req.body.password,user.password)
          console.log(isPassWordMatch)
        if (!isPassWordMatch) {
            res.status(404).json({msg: `incorrect password`})
        }
        if (! user.isVerified) {
            res.status(400).json({msg: "this account is not verified "})
        }
        res.json({msg:`wellcome ${user.firstName} you are now logIN`  });
      req.session.save(()=>{
        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.logged_in = true;
      
        res.status(200).json({msg:`wellcome ${user.firstName} you are now logIN`  });
     })
    } catch (error) {
        res.status(500).json({msg : error})
    }


})
router.get("/logout", (req, res) => {
 
    if (req.session.logged_in) {
      req.session.destroy(() => {
      
        res.status(204).end()
      });
    } else {
      res.status(404).end();
    }
  });

module.exports = router
