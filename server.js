const express = require('express')
const bodyParser = require("body-parser");
const db =require('./config/connection')
require('dotenv').config()
const path = require("path");
const cookieParser=require('cookie-parser')
const session=require('express-session')
const MongoStore =require('connect-mongo')(session)
const PORT = process.env.PORT || 3002
//const cros = require("cors");

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: db }),
      ttl: 14 * 24 * 60 * 60,
      autoRemove: 'native' 
     
     
    })
  );
  
app.get('/',(req,res)=>{
    res.json({msg:"hello ethiopian clothing"})
})

db.once('open',()=>{
    console.log('connected to database')
    app.listen(PORT,()=>{
        console.log(`server running on port ${PORT}`)
    })

})
   

