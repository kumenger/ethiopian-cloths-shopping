const {SChema, model, Schema} = require('mongoose')
const CartSchema = new SChema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    ClothID: {
        type: Schema.Types.ObjectId,
        ref: "cloth"
    },
    
},{ timestamps: true })
const Cart=model('cart',CartSchema)
module.exports=Cart