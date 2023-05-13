const {Schema, model} = require('mongoose')
const addresSchema=new Schema({
    addresId:{
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    State: {
        require:true,
        type: String
    },
    adress: {
        require:true,
        type: String
    },
    zipcode: {
        type: Number,
        require:true
    },
})
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
            ref: Schema.Types.ObjectId,
            ref: "cart"
        }
    ],
    isVerified:{
        type:Boolean,
        default:false
    }
})
const User = model('user', addresSchema);
module.exports = User
