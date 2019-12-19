const { mongoose, conn } = require('../services/mongoose');
const categorySchema = mongoose.Schema({
    categoryName:{
        type:String,
        default:''
    },
    categoryType:{
        type:String,
        default:''
    },
    categoryModel:{
        type:Number,
        default:2019
    },
    categoryCreatedOn:{
        type:Number,
        default: Date.now
    }
},
    {
        strict: true,
        collection: 'category',
        versionKey: false
    })
exports.CategoryModel = conn.model('category', categorySchema);
