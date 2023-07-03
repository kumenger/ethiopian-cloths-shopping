const express = require('express')
const bodyParser = require("body-parser");
const passport = require('passport')
require('./config/googlepassport')(passport)
const db =require('./config/connection')
const path = require("path");
const cookieParser=require('cookie-parser')
const session=require('express-session')
const MongoStore =require('connect-mongo')(session)
const userRouter=require('./routes/userRoutes')
const clothRoutes=require('./routes/clothRoutes')
const PORT = process.env.PORT || 3002
//const cros = require("cors");
require('dotenv').config()

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

app.use(
    session({
      secret: 'your-secret-key',
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
      },
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: db }),
      ttl: 14 * 24 * 60 * 60,
    
     
     
    })
  );
  
app.get('/',(req,res)=>{
    res.json({msg:"hello ethiopian clothing"})
})
app.get('/auth/google',(req,res)=>{
  passport.authenticate('google',{scope:['email','profile']})
 
})
app.get('/auth/google/callback',(req,res)=>{
  passport.authenticate('google',{
      successRedirect:'/auth/protected',
      failureRedirect:"/auth/google/failer"
  })
})
app.get('/auth/protected',(req,res)=>{
  res.send("hello there")
})
app.get('/auth/google/failer',(req,res)=>{
  res.send("failed to login")
})

app.use('/user',userRouter)
app.use('/cloth',clothRoutes)
app.use(passport.initialize())
db.once('open',()=>{
    console.log('connected to database')
    app.listen(PORT,()=>{
        console.log(`server running on port ${PORT}`)
    })

})
   

