const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name:{
    type:String,
    requrired:true,
  },
  email: {
    type:String,
    requrired:true,
    unique:true,
  },
  phone_no:{
    type:String,
    requrired:true,
    unique:true,
  },
  password:{
    type:String,
    requrired:true,
  },
  token:{ 
    type:String,
  
  }, // Add a new field for storing the JWT token
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
},{timestamps:true});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
