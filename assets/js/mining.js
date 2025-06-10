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

// DOM Elements
const miningButton = document.getElementById('miningButton');
const claimButton = document.getElementById('claimButton');
const buyButton = document.getElementById('buyButton');
const connectWalletBtn = document.getElementById('connectWalletBtn');
const escrowShopBtn = document.getElementById('escrowShopBtn');
const currencyModal = document.getElementById('currencyModal');
const purchaseModal = document.getElementById('purchaseModal');
const escrowModal = document.getElementById('escrowModal');
const memberIdElement = document.getElementById('memberId');

// Mining System Variables
let miningInterval;
let minedAmount = 0;
let totalMined = 0;
let isMining = false;
let baseRate = 0.12 / (24 * 60 * 60 * 1000); // Tokens per ms
let lastMinuteUpdate = Date.now();
let walletAddress = null;
let selectedCurrency = 'USD';

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize member ID
    initMemberId();
    
    // Load mined data from localStorage
    if (localStorage.getItem('totalMined')) {
        totalMined = parseFloat(localStorage.getItem('totalMined'));
        document.getElementById('miningTotal').textContent = totalMined.toFixed(6) + ' MZLx';
        if (totalMined > 0) claimButton.style.display = 'block';
    }

    // Initialize event listeners
    initEventListeners();
    
    // Initialize countdown timer
    initCountdown();
});

function initMemberId() {
    // Generate or load member ID
    let memberId = localStorage.getItem('memberId');
    if (!memberId) {
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        memberId = `MSL-F-${randomNum}`;
        localStorage.setItem('memberId', memberId);
    }
    memberIdElement.textContent = memberId;
}

function initEventListeners() {
    // Mining System
    miningButton.addEventListener('click', toggleMining);
    claimButton.addEventListener('click', claimTokens);
    
    // Action Buttons
    buyButton.addEventListener('click', () => currencyModal.style.display = 'flex');
    connectWalletBtn.addEventListener('click', connectWallet);
    escrowShopBtn.addEventListener('click', openEscrowMarketplace);
    document.getElementById('saveEarnBtn').addEventListener('click', () => alert('Save & Earn feature coming soon!'));
    document.getElementById('sendReceiveBtn').addEventListener('click', handleSendReceive);
    
    // Currency Modal
    document.querySelectorAll('.currency-btn').forEach(btn => {
        btn.addEventListener('click', handleCurrencySelection);
    });
    
    // Purchase Modal
    document.getElementById('tokenAmount').addEventListener('input', updateCurrencyDisplay);
    document.getElementById('confirmPurchase').addEventListener('click', processPurchase);
    
    // Escrow Marketplace
    document.getElementById('viewListingsBtn').addEventListener('click', showEscrowListings);
    document.getElementById('createListingBtn').addEventListener('click', showCreateListingForm);
    document.getElementById('submitListing').addEventListener('click', submitNewListing);
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

function initCountdown() {
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
}

// Mining Functions
function toggleMining() {
    if (isMining) {
        clearInterval(miningInterval);
        miningButton.textContent = 'START MINING';
        miningButton.classList.remove('mining-active');
        isMining = false;
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
                document.getElementById('miningTotal').textContent = totalMined.toFixed(6) + ' MZLx';
                lastMinuteUpdate = now;
                localStorage.setItem('totalMined', totalMined.toString());
                if (totalMined > 0) claimButton.style.display = 'block';
            }
            
            // Update millisecond counter
            document.getElementById('minedAmount').textContent = minedAmount.toFixed(6) + ' MZLx/s';
        }, 50);
        
        miningButton.textContent = 'MINING (ON)';
        miningButton.classList.add('mining-active');
        isMining = true;
    }
}

function claimTokens() {
    if (!walletAddress) {
        alert('Please connect your wallet first!');
        return;
    }
    
    alert(`Claimed ${totalMined.toFixed(6)} MZLx to your wallet!`);
    totalMined = 0;
    document.getElementById('miningTotal').textContent = '0.000000 MZLx';
    document.getElementById('minedAmount').textContent = '0.000000 MZLx/s';
    localStorage.setItem('totalMined', '0');
    claimButton.style.display = 'none';
    
    if (isMining) {
        clearInterval(miningInterval);
        miningButton.textContent = 'START MINING';
        miningButton.classList.remove('mining-active');
        isMining = false;
    }
}

// Wallet Connection
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to connect your wallet!');
        return;
    }
    
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        walletAddress = accounts[0];
        document.getElementById('walletAddress').textContent = 
            walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4);
        document.getElementById('walletInfo').style.display = 'block';
        
        const balance = await web3.eth.getBalance(walletAddress);
        const ethBalance = web3.utils.fromWei(balance, 'ether');
        alert(`Wallet connected!\nAddress: ${walletAddress}\nBalance: ${parseFloat(ethBalance).toFixed(4)} ETH`);
    } catch (error) {
        console.error("Wallet connection failed:", error);
        alert('Wallet connection failed. Please try again.');
    }
}

