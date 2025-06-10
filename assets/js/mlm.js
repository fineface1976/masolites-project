
// MLM Affiliate System
const MLM_CONFIG = {
    levels: 6,
    commissionRate: 0.025, // 2.5%
    levelBonuses: {
        1: 0.025,
        2: 0.025,
        3: 0.025,
        4: 0.025,
        5: 0.025,
        6: 0.025
    }
};

// Track referrals
const referralMap = new Map();

function processReferral(referrerId, userId, amount, isTokenPurchase = false) {
    // Add to referral hierarchy
    referralMap.set(userId, referrerId);
    
    // Distribute commissions through levels
    distributeCommissions(userId, amount, isTokenPurchase);
}

function distributeCommissions(userId, amount, isTokenPurchase) {
    let currentId = userId;
    let level = 1;
    
    while (level <= MLM_CONFIG.levels && currentId) {
        const referrerId = referralMap.get(currentId);
        if (!referrerId) break;
        
        const commission = amount * MLM_CONFIG.levelBonuses[level];
        creditReferralBonus(referrerId, commission, isTokenPurchase);
        
        currentId = referrerId;
        level++;
    }
}

function creditReferralBonus(userId, amount, isTokenPurchase) {
    const user = getUser(userId);
    if (!user) return;
    
    if (isTokenPurchase) {
        // Credit to crypto wallet
        user.tokenWallet += amount;
        showNotification(userId, `You received ${amount.toFixed(6)} MZLx referral bonus!`);
    } else {
        // Credit to fiat wallet
        user.fiatWallet += amount;
        showNotification(userId, `You received ₦${amount.toFixed(2)} referral bonus!`);
    }
    
    updateUser(user);
}

// Notification system
function showNotification(userId, message) {
    // In real app: send push notification/email
    console.log(`Notification to ${userId}: ${message}`);
    // For UI: show toast notification
    if (userId === userState.memberId) {
        alert(message); // Temporary UI feedback
    }
}

// Initialize MLM
export function initMLM() {
    // Load referral data from localStorage
    const savedReferrals = localStorage.getItem('referralMap');
    if (savedReferrals) {
        referralMap = new Map(JSON.parse(savedReferrals));
    }
}

// Save referrals periodically
setInterval(() => {
    localStorage.setItem('referralMap', JSON.stringify(Array.from(referralMap.entries())));
}, 30000);

// MLM Configuration
const MLM_CONFIG = {
  levels: 6,
  commissionRate: 0.025 // 2.5%
};

// Process referral
function processReferral(referrerId, userId, amount, isTokenPurchase) {
  console.log(`Processing referral: ${referrerId} -> ${userId}`);
  // Implementation would connect to backend
}
