const {
    UserModel
} = require('../models/userModel');
const {
    CategoryModel
} = require('../models/categoryModel');
const {
    ProductModel
} = require('../models/productModel');
const {
    CartModel
} = require('../models/cartModel');
const Joi = require('joi');
const md5 = require('md5');
const async = require('async');
const responses = require('../modules/responses');
const status = require('../modules/status');
const commFunc = require('../modules/commonFunction');
const _ = require('lodash')


exports.userSignup = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            fullName: Joi.string().required(),
            email: Joi.string().email({
                minDomainAtoms: 2
            }).required(),
            mobileNumber: Joi.string().required(),
            deviceType: Joi.string().required(),
            deviceToken: Joi.string().required(),
            countryCode: Joi.string().required(),
            password: Joi.string().required(),
            latitude: Joi.string().required(),
            longitude: Joi.string().required(),
        })
        const result = Joi.validate(req.body, schema, {
            abortEarly: true
        });
        if (result.error) {
            if (result.error.details && result.error.details[0].message) {
                res.status(status.BAD_REQUEST).json({
                    message: result.error.details[0].message
                });
            } else {
                res.status(status.BAD_REQUEST).json({
                    message: result.error.message
                });
            }
            return;
        }
        var {
            fullName,
            email,
            mobileNumber,
            deviceType,
            deviceToken,
            countryCode,
            password,
            latitude,
            longitude
        } = req.body
        let userData = await UserModel.findOne({
            $and: [{
                "countryCode": countryCode
            }, {
                "mobileNumber": mobileNumber
            }]
        })
        if (userData) {
            res.status(status.ALREADY_EXIST).json({ message: 'Your mobile number is already registered with us.' });
        } else {
            let location = {
                type: 'Point',
                coordinates: [req.body.longitude, req.body.latitude]
            };
            var access_token = md5(new Date());
            var verification_code = commFunc.generateRandomString();
            var created_on = new Date().getTime();
            var modified_on = new Date().getTime();
            password = md5(password);
            var updateData = {
                fullName,
                email,
                mobileNumber,
                deviceType,
                deviceToken,
                countryCode,
                password,
                latitude,
                longitude,
                location,
                access_token,
                verification_code,
                created_on,
                modified_on
            }
            let userDetails = await UserModel.create(updateData)
            if (!userDetails) {
                throw new Error('Something went wrong.')
            }
            else {
                delete updateData.password;
                res.status(200).json({ message: "Signup successfully.", response: userDetails })
            }
        }
    }
    catch (error) {
        responses.sendError(error.message, res)
    }
}


exports.userLogin = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            password: Joi.string().required(),
            countryCode: Joi.string().required(),
            mobileNumber: Joi.string().required(),
            deviceToken: Joi.string(),
            deviceType: Joi.string(),
            latitude: Joi.string(),
            longitude: Joi.string()
        })
        const result = Joi.validate(req.body, schema, {
            abortEarly: true
        });
        if (result.error) {
            if (result.error.details && result.error.details[0].message) {
                res.status(status.BAD_REQUEST).json({
                    message: result.error.details[0].message
                });
            } else {
                res.status(status.BAD_REQUEST).json({
                    message: result.error.message
                });
            }
            return;
        }
        var {
            password,
            countryCode,
            mobileNumber,
            deviceType,
            deviceToken,
            longitude,
            latitude
        } = req.body;
        var userData = await UserModel.findOne({
            $and: [{
                'countryCode': countryCode
            }, {
                'mobileNumber': mobileNumber
            }]
        })
        if (userData) {
            if (userData.get('password') == md5(password)) {
                var access_token = md5(new Date());
                let location = { type: 'Point', "coordinates": [longitude, latitude] }
                var updateData = {
                    deviceToken,
                    deviceType,
                    access_token,
                    longitude,
                    latitude,
                    location
                };
                var loginData = await UserModel.findByIdAndUpdate(userData.get('_id'), {
                    $set: updateData
                }, {
                    new: true
                }).lean('true')
                if (!loginData) {
                    throw new Error('Data not found.')
                } else {
                    delete loginData['password']
                    res.status(200).json({
                        message: "Login successfully.",
                        response: loginData
                    })
                }
            } else {
                res.status(status.INVALID_CREDENTIAL).json({
                    message: "Password is incorrect."
                });
            }
        } else {
            res.status(status.INVALID_CREDENTIAL).json({
                message: 'This mobile number is not registered with us.'
            });
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}


