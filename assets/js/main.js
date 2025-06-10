 // Voting system
const votingSection = document.getElementById('voting-section');
const priceSlider = document.getElementById('price-slider');
const selectedPrice = document.getElementById('selected-price');
const submitVote = document.getElementById('submit-vote');

// Update selected price display
priceSlider.addEventListener('input', () => {
  const price = parseFloat(priceSlider.value).toFixed(4);
  selectedPrice.textContent = `$${price}`;
});

// Check voting window
function checkVotingTime() {
  const now = new Date();
  const watTime = new Date(now.getTime() + (60 * 60 * 1000)); // UTC+1
  const hours = watTime.getHours();
  const minutes = watTime.getMinutes();
  const totalMinutes = hours * 60 + minutes;
  
  return totalMinutes >= 1080 && totalMinutes <= 1410; // 18:00-23:30
}

// Show/hide voting section
function updateVotingVisibility() {
  if (checkVotingTime() && currentUser && currentUser.canVote) {
    votingSection.classList.remove('hidden');
  } else {
    votingSection.classList.add('hidden');
  }
}

// Submit vote
submitVote.addEventListener('click', async () => {
  const proposedPrice = parseFloat(priceSlider.value);
  
  try {
    const response = await fetch('/api/voting/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: proposedPrice })
    });
    
    if (response.ok) {
      alert('Vote submitted successfully!');
    } else {
      alert('Failed to submit vote');
    }
  } catch (error) {
    console.error('Voting error:', error);
  }
});

// Check every minute
setInterval(updateVotingVisibility, 60000);
updateVotingVisibility();

// DOM Elements
const tokenCounter = document.getElementById('token-counter');
const buyButton = document.getElementById('buy-button');
const miningButton = document.getElementById('mining-button');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication status
  const token = localStorage.getItem('token');
  if (!token) showLoginForm();
  
  // Update UI
  updateTokenCounter();
});

// Update token counter display
function updateTokenCounter() {
  // Fetch data from backend in real implementation
  tokenCounter.textContent = '25,000,000 MZLx remaining';
}

// Handle token purchase
buyButton.addEventListener('click', () => {
  // Minimum purchase amount
  const minAmount = 25; // MZLx
  const amount = prompt(`Enter amount (minimum ${minAmount} MZLx):`);
  
  if (amount && amount >= minAmount) {
    processPurchase(amount);
  } else {
    alert(`Minimum purchase is ${minAmount} MZLx`);
  }
});

// Handle mining start
miningButton.addEventListener('click', () => {
  // Start mining process
  startMining();
});
