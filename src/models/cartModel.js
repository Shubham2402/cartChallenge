const { mongoose, conn } = require('../services/mongoose');
const cartSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    createdOn: {
        type: Number,
        default: Date.now()
    },
    quantity:{
        type:Number,
        default:0
    }
},
    {
        strict: true,
        collection: 'cart',
        versionKey: false
    })
exports.CartModel = conn.model('cart', cartSchema);
