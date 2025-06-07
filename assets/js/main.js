 // MAIN APPLICATION SCRIPT
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
    
    // Initialize mining button
    document.getElementById('miningButton').addEventListener('click', function() {
        // This will be handled by mining.js
    });
    
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
