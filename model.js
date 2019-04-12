const mongoose = require('mongoose');
const shortid = require('shortid');

function generateAPIKey () {
    return shortid.generate() + '-' + shortid.generate() + '-' + shortid.generate() ;
}
const UsersSchema = new mongoose.Schema({
    key: {
        type: String,
        default: generateAPIKey
    },
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
