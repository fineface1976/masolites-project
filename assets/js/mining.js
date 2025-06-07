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
let isMining = false;
const baseRate = 0.12 / (24 * 60 * 60 * 1000);

document.getElementById('miningButton').addEventListener('click', function() {
    if (isMining) {
        clearInterval(miningInterval);
        this.textContent = 'START MINING';
        isMining = false;
    } else {
        const startTime = new Date();
        miningInterval = setInterval(() => {
            const now = new Date();
            minedAmount = (now - startTime) * baseRate;
            document.getElementById('minedAmount').textContent = minedAmount.toFixed(6) + ' MZLx';
        }, 100);
        this.textContent = 'MINING (ON)';
        isMining = true;
    }
});

// Action Buttons
document.querySelectorAll('.action-card').forEach(btn => {
    btn.addEventListener('click', function() {
        alert(this.querySelector('.action-label').textContent + ' feature will open');
    });
});