function handleSendReceive() {
    if (!walletAddress) {
        alert('Please connect your wallet first!');
        return;
    }
    alert(`Send/Receive tokens using your wallet: ${walletAddress.substring(0, 12)}...`);
}

// Purchase System
function handleCurrencySelection() {
    selectedCurrency = this.dataset.currency;
    currencyModal.style.display = 'none';
    
    let symbol;
    switch(selectedCurrency) {
        case 'USD': symbol = '$'; break;
        case 'NGN': symbol = '₦'; break;
        case 'USDT': symbol = 'USDT '; break;
        case 'BNB': symbol = 'BNB '; break;
    }
    
    document.getElementById('currencySymbol').textContent = symbol;
    updateCurrencyDisplay();
    purchaseModal.style.display = 'flex';
}

function updateCurrencyDisplay() {
    const tokenAmount = parseInt(document.getElementById('tokenAmount').value) || 0;
    
    let rate;
    switch(selectedCurrency) {
        case 'USD': rate = 0.001; break;
        case 'NGN': rate = 18; break;
        case 'USDT': rate = 0.001; break;
        case 'BNB': rate = 0.001; break;
    }
    
    const amount = tokenAmount * rate;
    document.getElementById('currencyAmount').textContent = amount.toFixed(2);
    document.getElementById('tokenEquivalent').textContent = tokenAmount;
}

function processPurchase() {
    const tokenAmount = parseInt(document.getElementById('tokenAmount').value) || 0;
    if (tokenAmount < 25) {
        alert('Minimum purchase is 25 MZLx');
        return;
    }
    
    let currencyName;
    switch(selectedCurrency) {
        case 'USD': currencyName = 'USD'; break;
        case 'NGN': currencyName = 'Naira'; break;
        case 'USDT': currencyName = 'USDT'; break;
        case 'BNB': currencyName = 'BNB'; break;
    }
    
    const amount = tokenAmount * TOKENOMICS.currentPrice;
    
    if (selectedCurrency === 'USDT' || selectedCurrency === 'BNB') {
        if (!walletAddress) {
            alert('Please connect your wallet first!');
            return;
        }
        alert(`Confirming ${currencyName} transaction for ${amount} ${selectedCurrency}...`);
    } else {
        alert(`Redirecting to payment gateway for ${amount} ${currencyName}...`);
    }
    
    setTimeout(() => {
        alert(`Success! ${tokenAmount} MZLx purchased. Tokens will be available in your wallet shortly.`);
        purchaseModal.style.display = 'none';
    }, 2000);
}

// Escrow Marketplace
let escrowListings = JSON.parse(localStorage.getItem('escrowListings')) || [
    { id: 1, name: "iPhone 13 Pro", description: "Brand new, sealed box", price: 5000, seller: "User123" },
    { id: 2, name: "MacBook Air M1", description: "Like new, 6 months old", price: 8500, seller: "User456" }
];

function openEscrowMarketplace() {
    escrowModal.style.display = 'flex';
    showEscrowListings();
}

function showEscrowListings() {
    const listingsContainer = document.getElementById('escrowListings');
    listingsContainer.innerHTML = '';
    listingsContainer.style.display = 'block';
    document.getElementById('createListingForm').style.display = 'none';
    
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
            <button class="buy-listing" data-id="${listing.id}">BUY NOW</button>
        `;
        listingsContainer.appendChild(listingEl);
    });
    
    // Add event listeners to buy buttons
    document.querySelectorAll('.buy-listing').forEach(btn => {
        btn.addEventListener('click', function() {
            const listingId = parseInt(this.dataset.id);
            const listing = escrowListings.find(l => l.id === listingId);
            
            if (!walletAddress) {
                alert('Please connect your wallet to purchase!');
                return;
            }
            
            // Apply membership discount (5% for all members)
            const discountedPrice = listing.price * 0.95;
            alert(`Purchasing "${listing.name}" for ${discountedPrice.toFixed(2)} MZLx (5% discount applied!)`);
        });
    });
}

function showCreateListingForm() {
    document.getElementById('escrowListings').style.display = 'none';
    document.getElementById('createListingForm').style.display = 'block';
}

function submitNewListing() {
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
    showEscrowListings();
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

// Initialize Web3
if (typeof window.ethereum !== 'undefined') {
    window.web3 = new Web3(window.ethereum);
} else {
    console.warn("MetaMask not detected. Crypto payments will be simulated");
}
// Mining configuration
const BASE_RATE = 0.1; // MZLx per hour
let miningInterval;

// Start mining process
function startMining() {
  if (miningInterval) {
    alert('Mining already in progress');
    return;
  }
  
  let minedAmount = 0;
  miningInterval = setInterval(() => {
    // Calculate based on user's multiplier (simplified)
    const multiplier = 1.0; // Would come from user data
    minedAmount += (BASE_RATE / 60) * multiplier;
    updateMiningDisplay(minedAmount);
  }, 60000); // Update every minute
  
  alert('Mining started!');
}

// Update mining display
function updateMiningDisplay(amount) {
  console.log(`Mined: ${amount.toFixed(6)} MZLx`);
  // Would update UI in real implementation
}
