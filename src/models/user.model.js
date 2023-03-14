import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  // userId,
  fullName: {
    type: String,
    lowercase: true,
    required: true
  },
  accountNumber: {
    type: Number,
    required: true
  },
  emailAddress: {
    type: String,
    lowercase: true,
    unique: true,
    validate: [ validator.isEmail, 'Email is invalid!']
  },
  registrationNumber: {
    type: Number,
    required: true
  },
});

export default mongoose.model('User', userSchema);