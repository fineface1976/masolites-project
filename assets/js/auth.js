// User Authentication System
class AuthSystem {
    static register(email, password) {
        // Generate wallets for user
        const cryptoWallet = this.generateCryptoWallet();
        const fiatWallet = this.generateFiatWallet();
        
        // Create user object
        const user = {
            email,
            password: btoa(password), // Simple encoding (use bcrypt in production)
            memberId: this.generateMemberId(),
            cryptoWallet,
            fiatWallet,
            createdAt: new Date().toISOString(),
            isVerified: false,
            notifications: []
        };
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('users', JSON.stringify([...(JSON.parse(localStorage.getItem('users') || '[]')), user]));
        
        // Send welcome notification
        this.sendNotification(user, 'welcome');
        
        return user;
    }
    
    static login(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === btoa(password));
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        return null;
    }
    
    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }
    
    static logout() {
        localStorage.removeItem('currentUser');
    }
    
    static generateMemberId() {
        const prefix = 'MSL-F';
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        return `${prefix}-${randomNum}`;
    }
    
    static generateCryptoWallet() {
        return {
            address: `MZLx_${Math.random().toString(36).substring(2, 12)}`,
            balance: 0,
            currency: 'MZLx'
        };
    }
    
    static generateFiatWallet() {
        return {
            accountNumber: `MAS_${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            balance: 0,
            currency: 'NGN'
        };
    }
    
    static sendNotification(user, type, data = {}) {
        const messages = {
            welcome: `Welcome to Masolites! Your crypto address: ${user.cryptoWallet.address}, Fiat account: ${user.fiatWallet.accountNumber}`,
            depositPending: `Manual deposit of ₦${data.amount} submitted. Waiting for admin approval`,
            depositApproved: `Deposit of ₦${data.amount} approved! Reward: ${data.reward} MZLx added to your wallet`,
            votingReminder: 'Token price voting starts in 1 hour!'
        };
        
        user.notifications.push({
            message: messages[type],
            timestamp: new Date().toISOString(),
            read: false
        });
        
        // Update user
        const users = JSON.parse(localStorage.getItem('users') || [];
        const updatedUsers = users.map(u => u.email === user.email ? user : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Show notification
        if (user === AuthSystem.getCurrentUser()) {
            alert(messages[type]);
        }
    }
}
