// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize countdown timer
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 120);
    
    function updateCountdown() {
        const now = new Date();
        const diff = endDate - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    }
    
    setInterval(updateCountdown, 60000);
    updateCountdown();
    
    // Mining System
    let miningInterval;
    let minedAmount = 0;
    let isMining = false;
    const baseRate = 0.12 / (24 * 60 * 60 * 1000); // 0.12 MZLx per day in ms
    
    const miningButton = document.getElementById('miningButton');
    miningButton.addEventListener('click', function() {
        if (isMining) {
            stopMining();
        } else {
            startMining();
        }
    });
    
    function startMining() {
        isMining = true;
        miningButton.textContent = 'MINING (ON)';
        miningButton.classList.add('active');
        
        const startTime = new Date();
        
        miningInterval = setInterval(() => {
            const now = new Date();
            const elapsed = now - startTime;
            minedAmount = elapsed * baseRate;
            
            document.getElementById('minedAmount').textContent = minedAmount.toFixed(6) + ' MZLx';
            
            // Auto-stop after 24 hours
            if (elapsed >= 24 * 60 * 60 * 1000) {
                stopMining();
            }
        }, 100);
    }
    
    function stopMining() {
        clearInterval(miningInterval);
        isMining = false;
        miningButton.textContent = 'START MINING';
        miningButton.classList.remove('active');
    }
    
    // Action Buttons
    document.getElementById('saveEarnBtn').addEventListener('click', function() {
        alert('Save & Earn feature will open');
    });
    
    document.getElementById('escrowShopBtn').addEventListener('click', function() {
        alert('Escrow Shop feature will open');
    });
    
    document.getElementById('connectWalletBtn').addEventListener('click', function() {
        alert('Wallet connection will be implemented');
    });
    
    document.getElementById('sendReceiveBtn').addEventListener('click', function() {
        alert('Send/Receive feature will open');
    });
    
    // Buy Button
    document.getElementById('buyButton').addEventListener('click', function() {
        alert('Token purchase flow will open');
    });
    
    // Auth Buttons
    document.querySelector('.btn-login').addEventListener('click', function() {
        alert('Login form will open');
    });
    
    document.querySelector('.btn-register').addEventListener('click', function() {
        alert('Registration form will open');
    });
});
