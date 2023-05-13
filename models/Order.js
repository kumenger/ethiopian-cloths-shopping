const {Schema, model} = require('moongoose')
const orderSchema = new Schema({
    orderDate: {
        type: Date,
        default: Date.now,
        get: formatter
    },
    Price: {
        require: true,
        type: Number

    },
    deliveryData: {
        type: Date,

        get: formatter
    },
    shippingAddres: {
        type:Schema.Types.ObjectId,
        ref:"adress"
    },
    Quntity: {
        type: Number
    },
    Size: {
        type: Number
    }

}, {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
})
function formatter(time) {
    let newTime = new Date(`${time}`)
    return newTime.toString()
}

const Order = model('order', orderSchema)
module.exports = Order
