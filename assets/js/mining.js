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
const minedDisplay = document.getElementById('minedAmount');
const totalDisplay = document.getElementById('miningTotal');

miningButton.addEventListener('click', function() {
    if (isMining) {
        clearInterval(miningInterval);
        this.textContent = 'START MINING';
        this.classList.remove('mining-active');
        isMining = false;
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
                totalDisplay.textContent = `Total: ${totalMined.toFixed(6)} MZLx`;
                lastMinuteUpdate = now;
            }
            
            // Update millisecond counter
            minedDisplay.textContent = minedAmount.toFixed(6) + ' MZLx/s';
                
        }, 50); // Update every 50ms for smoother animation
        
        this.textContent = 'MINING (ON)';
        this.classList.add('mining-active');
        isMining = true;
    }
});

// Action Buttons
document.querySelectorAll('.action-card').forEach(btn => {
    btn.addEventListener('click', function() {
        const feature = this.querySelector('.action-label').textContent;
        alert(`${feature} feature will open`);
    });
});

// Currency Modal
const buyButton = document.getElementById('buyButton');
const currencyModal = document.getElementById('currencyModal');
const modalClose = document.querySelector('.modal-close');

buyButton.addEventListener('click', () => {
    currencyModal.style.display = 'flex';
});

modalClose.addEventListener('click', () => {
    currencyModal.style.display = 'none';
});

document.querySelectorAll('.currency-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const currency = this.dataset.currency;
        alert(`Buy MAZOL with ${currency} selected. This would open the payment gateway.`);
        currencyModal.style.display = 'none';
    });
});

// Close modal when clicking outside content
window.addEventListener('click', (e) => {
    if (e.target === currencyModal) {
        currencyModal.style.display = 'none';
    }
});

// Initial layout adjustment for mobile
function adjustLayout() {
    const isMobile = window.innerWidth < 768;
    const actionCards = document.querySelectorAll('.action-card');
    
    actionCards.forEach(card => {
        if (isMobile) {
            card.style.height = '65px';
            card.querySelector('.action-icon').style.fontSize = '1.1rem';
        } else {
            card.style.height = '75px';
            card.querySelector('.action-icon').style.fontSize = '1.5rem';
        }
    });
}

window.addEventListener('resize', adjustLayout);
adjustLayout();
