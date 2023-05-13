const {SChema, model} = require('mongoose')
const ClothSchema = new SChema({
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
        type: Boolean
    }

})
const Cloth=model('cloth',ClothSchema)
module.exports=Cloth