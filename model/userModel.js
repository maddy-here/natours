const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please enter name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter email'],
    unique: true,
    validator: [validator.isEmail, 'Please provide valid email'],
    lowercase: true,
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Plaese enter password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Plaese enter confiramtion password'],
    minlength: 8,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangedAt: Date,
});

// schema hook/middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// schema instanse methods
userSchema.methods.isCorrect = async function (incomingPass, existingPass) {
  return await bcrypt.compare(incomingPass, existingPass);
};

userSchema.methods.hasSamePasswordSince = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedPasswordTimeStamp = parseInt(
      this.passwordChangedAt.getTime(),
      10,
    );
    return JWTTimeStamp < changedPasswordTimeStamp;
  }
  return false;
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
