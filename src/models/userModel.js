const { mongoose, conn } = require('../services/mongoose');
const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    mobileNumber: {
        type: String,
        default: null
    },
    countryCode: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    deviceType: {
        type: String,
        default: null
    },
    deviceToken: {
        type: String,
        default: null
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number],
        default: [0.00, 0.00]
    },
    latitude: {
        type:Number,
        default: 0.00
    },
    longitude: {
        type: Number,
        default: 0.00
    },
    access_token: {
        type: String
    },
    is_verified: {
        type: Number,
        default: 0
    },
    is_profile_created: {
        type: Number,
        default: 0
    },
    verification_code: {
        type: Number,
        default: null
    },
    created_on: {
        type: String,
        default: null
    },
    modified_on: {
        type: String,
        default: null
    },
    profile_image: {
        type: String
    }
},
    {
        strict: true,
        collection: 'user',
        versionKey: false
    })
userSchema.index({
    location: '2dsphere'
})
exports.UserModel = conn.model('user', userSchema);
