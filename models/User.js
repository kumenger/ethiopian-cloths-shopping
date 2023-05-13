const {Schema, model} = require('mongoose')
const mongoose =require('mongoose')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: props => `${
                props.value
            } is not a valid email  format!`
        }

    },
    password:{
        type:String,
        require:true
    },
    firstName: {
        type: String,
        require: true,
        trim: true
    },

    lastName: {
        type: String,
        require: true,
        trim: true
    },
   address:{
    type:Schema.Types.ObjectId,
    ref:"adress"
   }
,
    orderHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'order'
        },
    ],
    Carts: [
        {
            type: Schema.Types.ObjectId,
            ref: "cart"
        }
    ],
    isVerified:{
        type:Boolean,
        default:false
    }
})
const User = model('user', userSchema);
module.exports = User
