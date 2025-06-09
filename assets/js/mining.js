 // Initialize Web3
let web3;
let walletAddress = null;
let userBalance = 0;

// Initialize Web3 if MetaMask is available
if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
} else {
    console.warn("MetaMask not detected. Some features will be limited.");
}

// Countdown Timer
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
let totalMined = 0;
let isMining = false;
const baseRate = 0.12 / (24 * 60 * 60 * 1000); // Tokens per ms
let lastMinuteUpdate = Date.now();
const miningButton = document.getElementById('miningButton');
const claimButton = document.getElementById('claimButton');
const minedDisplay = document.getElementById('minedAmount');
const totalDisplay = document.getElementById('miningTotal');

// Load mined data from localStorage
if (localStorage.getItem('totalMined')) {
    totalMined = parseFloat(localStorage.getItem('totalMined'));
    totalDisplay.textContent = totalMined.toFixed(6) + ' MZLx';
    if(totalMined > 0) claimButton.style.display = 'block';
}

miningButton.addEventListener('click', function() {
    if (isMining) {
        clearInterval(miningInterval);
        this.textContent = 'START MINING';
        this.classList.remove('mining-active');
        isMining = false;
        
        // Save to localStorage when mining stops
        localStorage.setItem('totalMined', totalMined.toString());
    } else {
        const startTime = Date.now();
        lastMinuteUpdate = startTime;
        
        miningInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime;
            minedAmount = elapsed * baseRate;
            
            // Update every minute for total accumulation
            if (now - lastMinuteUpdate >= 60000) {
                totalMined += minedAmount;
                totalDisplay.textContent = totalMined.toFixed(6) + ' MZLx';
                lastMinuteUpdate = now;
                
                // Save to localStorage
                localStorage.setItem('totalMined', totalMined.toString());
                
                // Show claim button if tokens available
                if(totalMined > 0) claimButton.style.display = 'block';
            }
            
            // Update millisecond counter
            minedDisplay.textContent = minedAmount.toFixed(6) + ' MZLx/s';
                
        }, 50); // Update every 50ms for smoother animation
        
        this.textContent = 'MINING (ON)';
        this.classList.add('mining-active');
        isMining = true;
    }
});

// Claim mined tokens
claimButton.addEventListener('click', function() {
    if (!walletAddress) {
        alert('Please connect your wallet first!');
        return;
    }
    
    alert(`Claimed ${totalMined.toFixed(6)} MZLx to your wallet!`);
    totalMined = 0;
    totalDisplay.textContent = '0.000000 MZLx';
    minedDisplay.textContent = '0.000000 MZLx/s';
    localStorage.setItem('totalMined', '0');
    this.style.display = 'none';
    
    // Reset mining
    if (isMining) {
        clearInterval(miningInterval);
        miningButton.textContent = 'START MINING';
        miningButton.classList.remove('mining-active');
        isMining = false;
    }
});

// Wallet Connection
document.getElementById('connectWalletBtn').addEventListener('click', async function() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to connect your wallet!');
        return;
    }
    
    try {
        // Request account access
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        walletAddress = accounts[0];
        
        // Display wallet info
        document.getElementById('walletAddress').textContent = 
            walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4);
        document.getElementById('walletInfo').style.display = 'block';
        
        // Get balance
        userBalance = await web3.eth.getBalance(walletAddress);
        const ethBalance = web3.utils.fromWei(userBalance, 'ether');
        alert(`Wallet connected successfully!\nBalance: ${parseFloat(ethBalance).toFixed(4)} ETH`);
        
    } catch (error) {
        console.error("Wallet connection failed:", error);
        alert('Wallet connection failed. Please try again.');
    }
});

// Action Buttons
document.getElementById('saveEarnBtn').addEventListener('click', function() {
    alert('Save & Earn feature coming soon!');
});

document.getElementById('escrowShopBtn').addEventListener('click', function() {
    document.getElementById('escrowModal').style.display = 'flex';
    loadEscrowListings();
});

