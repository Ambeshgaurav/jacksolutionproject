const router = require("express").Router();
const controller = require('../controller/userController')
const controllerMiddleware = require('../controller/middleware')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads' });



// const validate=require('./validation');





router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/createProduct',controllerMiddleware.aunthetication,multipartMiddleware,controller.createProductList);
router.post('/readProduct',controllerMiddleware.aunthetication,multipartMiddleware,controller.readProductList);
router.post('/updateProduct',controllerMiddleware.aunthetication,multipartMiddleware,controller.updateProductList);
router.post('/deleteProduct',controllerMiddleware.aunthetication,multipartMiddleware,controller.deleteProductList);






module.exports = router;