// Save & Earn System
class SaveEarn {
    static init() {
        // Company bank details (admin configurable)
        this.companyAccounts = JSON.parse(localStorage.getItem('companyAccounts')) || [{
            bank: 'First Bank',
            name: 'Masolites Ltd',
            number: '3100000000'
        }];
        
        // Pending deposits
        this.pendingDeposits = JSON.parse(localStorage.getItem('pendingDeposits')) || [];
    }
    
    static submitManualDeposit(amount, proofImage) {
        const user = AuthSystem.getCurrentUser();
        if (!user) return false;
        
        // Create deposit record
        const deposit = {
            id: Date.now(),
            userId: user.email,
            amount,
            proof: proofImage,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            rewardConfig: this.calculateReward(amount)
        };
        
        // Add to pending
        this.pendingDeposits.push(deposit);
        localStorage.setItem('pendingDeposits', JSON.stringify(this.pendingDeposits));
        
        // Notify user
        AuthSystem.sendNotification(user, 'depositPending', { amount });
        
        return deposit;
    }
    
    static calculateReward(amount) {
        // Admin-configurable reward rules (default: 5% immediate)
        return {
            immediateReward: amount * 0.05,
            longTermReward: amount * 0.10,
            longTermDuration: 9 // months
        };
    }
    
    static approveDeposit(depositId) {
        const deposit = this.pendingDeposits.find(d => d.id === depositId);
        if (!deposit) return false;
        
        // Find user
        const users = JSON.parse(localStorage.getItem('users') || [];
        const user = users.find(u => u.email === deposit.userId);
        
        if (user) {
            // Apply immediate reward
            user.cryptoWallet.balance += deposit.rewardConfig.immediateReward;
            
            // Schedule long-term reward
            const payoutDate = new Date();
            payoutDate.setMonth(payoutDate.getMonth() + deposit.rewardConfig.longTermDuration);
            
            user.scheduledRewards = user.scheduledRewards || [];
            user.scheduledRewards.push({
                amount: deposit.rewardConfig.longTermReward,
                payoutDate: payoutDate.toISOString(),
                depositId: deposit.id
            });
            
            // Update user
            const updatedUsers = users.map(u => u.email === user.email ? user : u);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            
            // Update deposit status
            deposit.status = 'approved';
            deposit.approvedAt = new Date().toISOString();
            localStorage.setItem('pendingDeposits', JSON.stringify(this.pendingDeposits));
            
            // Notify user
            AuthSystem.sendNotification(user, 'depositApproved', {
                amount: deposit.amount,
                reward: deposit.rewardConfig.immediateReward
            });
            
            return true;
        }
        return false;
    }
    
    static processScheduledRewards() {
        const now = new Date();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        let updated = false;
        
        users.forEach(user => {
            if (user.scheduledRewards) {
                user.scheduledRewards.forEach(reward => {
                    if (new Date(reward.payoutDate) <= now && !reward.paid) {
                        user.cryptoWallet.balance += reward.amount;
                        reward.paid = true;
                        updated = true;
                        
                        AuthSystem.sendNotification(user, 'scheduledReward', {
                            amount: reward.amount,
                            depositId: reward.depositId
                        });
                    }
                });
            }
        });
        
        if (updated) {
            localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

// Check rewards every hour
setInterval(() => SaveEarn.processScheduledRewards(), 60 * 60 * 1000)
