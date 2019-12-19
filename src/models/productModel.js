const { mongoose, conn } = require('../services/mongoose');
const productSchema = mongoose.Schema({
    productName:{
        type:String,
        default:''
    },
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    productPrice:{
        type:String,
        default:''
    },
    productMakeYear:{
        type:Number,
        default:2019
    },
    productDescription:{
        type:String,
        default:''
    },
    productCreatedOn:{
        type:Number,
        default: Date.now
    }
},
    {
        strict: true,
        collection: 'product',
        versionKey: false
    })
exports.ProductModel = conn.model('product', productSchema);
