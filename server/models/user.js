const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  memberId: { type: String, unique: true },
  membership: {
    type: String,
    enum: ['FREE', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM'],
    default: 'FREE'
  },
  purchasedTokens: { type: Number, default: 0 },
  fiatWallet: { type: Number, default: 0 },
  tokenWallet: { type: Number, default: 0 },
  miningMultiplier: { type: Number, default: 1.0 },
  upline: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save hook to generate member ID
userSchema.pre('save', function(next) {
  if (!this.memberId) {
    const prefixMap = {
      'FREE': 'MSL-F',
      'BRONZE': 'MSL-B',
      'SILVER': 'MSL-S',
      'GOLD': 'MSL-G',
      'PLATINUM': 'MSL-P'
    };
    const prefix = prefixMap[this.membership] || 'MSL-F';
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    this.memberId = `${prefix}-${randomNum}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema)
