//jshint esversion:6

// always put dotenv package at the top 
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();



 app.set("view engine",ejs);
 app.use(express.static("public"));

 app.use(bodyParser.urlencoded({extended:true}));


 app.use(session({
   secret:"Because he knows he is the best.",
   resave:false,
   saveUninitialized:false,

 }));

 app.use(passport.initialize());
 app.use(passport.session());

 mongoose.connect("mongodb://0.0.0.0:27017/userDB",{useNewUrlParser:true});

//  making schema of database 
const userSchema= new  mongoose.Schema({
    email:String,
    password:String  
});



// is line se m hashing aur salting implement kr raha hu 
userSchema.plugin(passportLocalMongoose)


// making model/Table/collection 
const User = new mongoose.model("User",userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




  

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

app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        console.log("You are a valid user");
        res.render("secrets.ejs");
    }else{
        res.redirect("/login");
    }

});

 app.get("/logout", (req, res) => {
  req.logout(req.user, err => {
    if(err){return next(err);}
    res.redirect("/");
  });
});




app.post("/register",function(req,res){
   User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
        console.log(err);

        // yaha pr render krke dekhna register ejs file ko 
        res.redirect("/register"); 
    }else{

        // authenticate krke hum login session create kr rahe h 
        passport.authenticate("local")(req,res,function(){

            
            // agr m yaha p render kr deta secrets page ko toh register page pr secret page ka content dikhta but hona y chaiye tha ki secret route ya secrete page secret vala content dikhta 
            res.redirect("/secrets");
        })
    }
   })
  



});


app.post("/login",function(req,res){
 const newuser = new User({
    username:req.body.username,
    password:req.body.password,

 });

 req.login(newuser,function(err){
    if(err){
        console.log(err);
        console.log("Not a registered user");
    }else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        })
    }

 })
        
    

});


// router.post('/logout', function(req, res, next) {
//     req.logout(function(err) {
//       if (err) { return next(err); }
//       res.redirect('/');
//     });
//   });


app.listen(3000,()=>
{
    console.log("Server Started on port 3000");
})