document.getElementById('sendReceiveBtn').addEventListener('click', function() {
    if (!walletAddress) {
        alert('Please connect your wallet first!');
        return;
    }
    alert(`Send/Receive tokens using your wallet: ${walletAddress.substring(0, 12)}...`);
});

// Currency Modal
const buyButton = document.getElementById('buyButton');
const currencyModal = document.getElementById('currencyModal');
const purchaseModal = document.getElementById('purchaseModal');
const tokenAmountInput = document.getElementById('tokenAmount');
const currencySymbol = document.getElementById('currencySymbol');
const currencyAmount = document.getElementById('currencyAmount');
const tokenEquivalent = document.getElementById('tokenEquivalent');
let selectedCurrency = null;

buyButton.addEventListener('click', () => {
    currencyModal.style.display = 'flex';
});

// Currency selection
document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        selectedCurrency = this.dataset.currency;
        currencyModal.style.display = 'none';
        
        // Set currency details
        let symbol, rate;
        switch(selectedCurrency) {
            case 'USD': symbol = '$'; rate = 0.001; break;
            case 'NGN': symbol = '₦'; rate = 18; break;
            case 'USDT': symbol = 'USDT '; rate = 0.001; break;
            case 'BNB': symbol = 'BNB '; rate = 0.001; break;
        }
        
        currencySymbol.textContent = symbol;
        updateCurrencyDisplay(rate);
        purchaseModal.style.display = 'flex';
    });
});

// Update currency display when token amount changes
tokenAmountInput.addEventListener('input', function() {
    if (!selectedCurrency) return;
    
    let rate;
    switch(selectedCurrency) {
        case 'USD': rate = 0.001; break;
        case 'NGN': rate = 18; break;
        case 'USDT': rate = 0.001; break;
        case 'BNB': rate = 0.001; break;
    }
    
    updateCurrencyDisplay(rate);
});

function updateCurrencyDisplay(rate) {
    const tokenAmount = parseInt(tokenAmountInput.value) || 0;
    const amount = tokenAmount * rate;
    currencyAmount.textContent = amount.toFixed(2);
    tokenEquivalent.textContent = tokenAmount;
}

// Confirm purchase
document.getElementById('confirmPurchase').addEventListener('click', async function() {
    const tokenAmount = parseInt(tokenAmountInput.value) || 0;
    if (tokenAmount < 100) {
        alert('Minimum purchase is 100 MZLx');
        return;
    }
    
    let rate, currency;
    switch(selectedCurrency) {
        case 'USD': rate = 0.001; currency = 'USD'; break;
        case 'NGN': rate = 18; currency = 'NGN'; break;
        case 'USDT': rate = 0.001; currency = 'USDT'; break;
        case 'BNB': rate = 0.001; currency = 'BNB'; break;
    }
    
    const amount = tokenAmount * rate;
    
    if (selectedCurrency === 'USDT' || selectedCurrency === 'BNB') {
        // Crypto payment
        if (!walletAddress) {
            alert('Please connect your wallet first!');
            return;
        }
        
        try {
            // Simulate transaction
            alert(`Confirming ${currency} transaction for ${amount} ${currency}...`);
            
            // In a real implementation, this would be a smart contract call
            setTimeout(() => {
                alert(`Success! ${tokenAmount} MZLx purchased and sent to your wallet.`);
                purchaseModal.style.display = 'none';
            }, 2000);
            
        } catch (error) {
            console.error("Transaction failed:", error);
            alert('Transaction failed. Please try again.');
        }
    } else {
        // Fiat payment
        alert(`Redirecting to payment gateway for ${amount} ${currency}...`);
        // In a real implementation, this would redirect to Flutterwave/Stripe
        setTimeout(() => {
            alert(`Payment successful! ${tokenAmount} MZLx will be added to your account.`);
            purchaseModal.style.display = 'none';
        }, 2000);
    }
});

