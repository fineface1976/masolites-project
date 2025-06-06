  class AuthSystem {
  constructor() {
    this.adminEmails = ['admin@masolites.com', 'owner@masolites.com'];
    this.initAuth();
  }

  initAuth() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim().toLowerCase();
        this.handleLogin(email);
      });
    }
    
    this.checkExistingSession();
  }

  handleLogin(email) {
    if (this.adminEmails.includes(email)) {
      window.location.href = '/admin/dashboard.html';
      localStorage.setItem('user_role', 'admin');
    } else {
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_role', 'user');
      this.showUserInterface();
    }
  }

  checkExistingSession() {
    const email = localStorage.getItem('user_email');
    const role = localStorage.getItem('user_role');
    
    if (role === 'admin') {
      window.location.href = '/admin/dashboard.html';
    } else if (email) {
      this.showUserInterface();
    }
  }

  showUserInterface() {
    const authModal = document.getElementById('auth-modal');
    if (authModal) authModal.style.display = 'none';
    
    const email = localStorage.getItem('user_email');
    this.displayWelcomeMessage(email);
  }

  displayWelcomeMessage(email) {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'card';
    welcomeDiv.innerHTML = `
      <h2>Welcome, ${email.split('@')[0]}!</h2>
      <p>You're now part of the MASOLITES community.</p>
      <button class="btn" id="start-mining">Start Mining MAZOL</button>
    `;
    
    document.querySelector('main').prepend(welcomeDiv);
    document.getElementById('start-mining').addEventListener('click', () => {
      alert('Mining started!');
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AuthSystem();
});
