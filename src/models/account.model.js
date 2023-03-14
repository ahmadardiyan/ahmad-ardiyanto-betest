const mongoose = require('mongoose');
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
    _id: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
  }
});

accountSchema.pre('save', async function(next) {
  const account = this;
  if (account.isModified('password')) {
    account.password = await bcrypt.hash(account.password, 8)
  }
})


export default mongoose.model('Account', accountSchema)