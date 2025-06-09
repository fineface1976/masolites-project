// Membership System
const MEMBERSHIP = {
    FREE: {
        name: "Free",
        badge: "🎁",
        prefix: "MSL-F",
        miningMultiplier: 1.0,
        discount: 0,
        minTokens: 0,
        canVote: false
    },
    BRONZE: {
        name: "Bronze",
        badge: "🥉",
        prefix: "MSL-B",
        miningMultiplier: 1.2,
        discount: 5,
        minTokens: 25,
        canVote: true
    },
    SILVER: {
        name: "Silver",
        badge: "🥈",
        prefix: "MSL-S",
        miningMultiplier: 1.5,
        discount: 10,
        minTokens: 1000,
        canVote: true
    },
    GOLD: {
        name: "Gold",
        badge: "🥇",
        prefix: "MSL-G",
        miningMultiplier: 2.0,
        discount: 15,
        minTokens: 2000,
        canVote: true
    },
    PLATINUM: {
        name: "Platinum",
        badge: "💎",
        prefix: "MSL-P",
        miningMultiplier: 2.5,
        discount: 20,
        minTokens: 0,
        canVote: true,
        bounty: 0.01 // 1% bounty
    }
};

// Update membership based on tokens
export function updateMembership(user) {
    const tokens = user.purchasedTokens;
    let newTier;
    
    if (tokens >= MEMBERSHIP.GOLD.minTokens) {
        newTier = MEMBERSHIP.GOLD;
    } else if (tokens >= MEMBERSHIP.SILVER.minTokens) {
        newTier = MEMBERSHIP.SILVER;
    } else if (tokens >= MEMBERSHIP.BRONZE.minTokens) {
        newTier = MEMBERSHIP.BRONZE;
    } else {
        newTier = MEMBERSHIP.FREE;
    }
    
    // Handle platinum upgrade
    if (user.registrationPaid && newTier !== MEMBERSHIP.PLATINUM) {
        user.membership = MEMBERSHIP.PLATINUM;
        // Apply bounty
        user.tokenWallet += user.purchasedTokens * MEMBERSHIP.PLATINUM.bounty;
        showNotification(user.id, `Platinum bounty: ${(user.purchasedTokens * MEMBERSHIP.PLATINUM.bounty).toFixed(6)} MZLx!`);
    } else {
        user.membership = newTier;
    }
    
    // Update ID prefix if changed
    if (!user.memberId.startsWith(user.membership.prefix)) {
        const idNum = user.memberId.split('-').pop();
        user.memberId = `${user.membership.prefix}-${idNum}`;
    }
    
    return user;
}

// Mining multiplier formula
export function calculateMiningMultiplier(user) {
    let multiplier = user.membership.miningMultiplier;
    
    // Add boost for token purchases (0.1% per 100 tokens)
    multiplier += (user.purchasedTokens / 100) * 0.001;
    
    // Add boost for platinum status
    if (user.membership === MEMBERSHIP.PLATINUM) {
        multiplier += 0.5;
    }
    
    return Math.min(multiplier, 5.0); // Cap at 5x
}

// Voting eligibility check
export function canVote(user) {
    if (!user.membership.canVote) return false;
    
    // Check voting window (6pm-11:30pm WAT)
    const now = new Date();
    const watTime = new Date(now.getTime() + (60 * 60 * 1000)); // UTC+1
    const hours = watTime.getHours();
    const minutes = watTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    return totalMinutes >= 1080 && totalMinutes <= 1410; // 18:00-23:30
}
