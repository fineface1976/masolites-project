 // Tokenomics Configuration
const TOKENOMICS = {
    totalSupply: 50000000,       // 50 million
    privateSale: 25000000,       // 25 million (50%)
    lockedReserve: 20000000,     // 20 million (40%)
    miningReserve: 3000000,      // 3 million (6%)
    affiliateReserve: 1000000,   // 1 million (2%)
    bountyReserve: 1000000,      // 1 million (2%)
    currentPrice: 0.001,         // $0.001
    ngnPrice: 18                 // ₦18
};

// Membership System
const MEMBERSHIP = {
    FREE: { 
        minTokens: 0, 
        badge: "🎁 Free", 
        multiplier: 1.0,
        discount: 0,
        prefix: "MSL-F"
    },
    BRONZE: { 
        minTokens: 25, 
        badge: "🥉 Bronze", 
        multiplier: 1.2,
        discount: 5,
        prefix: "MSL-B"
    },
    SILVER: { 
        minTokens: 1000, 
        badge: "🥈 Silver", 
        multiplier: 1.5,
        discount: 10,
        prefix: "MSL-S"
    },
    GOLD: { 
        minTokens: 2000, 
        badge: "🥇 Gold", 
        multiplier: 2.0,
        discount: 15,
        prefix: "MSL-G"
    },
    PLATINUM: { 
        minTokens: 0, 
        badge: "P", 
        multiplier: 2.5,
        discount: 20,
        prefix: "MSL-P",
        bounty: 0.01 // 1% bounty
    }
};

// User state
let userState = {
    walletAddress: null,
    balance: 0,
    membership: MEMBERSHIP.FREE,
    memberId: "",
    upline: null,
    miningMultiplier: 1.0,
    purchasedTokens: 0
};

// Initialize
function initApp() {
    // Load user state
    const savedState = localStorage.getItem('userState');
    if (savedState) {
        userState = JSON.parse(savedState);
        updateMembershipDisplay();
    } else {
        generateMemberId();
    }
    
    // ... rest of initialization ...
}

// Generate unique member ID
function generateMemberId() {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    userState.memberId = `${userState.membership.prefix}-${randomNum}`;
    document.getElementById('memberBadge').textContent = 
        `${userState.membership.badge} Member | ${userState.memberId}`;
}

// Update membership based on token purchases
function updateMembership() {
    const tokens = userState.purchasedTokens;
    
    if (tokens >= MEMBERSHIP.GOLD.minTokens) {
        userState.membership = MEMBERSHIP.GOLD;
    } else if (tokens >= MEMBERSHIP.SILVER.minTokens) {
        userState.membership = MEMBERSHIP.SILVER;
    } else if (tokens >= MEMBERSHIP.BRONZE.minTokens) {
        userState.membership = MEMBERSHIP.BRONZE;
    } else {
        userState.membership = MEMBERSHIP.FREE;
    }
    
    // Apply mining multiplier
    userState.miningMultiplier = userState.membership.multiplier;
    updateMembershipDisplay();
    localStorage.setItem('userState', JSON.stringify(userState));
}

// Update UI display
function updateMembershipDisplay() {
    const badgeEl = document.getElementById('memberBadge');
    badgeEl.textContent = `${userState.membership.badge} Member | ${userState.memberId}`;
    
    // Add specific class for styling
    badgeEl.className = 'member-badge ';
    if (userState.membership === MEMBERSHIP.BRONZE) badgeEl.classList.add('bronze');
    if (userState.membership === MEMBERSHIP.SILVER) badgeEl.classList.add('silver');
    if (userState.membership === MEMBERSHIP.GOLD) badgeEl.classList.add('gold');
    if (userState.membership === MEMBERSHIP.PLATINUM) badgeEl.classList.add('platinum');
}

// MLM Referral System
function processReferral(referrerId, amount, isTokenPurchase = false) {
    // 6-level deep MLM with 2.5% per level
    const commissionRate = 0.025;
    let currentLevel = 1;
    let currentReferrer = findUser(referrerId);
    
    while (currentReferrer && currentLevel <= 6) {
        const commission = amount * commissionRate;
        
        // Add to platform wallet
        creditUserWallet(currentReferrer.id, commission, isTokenPurchase);
        
        // Notify user
        sendNotification(currentReferrer.id, 
            `You earned ${commission.toFixed(2)} ${isTokenPurchase ? 'MZLx' : 'NGN'} from level ${currentLevel} referral!`);
        
        // Move to next upline
        currentReferrer = findUser(currentReferrer.upline);
        currentLevel++;
    }
}

// Mining multiplier formula
function calculateMiningMultiplier() {
    let multiplier = userState.membership.multiplier;
    
    // Add boost for token purchases (0.1% per 100 tokens)
    multiplier += (userState.purchasedTokens / 100) * 0.001;
    
    // Add boost for platinum status
    if (userState.membership === MEMBERSHIP.PLATINUM) {
        multiplier += 0.5;
    }
    
    return Math.min(multiplier, 5.0); // Cap at 5x
}

// Voting System
function initVotingSystem() {
    // Voting window: 6pm-11:30pm WAT
    const now = new Date();
    const watOffset = 60 * 60 * 1000; // WAT is UTC+1
    const startHour = 18; // 6pm
    const endHour = 23.5; // 11:30pm
    
    const watTime = new Date(now.getTime() + watOffset);
    const currentHour = watTime.getHours() + (watTime.getMinutes()/60);
    
    if (currentHour >= startHour && currentHour <= endHour) {
        // Enable voting UI
        if (userState.membership !== MEMBERSHIP.FREE) {
            showVotingInterface();
        }
    }
}

// Escrow Discount System
function applyEscrowDiscount(price) {
    const discount = userState.membership.discount;
    return price * (1 - discount/100);
}

// Token Swap with Fees
function swapTokens(fromToken, toToken, amount) {
    // 0.5% platform fee + blockchain fees
    const platformFee = amount * 0.005;
    const swapAmount = amount - platformFee;
    
    // Execute swap
    // ... blockchain interaction ...
    
    return swapAmount;
}

// Initialize application
document.addEventListener('DOMContentLoaded', initApp);
