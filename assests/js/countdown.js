// Countdown Timer Module
function initializeCountdown() {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 120); // 120 days from now
    
    updateCountdown(endDate);
    setInterval(() => updateCountdown(endDate), 60000);
}

function updateCountdown(endDate) {
    const now = new Date();
    const diff = endDate - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
