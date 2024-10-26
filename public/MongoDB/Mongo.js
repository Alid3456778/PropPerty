
const mongoose = require("mongoose");


const connect = mongoose.connect('mongodb://localhost:27017/Login-tut', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('Connection error', err);
  });
connect.then(()=>{
    console.log("connected database Sucessfully");
})
.catch((e)=>{
    console.log("Error  ",e);
});

const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Path `username` is required.']
    },
    email:{
        type:String,
        required:[true, 'Path `email` is required.']
    },
    password:{
        type:String,
        required:[true, 'Path `password` is required.']
    }
});

const collection = new mongoose.model("users",LoginSchema);

module.exports = collection;