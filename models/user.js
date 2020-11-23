const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 10
  },
  email: {
      type: String,
      unique: true,
      required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(10).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required()
};

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;