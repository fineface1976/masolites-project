// MINING SYSTEM IMPLEMENTATION
let miningInterval;
let minedAmount = 0;
let isMining = false;
const baseRate = 0.12 / (24 * 60 * 60 * 1000); // 0.12 MZLx per day in milliseconds

document.addEventListener('DOMContentLoaded', function() {
    const miningButton = document.getElementById('miningButton');
    
    miningButton.addEventListener('click', function() {
        if (isMining) {
            stopMining();
        } else {
            startMining();
        }
    });
    
    // Check for existing mining session
    const miningSession = localStorage.getItem('miningSession');
    if (miningSession) {
        const { startTime, accumulated } = JSON.parse(miningSession);
        const elapsed = new Date() - new Date(startTime);
        if (elapsed < 24 * 60 * 60 * 1000) {
            minedAmount = accumulated + (elapsed * baseRate);
            startMining(new Date(startTime), accumulated);
        }
    }
});

function startMining(startTime = new Date(), accumulated = 0) {
    isMining = true;
    const miningButton = document.getElementById('miningButton');
    miningButton.textContent = 'MINING (ON)';
    miningButton.classList.add('active');
    
    const sessionStartTime = startTime;
    
    miningInterval = setInterval(() => {
        const now = new Date();
        const elapsed = now - sessionStartTime;
        minedAmount = accumulated + (elapsed * baseRate);
        
        document.getElementById('minedAmount').textContent = minedAmount.toFixed(6) + ' MZLx';
        
        // Auto-stop after 24 hours
        if (elapsed >= 24 * 60 * 60 * 1000) {
            stopMining();
        }
        
        // Save session
        localStorage.setItem('miningSession', JSON.stringify({
            startTime: sessionStartTime.toISOString(),
            accumulated: accumulated
        }));
    }, 100);
}

function stopMining() {
    clearInterval(miningInterval);
    isMining = false;
    const miningButton = document.getElementById('miningButton');
    miningButton.textContent = 'START MINING';
    miningButton.classList.remove('active');
    localStorage.removeItem('miningSession');
     }
