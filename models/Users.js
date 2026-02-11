const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username cannot be empty" ],
        trim: true,
        unique: true,
    },
    firstname: {
        type: String,
        required: [true, "Firstname cannot be empty" ], 
        trim: true,
    },
    lastname: {
        type: String,
        required: [true, "Lastname cannot be empty" ],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
  
    }, 
    createdOn: { 
        type: Date,
        default: Date.now
    },
    updatedOn: { 
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('User', UserSchema);




