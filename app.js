//jshint esversion:6

// always put dotenv package at the top 
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");

const app = express();
const md5 =  require("md5")

 app.set("view engine",ejs);
 app.use(express.static("public"));

 app.use(bodyParser.urlencoded({extended:true}));

 mongoose.connect("mongodb://0.0.0.0:27017/userDB",{useNewUrlParser:true});

//  making schema of database 
const userSchema= new  mongoose.Schema({
    email:String,
    password:String  
});

// making secret string 
// console.log(process.env.SECRET);
 
// always do this step before making model 
// userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields:["password"] });


// making model/Table/collection 
const User = new mongoose.model("User",userSchema);




  

//  making get routes
app.get("/",function(req,res){
    res.render("home.ejs");
})
app.get("/login",function(req,res){
    res.render("login.ejs");
})
app.get("/register",function(req,res){
    res.render("register.ejs");
})


app.post("/register",function(req,res){
    // const newUser=req.body.username; 
    // const newPassword=req.body.password; 
   const  newUser= new User({
    email:req.body.username,
    password:md5(req.body.password)

   });

// save krne se hi encryption hoga and find method use krne se decryption hoga 
newUser.save().then(function(){
    console.log("inserted");
    res.render("secrets.ejs");
}).catch(function(err){
 console.log(err);
})




});

// console.log(md5("99"))

app.post("/login",function(req,res){
// User.find({}).then(function(founditems){
//     console.log(founditems);
    
// founditems.forEach(function(i){
//     if(i.email===req.body.username && i.password === req.body.password){
//         res.render("secrets.ejs");
//     }
// })


// }).catch(function(err){
//     console.log(err);
// })

User.findOne({email:req.body.username}).then(function(founditem){
    // console.log(founditem);
    if(founditem.password === md5(req.body.password)){
        res.render("secrets.ejs");
    }
    else{
        console.log("Your Password is wrong");
    }
}).catch(function(err){
    console.log(err);
})

})


app.listen(3000,()=>
{
    console.log("Server Started on port 3000");
})