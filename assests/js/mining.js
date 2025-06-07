 // mining.js
class MiningSystem {
    constructor() {
        this.baseRate = 0.12 / (24 * 60 * 60 * 1000); // MZLx/ms
        this.multipliers = {
            free: 1.0,
            bronze: 1.2,
            silver: 1.5,
            gold: 2.0
        };
        this.init();
    }

    init() {
        document.getElementById('mining-toggle').addEventListener('click', () => {
            this.toggleMining();
        });
    }
    
    toggleMining() {
        if (this.isActive) {
            this.stop();
        } else {
            this.start();
        }
    }
}
