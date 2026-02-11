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
        required: [true, "Firstname cannot be empty" ],  //associated error message if the validation is violated
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

//Declare Virtual Fields
EmployeeSchema.virtual('fullname')
  .get(function(){
    return `${this.firstname} ${this.lastname}`
    })
  .set(function(value){
    console.log('fullname set - ', value);
    })

module.exports = mongoose.model('User', UserSchema);




