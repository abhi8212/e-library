//require('dotenv').config();
const mongoose =require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const studentSchema = new mongoose.Schema({
    First : {
         type:String,
        required :true
    },

    Last : {
        type:String,
        required:true
    },
    user:
    {
        type:String,
        required:true,
        unique:true

    },
    email :{
        type:String,
        required:true,
        unique:true
    },
    course :{
        type:String,
        required:true
      //  unique:true
    },
    password:
    {
        type:String,
        required:true
    },
    cpassword:
    {
        type:String,
        required:true
    },
    gender:
    {
        type:String,
        required:true
       
    },
    // state:
    // {
    //     type:bool;
    //     required:true;
    // }
     tokens:
     [{
         token:{
             type:String,
             required:true
         }
     }]
});

//generating the token;
//convert id from object into string;
// process.env.SECRET_KEY

 studentSchema.methods.generateAuthToken = async function(){
     try{
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        
         this.tokens = this.tokens.concat({token:token})
      //console.log(this.tokens);
         await this.save();
         // console.log(token);
         return token;
     }catch(error){
         res.send("the error part"+error);
         console.log("the error part"+error);
     }
}

//this code is for the hash the password so that we can protect password from hacker;
studentSchema.pre("save",async function(next){

    if(this.isModified("password")){
        // const passwordHash = await bcrypt.hash(password, 10);
     //   console.log(`the current password is ${this.password}`);
        this.password =await bcrypt.hash(this.password,10);
      //  console.log(`the current password is ${this.password}`);
        this.cpassword=await bcrypt.hash(this.password,10);
    }
    next();

})
//we need to create a collection
const Registers =  mongoose.model('Register',studentSchema);
module.exports= Registers