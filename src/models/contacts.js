const mongoose =require("mongoose");
const validator =require("validator");
const contactSchema =mongoose.Schema({
    name : {
        type:String,
        required:true,
        minlength:3
    },
    locallity :
    {
        type:String,
        required:true
    },
    phone:
    {
        type:Number,
        required:true,
        unique:true,
        minlength:10
    },
   email:
    {
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email id")
            }
        }

    },
   
    message:
    {
        type:String,
        required:true
    }
});
//now we need to create collection
const Contacts = new mongoose.model('Contacts', contactSchema);
module.exports = Contacts;
