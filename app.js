//jshint esversion:6

// always put dotenv package at the top 
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 12;
const app = express();


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
});
app.get("/login",function(req,res){
    res.render("login.ejs");
});
app.get("/register",function(req,res){
    res.render("register.ejs");
});




app.post("/register",function(req,res){
   
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      
   
   const  newUser= new User({
    email:req.body.username,
    password:hash

   });


newUser.save().then(function(){
    console.log("inserted");
    res.render("secrets.ejs");
}).catch(function(err){
 console.log(err);
})


});

});

// console.log(md5("99"))

app.post("/login",function(req,res){
  const  loginEmail = req.body.username;
  const loginPassword = req.body.password;

User.findOne({email:loginEmail}).then(function(founditem){
    // console.log(founditem);

    bcrypt.compare(loginPassword, founditem.password, function(err, result) {
        // result == true
        if(result===true){
            res.render("secrets.ejs");
        }
        else{
            console.log("Wrong password ");
        }
    });
   
}).catch(function(err){
    console.log(err);
});

});


app.listen(3000,()=>
{
    console.log("Server Started on port 3000");
})