// Escrow Marketplace
const escrowModal = document.getElementById('escrowModal');
const viewListingsBtn = document.getElementById('viewListingsBtn');
const createListingBtn = document.getElementById('createListingBtn');
const listingsContainer = document.getElementById('escrowListings');
const createListingForm = document.getElementById('createListingForm');
const submitListingBtn = document.getElementById('submitListing');

// Escrow listings data
let escrowListings = JSON.parse(localStorage.getItem('escrowListings')) || [
    { id: 1, name: "iPhone 13 Pro", description: "Brand new, sealed box", price: 5000, seller: "User123" },
    { id: 2, name: "MacBook Air M1", description: "Like new, 6 months old", price: 8500, seller: "User456" }
];

viewListingsBtn.addEventListener('click', function() {
    createListingForm.style.display = 'none';
    listingsContainer.style.display = 'block';
    loadEscrowListings();
});

createListingBtn.addEventListener('click', function() {
    listingsContainer.style.display = 'none';
    createListingForm.style.display = 'block';
});

function loadEscrowListings() {
    listingsContainer.innerHTML = '';
    
    if (escrowListings.length === 0) {
        listingsContainer.innerHTML = '<p>No listings available. Be the first to create one!</p>';
        return;
    }
    
    escrowListings.forEach(listing => {
        const listingEl = document.createElement('div');
        listingEl.className = 'listing-item';
        listingEl.innerHTML = `
            <h4>${listing.name}</h4>
            <div class="listing-details">${listing.description}</div>
            <div class="listing-seller">Seller: ${listing.seller}</div>
            <div class="listing-price">${listing.price} MZLx</div>
            <button class="cta-button buy-listing" data-id="${listing.id}">BUY NOW</button>
        `;
        listingsContainer.appendChild(listingEl);
    });
    
    // Add buy event listeners
    document.querySelectorAll('.buy-listing').forEach(btn => {
        btn.addEventListener('click', function() {
            const listingId = parseInt(this.dataset.id);
            const listing = escrowListings.find(l => l.id === listingId);
            
            if (!walletAddress) {
                alert('Please connect your wallet to purchase!');
                return;
            }
            
            alert(`Purchasing "${listing.name}" for ${listing.price} MZLx\nEscrow transaction will be initiated.`);
        });
    });
}

submitListingBtn.addEventListener('click', function() {
    const itemName = document.getElementById('itemName').value;
    const itemDescription = document.getElementById('itemDescription').value;
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);
    
    if (!itemName || !itemDescription || !itemPrice) {
        alert('Please fill all fields');
        return;
    }
    
    if (itemPrice <= 0) {
        alert('Price must be greater than zero');
        return;
    }
    
    // Create new listing
    const newListing = {
        id: Date.now(),
        name: itemName,
        description: itemDescription,
        price: itemPrice,
        seller: walletAddress ? walletAddress.substring(0, 8) + '...' : 'Anonymous'
    };
    
    escrowListings.push(newListing);
    localStorage.setItem('escrowListings', JSON.stringify(escrowListings));
    
    alert('Listing created successfully!');
    document.getElementById('itemName').value = '';
    document.getElementById('itemDescription').value = '';
    document.getElementById('itemPrice').value = '';
    
    // Show listings
    createListingForm.style.display = 'none';
    listingsContainer.style.display = 'block';
    loadEscrowListings();
});

// Modal close functionality
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

// Close modal when clicking outside content
window.addEventListener('click', (e) => {
    document.querySelectorAll('.modal').forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Initial layout adjustment
function adjustLayout() {
    const isMobile = window.innerWidth < 768;
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        if (isMobile) {
            card.style.height = '60px';
            card.querySelector('.action-icon').style.fontSize = '1.1rem';
        } else {
            card.style.height = '70px';
            card.querySelector('.action-icon').style.fontSize = '1.5rem';
        }
    });
}

window.addEventListener('resize', adjustLayout);
adjustLayout();
