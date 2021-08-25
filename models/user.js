const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    sparse: true
  },
  mobile: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 10,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  }, 
  userType: {
    type: String,
    required: true,
    default: "user",  //user, admin
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

//custom method to generate authToken 
UserSchema.statics.generateAuthToken = function(thisUser) {
  console.log(thisUser)
  const token = jwt.sign({ _id: thisUser._id, name: thisUser.name, userType: thisUser.userType, }, 'SomePrivateKeyHere', { expiresIn: '30d' });
  return token;
}

const User =  mongoose.model('User', UserSchema);

module.exports = User; 
