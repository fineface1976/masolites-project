 let miningInterval;
let minedAmount = 0;
let isMining = false;
const baseRate = 0.12 / (24 * 60 * 60 * 1000); // 0.12 MZLx per day in milliseconds

function toggleMining() {
    if (isMining) {
        stopMining();
    } else {
        startMining();
    }
}

function startMining() {
    isMining = true;
    const miningBtn = document.getElementById('miningButton');
    miningBtn.textContent = 'MINING (ON)';
    miningBtn.classList.add('active');
    
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
    const miningBtn = document.getElementById('miningButton');
    miningBtn.textContent = 'START MINING';
    miningBtn.classList.remove('active');
}
