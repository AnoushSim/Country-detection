const mongoose = require('mongoose');


const UsersSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true
    },
    email:{
        type:String,
        unique: true
    },
    age: {
        type: Number,
        min: 16
    },
    gender: {
         type: String,
         enum:['male','female']
    },
    country: {
      type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        minlength: 4
    }
});

module.exports = UsersSchema;