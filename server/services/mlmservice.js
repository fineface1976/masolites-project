const User = require('../models/User');
const { sendNotification } = require('./notificationService');

const MLM_CONFIG = {
  levels: 6,
  commissionRate: 0.025 // 2.5%
};

async function processReferral(referrerId, userId, amount, isTokenPurchase) {
  try {
    const referrer = await User.findById(referrerId);
    const newUser = await User.findById(userId);
    
    if (!referrer || !newUser) return;
    
    // Add to referral hierarchy
    newUser.upline = referrerId;
    await newUser.save();
    
    // Distribute commissions through levels
    await distributeCommissions(referrer, amount, isTokenPurchase, 1);
  } catch (error) {
    console.error('Referral processing error:', error);
  }
}

async function distributeCommissions(user, amount, isTokenPurchase, level) {
  if (level > MLM_CONFIG.levels || !user) return;
  
  const commission = amount * MLM_CONFIG.commissionRate;
  
  if (isTokenPurchase) {
    user.tokenWallet += commission;
    await sendNotification(user._id, `Received ${commission} MZLx referral bonus!`);
  } else {
    user.fiatWallet += commission;
    await sendNotification(user._id, `Received ₦${commission} referral bonus!`);
  }
  
  await user.save();
  
  // Process next upline
  if (user.upline) {
    const uplineUser = await User.findById(user.upline);
    await distributeCommissions(uplineUser, amount, isTokenPurchase, level + 1);
  }
}

module.exports = { processReferral };
