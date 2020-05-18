const express=require("express");
const app=express();
const clientroutes=require('./routes/clientroutes');
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// const joi=require('joi');
 
  
app.use("/client",clientroutes);

app.listen(1507);

console.log("server is running at port number 1507");



