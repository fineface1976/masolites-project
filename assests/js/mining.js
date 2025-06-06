// Mining System Module
function initializeMining() {
    const miningBtn = document.getElementById('miningBtn');
    
    miningBtn.addEventListener('click', toggleMining);
    
    // Check for existing mining session
    if (localStorage.getItem('mining_session')) {
        const session = JSON.parse(localStorage.getItem('mining_session'));
        if (new Date() - new Date(session.startedAt) < 24 * 60 * 60 * 1000) {
            startMining(session.startedAt, session.accumulated);
        }
    }
}

function toggleMining() {
    if (appState.isMining) {
        stopMining();
    } else {
        startMining();
    }
}

function startMining(startTime = new Date(), accumulated = 0) {
    appState.isMining = true;
    const miningBtn = document.getElementById('miningBtn');
    
    // UI updates
    miningBtn.textContent = 'MINING (ON)';
    miningBtn.classList.add('active');
    
    // Calculate mining rate based on membership
    const rate = calculateMiningRate(appState.currentUser.membership);
    
    // Start mining interval
    appState.miningInterval = setInterval(() => {
        const now = new Date();
        const elapsed = now - new Date(startTime);
        const mined = (elapsed * rate) + accumulated;
        
        updateMiningDisplay(mined);
        
        // Auto-stop after 24 hours
        if (elapsed >= 24 * 60 * 60 * 1000) {
            stopMining();
        }
    }, 100);
    
    // Save session
    localStorage.setItem('mining_session', JSON.stringify({
        startedAt: startTime.toISOString(),
        accumulated
    }));
}

function stopMining() {
    clearInterval(appState.miningInterval);
    appState.isMining = false;
    
    // UI updates
    document.getElementById('miningBtn').textContent = 'START MINING';
    document.getElementById('miningBtn').classList.remove('active');
    
    // Clear session
    localStorage.removeItem('mining_session');
}
