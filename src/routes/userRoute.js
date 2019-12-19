var express = require('express');
var router = express();
var multer = require('multer');
var auth = require('../modules/auth');
var md5 = require('md5')
var path = require('path')
var userController = require('../controllers/userController');
exports.getRouter = (app) => {
	const storage = multer.diskStorage({
		destination : function(req,file,callback){
			callback(null,'./uploads/user');
		},
		filename : function(req,file,callback){
			let fileUniqueName = md5(Date.now());
			callback(null,fileUniqueName+ path.extname(file.originalname));
		}
	})
	let upload = multer({storage:storage});
	app.route('/user/userSignup').post(userController.userSignup)
	app.route('/user/userLogin').post(userController.userLogin)
	app.route('/addCategory').post(userController.addCategory)
	app.route('/user/getAllCategory').get(auth.userAccessToken,userController.getAllCategory)
	app.route('/addProduct').post(userController.addProduct)
	app.route('/user/getAllProduct').get(auth.userAccessToken,userController.getAllProduct)
	app.route('/user/getProductAccordingToCategory').post(auth.userAccessToken,userController.getProductAccordingToCategory)
	app.route('/user/addToCart').post(auth.userAccessToken,userController.addToCart)
	app.route('/user/getCartDataByUser').get(auth.userAccessToken,userController.getCartDataByUser)
	return app;
}