exports.addCategory = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            categoryName: Joi.string().required(),
            categoryType: Joi.string().required(),
            categoryModel: Joi.number().required()
        })
        const result = Joi.validate(req.body, schema, {
            abortEarly: true
        });
        if (result.error) {
            if (result.error.details && result.error.details[0].message) {
                res.status(status.BAD_REQUEST).json({
                    message: result.error.details[0].message
                });
            } else {
                res.status(status.BAD_REQUEST).json({
                    message: result.error.message
                });
            }
            return;
        }
        let data = req.body
        let categoryData = await CategoryModel.create(data)
        if (!categoryData)
            throw new Error("Unable to add category.")
        res.status(200).json({
            message: "Catgory added successfully.",
            response: categoryData
        })
    } catch (error) {
        responses.sendError(error.message, res)
    }
}

exports.getAllCategory = async (req, res) => {
    try {
        //if you want to show all data of categories then commented code will work
        //let categoryData = await CategoryModel.find({})
        let categoryData = await CategoryModel.find({}).select('categoryName')
        if (categoryData.length) {
            res.status(200).json({
                message: "Categories are.",
                response: categoryData
            })
        } else {
            res.status(INVALID_CREDENTIAL).json({
                message: "No category found."
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}


exports.addProduct = async (req, res) => {
    try {
        const schema = Joi.object().keys({
            productName: Joi.string().required(),
            categoryId: Joi.string().required(),
            productPrice: Joi.number().required(),
            productMakeYear: Joi.number().required(),
            productDescription: Joi.string().required(),
        })
        const result = Joi.validate(req.body, schema, {
            abortEarly: true
        });
        if (result.error) {
            if (result.error.details && result.error.details[0].message) {
                res.status(status.BAD_REQUEST).json({
                    message: result.error.details[0].message
                });
            } else {
                res.status(status.BAD_REQUEST).json({
                    message: result.error.message
                });
            }
            return;
        }
        let data = req.body
        let productData = await ProductModel.create(data)
        if (!productData)
            throw new Error("Unable to add product.")
        res.status(200).json({
            message: "Product added successfully.",
            response: productData
        })
    } catch (error) {
        responses.sendError(error.message, res)
    }
}


exports.getAllProduct = async (req, res) => {
    try {
        //if you want to show all data of categories then commented code will work
        //let categoryData = await CategoryModel.find({})
        let productData = await ProductModel.aggregate([
            {
                $lookup: {
                    from: "category",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "categoryData"
                }
            }
        ])
        if (productData.length) {
            res.status(200).json({
                message: "Products are.",
                response: productData
            })
        } else {
            res.status(INVALID_CREDENTIAL).json({
                message: "No category found."
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}

exports.getProductAccordingToCategory = async (req, res) => {
    try {
        let { categoryId } = req.body
        let productDataOfCategory = await ProductModel.find({
            categoryId: categoryId
        })
        if (productDataOfCategory.length <= 0) {
            throw new Error("No data found")
        } else {
            res.status(200).json({
                message: "Product data according to categroy are.",
                response: productDataOfCategory
            })
        }
    } catch (error) {
        responses.sendError(error.message, res)

    }
}

exports.addToCart = async (req, res) => {
    try {
        let { userId, productId, quantity } = req.body
        let dataToBeAdded = req.body
        let addedData
        let cartData = await CartModel.findOne({
            userId: req.body.userId,
            productId: req.body.productId
        })
        if (cartData) {
            let dataRemoved = await CartModel.remove({
                userId: req.body.userId,
                productId: req.body.productId
            })
            addedData = await CartModel.create(dataToBeAdded)
            if (!addedData) {
                throw new Error("Unable to add cart data.")
            } else {
                res.status(200).json({
                    message: "Added to cart.",
                    response: addedData
                })
            }
        } else {
            addedData = await CartModel.create(dataToBeAdded)
            if (!addedData) {
                throw new Error("Unable to add cart data.")
            } else {
                res.status(200).json({
                    message: "Added to cart.",
                    response: addedData
                })
            }
        }
    } catch (error) {
        responses.sendError(error.message, res)
    }
}