const mongoose = require('mongoose')
const schema = require('mongoose').Schema

const NewTokenSchema = new schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
     
        ref: "user"
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
})
module.exports = mongoose.model('token', NewTokenSchema)
