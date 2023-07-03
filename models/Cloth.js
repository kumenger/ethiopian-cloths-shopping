const {Schema, model} = require('mongoose')
const mongoose = require('mongoose');
const clothSchema = new mongoose.Schema({
    pictureUrl: {
        type: String,
        trim: true
    },
    clothname:{
        type:String
    },
    price: {
        type: Number
    },
    availability: {
        type: Boolean,
        default:true
    }

},{ timestamps: true })

const Cloth=model('cloth',clothSchema)
module.exports=Cloth