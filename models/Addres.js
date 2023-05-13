const {Schema, model} = require('mongoose')
const addresSchema = new Schema({

    State: {
        require: true,
        type: String
    },
    adress: {
        require: true,
        type: String
    },
    zipcode: {
        type: Number,
        require: true
    }
})
const Adress = model('adress', addresSchema)
module.exports = Adress
