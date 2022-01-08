const mongoose =require("mongoose");
require('dotenv').config();
// mongoose.connect("mongodb://localhost:27017/elibraryRegistration",{
mongoose.connect(process.env.database_secret,{
useNewUrlParser:true,
    useUnifiedTopology:true
   //useFindAndModify: false,
   //useCreateIndex:true

}).then(() =>{
    console.log(`database created successful`);
}).catch((e) => {
    console.log(`database not created`);
})


//creation database;
/* mongoose.connect("mongodb://localhost:27017/abhipro")
.then( ()=> console.log("connection is successful"))
.catch((err) =>console.log(err))
*/


