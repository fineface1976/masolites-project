// Authentication Module
function initializeAuth() {
    const authForm = document.getElementById('authForm');
    const switchAuthBtn = document.getElementById('switchAuth');
    
    let isLoginMode = true;
    
    // Switch between login/signup
    switchAuthBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        updateAuthUI();
    });
    
    // Form submission
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        if (isLoginMode) {
            handleLogin(email, document.getElementById('password').value);
        } else {
            handleSignup(
                document.getElementById('name').value,
                email,
                document.getElementById('password').value
            );
        }
    });
}

function handleLogin(email, password) {
    // Validate credentials
    const users = JSON.parse(localStorage.getItem('mazol_users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Successful login
        localStorage.setItem('mazol_user', JSON.stringify(user));
        location.reload();
    } else {
        alert('Invalid credentials');
    }
}

function handleSignup(name, email, password) {
    // Validate email uniqueness
    const users = JSON.parse(localStorage.getItem('mazol_users')) || [];
    
    if (users.some(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateId(),
        name,
        email,
        password,
        membership: 'free',
        joined: new Date().toISOString(),
        mazol: 0
    };
    
    users.push(newUser);
    localStorage.setItem('mazol_users', JSON.stringify(users));
    localStorage.setItem('mazol_user', JSON.stringify(newUser));
    
    alert('Welcome to MASOLITES!');
    location.reload();
