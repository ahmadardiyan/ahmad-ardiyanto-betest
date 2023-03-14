import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const { ObjectId }= mongoose.Schema;

const accountSchema = new mongoose.Schema({
  // accountId,
  userName: {
    type: String,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  lastLoginDateTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  userId: {
    type: ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

accountSchema.pre('save', async function(next) {
  const account = this;
  if (account.isModified('password')) {
    account.password = await bcrypt.hash(account.password, 8)
  }
})


export default mongoose.model('Account', accountSchema)