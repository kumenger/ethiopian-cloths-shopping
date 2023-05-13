const {SChema, model, Schema} = require('mongoose')
const ClothSchema = new SChema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    ClothID: {
        type: Schema.Types.ObjectId,
        ref: "cloth"
    },
    
})
const Cloth=model('cloth',ClothSchema)
module.exports=Cloth