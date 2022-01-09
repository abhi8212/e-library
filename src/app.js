require('dotenv').config();
//require('dotenv').config({ path: '/.env'});
const express =require("express");
const app= express();
const cookieParser =require("cookie-parser");
const bodyParser =require("body-parser");
const path =require("path");
const ejs =require("ejs");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const auth =require("./middleware/auth");
var session = require('express-session');
const cors =require("cors");
app.use(cors());

const connection_string = process.env.CONNECTION_STRING;
require("./db/conn");
//contact require;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
const Contacts=require("./models/contacts");

const Registers =require("./models/registers");
const port =process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const templates_path =path.join(__dirname,"../templates/views");
const partials_path =path.join(__dirname,"../templates/partials");

//for contact;
//app.use(express.urlencoded({extended:false}));

//app.use(express.json());
//app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
//express-session use
// app.use(session({
//     secret:  process.env.SECRET_KEY,
//     resave: false,
//      saveUninitialized: true,
//      cookie: { secure: true }
//    }))
//set ejs as templationg engine;
 app.use((req,res,next)=>{
     res.locals.user= req.user || null;
    // console.log(req.locals.user);
     next();
 });
// app.use(function (req, res, next) {
//     res.locals.session = req.session;
//     next();
// });

app.set('view engine', 'ejs');
app.set('views',templates_path);
//app.set("views",partials_path);



//console.log(__dirname,templates_path);


app.get("/",(req,res) => {
    res.render("index");
//    console.log(req.user.First);
});

app.get("/contact",(req,res) => {
     res.render("index");
});


app.post("/contact", async(req,res)=>{
    try{
     
        const contactstudent=new Contacts
        ({
            name :req.body.name,
            locallity: req.body.locallity,
            phone:req.body.phone,
            email:req.body.email,
            message:req.body.message
        })
     //   console.log(contactstudent);

        const contacted = await contactstudent.save();
      //  res.render(201).render("index");
      res.status(201).render("index");

    }
    catch(error){
        res.status(400).send("the contact is not saved");
    }
});




app.get("/register",(req,res) => {
    res.render("register")
});

app.get("/btech_first",(req,res) => {
    // console.log(req.user.First);
    res.render("btech_first")
});
// res.render('navbar.jes', { user });

app.get("/btech_second",(req,res) => {
    res.render("btech_second")
});

app.get("/btech_third",auth,(req,res) => {
    // console.log(`this is the cooke ${req.cookies.jwt}`);
    res.render("btech_third")
});

app.get("/btech_fourth",(req,res) => {
    res.render("btech_fourth");
});


 app.post("/register", async (req,res) => {
    try {
        const password = req.body.password;
        const cpassword =req.body.cpassword;
        if(password == cpassword)
        {
            const registerstudent =new Registers
             ({
              First:req.body.First,
              Last:req.body.Last,
              user:req.body.user,
              email:req.body.email,
              course:req.body.course,
              password:req.body.password,
              cpassword:req.body.cpassword,
              gender:req.body.gender

            })
           // console.log("the success part"+registerstudent);
            //generate a token to authontication and to check user is genuine or not;
            const token = await registerstudent.generateAuthToken();
            //  console.log("the token part"+token );

             //the res.cookeie() function is used to set the cookie name to value.
             // the value parameter may be a string or object converted to json.
             //Syntax: res.cookie(name,vlaue,[option])
             res.cookie("jwt",token,{
                expires:new Date(Date.now() + 12000000), 
                httpOnly:true
            });
            //save the data;
           
            const registered = await registerstudent.save();
            //calling login page;
             res.status(201).render("login");
                
        }
        else{
            res.send("passowrd are not matching");
        }     
    }
    catch(error){
        res.status(400).send("registration is not successfully registered");
    }
});
// console.log(process.env.SECRET_KEY);

 app.get("/login",(req,res)=>{
     res.render("login");
 });

 //check the userid save in the data base or not;
 app.post("/login",async(req,res)=>{
     try
     {
        // req.session.loggedin = true
        // req.session.loggedin = true;
         const userlog=req.body.userlog;
        //  const name=req.body.First;
        //  console.log(req.body.First);
         const passwordlog=req.body.passwordlog;
        //  console.log(`${username} and password is ${password}`)
//to match the user id and passoword with the registartion form;
        const userid = await Registers.findOne({user:userlog});
        //check after hash the password match with register form or not;
       const isMatch =await bcrypt.compare(passwordlog,userid.password);
    //    console.log(req.user.First);
    //    req.isMatch=match;
       const token = await userid.generateAuthToken();
      console.log("the token part"+token );
    //   await req.user.save();
      res.cookie("jwt",token,{
        expires:new Date(Date.now() + 12000000),
        httpOnly:true
    });
  

        if(isMatch)
        {
            //  res.status(201).render("index",{user:userlog});
            res.status(201).render("index",{user:userlog});
        }else{
           // res.send("invalid login details");
           res.status(201).render("login");
        }
        // res.send(userid);
        // console.log(password);
        // console.log(userid.password);
     } catch(error){
         res.status(400).send("envalid email");
     }
 });
//  console.log(user.First);
app.get("/logout",auth,async(req, res) => {
    try{
        //  console.log(req.user.First);
        req.user.tokens = req.user.tokens.filter((currElement)=>{
             return currElement.token !=req.token
        })
        res.clearCookie("jwt");
        console.log("logout successfully");
       await req.user.save();
       user = null;
       res.render("login");

    }catch(error){
        res.status(500).send(error);
    }
});

// const logincheck =(req,res)=>{
//     var results =
// }

// app.use(function(req, res, next){
//     // all the stuff from the example
//     if (req.session.user) {
//         res.locals.session = req.session;
//     }
//     next();
//   });

app.listen(port, () => {
    console.log(`server is run on ${port}`);
})
