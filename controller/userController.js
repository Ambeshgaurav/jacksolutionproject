const promise = require("bluebird");
const bcrypt = require("bcryptjs")
const serviceMongoDb = require('../services/userDetailsServices');
const jwt1 = require('../auth/token')
const constUserId = require('./constant')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads' });
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)


function register(req, res) {
  promise.coroutine(function* () {
    var hash_password = yield bcrypt.hash(req.body.password, 10)
    let user_data = {
      name: req.body.name,
      email: req.body.email,
      password: hash_password
    }
    let resultMongo = yield serviceMongoDb.SaveUserDetails(user_data)
    if (resultMongo == 0) {
      console.log("Email_id already exits");
      return res.json({
        message: "Email id already exits",
        status: 400,
        data: req.body.email
      })
    }
    let token_data =
    {
      id: user_data.email,
      key: "key1"
    }
    const token_result = yield jwt1.generateToken(token_data);
    let data =
    {
      access_token: token_result,
      email: user_data.email
    }
    const Save_Token = yield serviceMongoDb.saveToken(data);
    res.json({
      message: "Register successfull",
      status: 200,
      access_token: token_result
    })
  })().catch((err) => {
    console.log(err)
    res.json({
      message: "Error occurred",
      status: 404,
      data: err
    })
  });
}
function login(req, res) {

  promise.coroutine(function* () {
    let logindata =
    {
      email: req.body.email,
      password: req.body.password
    }
    let user = yield serviceMongoDb.findData(logindata);
    if (!user.length) {
      return res.send("user doesn't exits")
    }
    var data1 = yield bcrypt.compare(logindata.password, user[0].password);
    if (data1 == true) {
      let token =
      {
        id: logindata.email,
        key: "key1"
      }
      const token_result = yield jwt1.generateToken(token)
      let data =
      {
        access_token: token_result,
        email: logindata.email
      }
      const Save_Token = yield serviceMongoDb.saveToken(data);
      console.log(Save_Token);
      console.log("login successful");
      res.json({
        message: "login successfull",
        status: 200,
        access_token: token_result
      })
    }

    else if (data1 == false) {
      console.log("incorrect password");
      res.json({
        message: "Incorrect password",
        status: 400,
        data: null
      })
    }
  })().catch((err) => {
    console.log(err);
    res.send(err);

  });
}
function createProductList(req, res) {
  promise.coroutine(function* () {
    var headers = req.headers;
    let token_data = {
      access_token: headers.access_token
    }
    var body = req.body;
    var fetch_data = yield serviceMongoDb.findToken(token_data)
    var file = req.files.file
    let insert_data = {
      user_id: fetch_data[0]._id,
      access_token: fetch_data[0].access_token
    }
    let user_data = {
      imageFilePath: file.path,
      price: body.price,
      category: body.category,
      product_id: body.product_id
    }
    var temp_array = []
    temp_array.push(user_data)
    insert_data.data = temp_array
    var data = yield serviceMongoDb.saveUserProductList(insert_data)
    console.log("===============data=======", data);
    res.json({
      message: "Create product list successfully",
      status: 200,
      access_token: token_data.access_token
    })
  })().catch((err) => {
    console.log(err);
    res.send(err);

  })
}
function readProductList(req, res) {
  promise.coroutine(function* () {
    var headers = req.headers;
    let token_data = {
      access_token: headers.access_token
    }
    var fetch_data = yield serviceMongoDb.findProductData(token_data)
    console.log("====fetchdata==============", fetch_data);
    res.json({
      message: "Read product list successfully",
      status: 200,
      data: fetch_data
    })

  })().catch((err) => {
    console.log(err);
    res.send(err);

  })

}
function updateProductList(req, res) {
  promise.coroutine(function* () {
    var headers = req.headers;
    let token_data = {
      access_token: headers.access_token
    }
    var body = req.body;
    var update_data = {};
    if (!body.product_id) {
      return res.json({
        message: "parameter missing",
        status: 404,
        data: body
      })
    }
    update_data.product_id = body.product_id;
    if (body.category) {
      update_data.category = body.category;
    }
    if (body.price) {
      update_data.price = body.price;
    }
    update_data.access_token = token_data.access_token
    var fetch_data = yield serviceMongoDb.updateProductData(update_data)
    res.json({
      message: "Product updated",
      status: 200,
      data: body
    })


  })().catch((err) => {
    console.log(err);
    res.send(err);

  })
}
function deleteProductList(req, res) {
  promise.coroutine(function* () {
    var headers = req.headers;
    let token_data = {
      access_token: headers.access_token
    }
    var body = req.body;
    if (!body.product_id) {
      return res.json({
        message: "parameter missing",
        status: 404,
        data: body
      })
    }
    token_data.product_id = body.product_id
    var find_data = yield serviceMongoDb.findProductSpecificData(token_data)
    var link_image = find_data[0].data[0].imageFilePath
    var deleted_data = yield serviceMongoDb.deleteProductData(token_data)
    var delete_image = yield unlinkAsync(link_image)
    res.json({
      message: "Deleted Items successfully",
      status: 200,
      data: token_data
    })
  })().catch((err) => {
    console.log(err);
    res.send(err);
  })
}
module.exports = {
  register: register,
  login: login,
  createProductList: createProductList,
  readProductList: readProductList,
  updateProductList: updateProductList,
  deleteProductList: deleteProductList
}
