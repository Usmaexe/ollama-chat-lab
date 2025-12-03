// Initialize Icons
lucide.createIcons();

// DOM Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin = document.getElementById('switchToLogin');
const loginError = document.getElementById('loginError');
const signupError = document.getElementById('signupError');

// Switch between login and signup
switchToSignup.addEventListener('click', () => {
    loginForm.style.display = 'none';
    switchToSignup.style.display = 'none';
    signupForm.style.display = 'flex';
    switchToLogin.style.display = 'block';
    document.querySelector('.auth-header p').textContent = 'Create your account to get started.';
    clearErrors();
});

switchToLogin.addEventListener('click', () => {
    signupForm.style.display = 'none';
    switchToLogin.style.display = 'none';
    loginForm.style.display = 'flex';
    switchToSignup.style.display = 'block';
    document.querySelector('.auth-header p').textContent = 'Welcome back! Please sign in to continue.';
    clearErrors();
});

// Handle Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (!email || !password) {
        showError(loginError, 'Please fill in all fields');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user) {
        showError(loginError, 'Account not found. Please sign up first.');
        return;
    }
    
    if (user.password !== password) {
        showError(loginError, 'Incorrect password. Please try again.');
        return;
    }
    
    // Login successful
    const session = {
        userId: user.id,
        email: user.email,
        name: user.name,
        loginTime: Date.now(),
        rememberMe: rememberMe
    };
    
    if (rememberMe) {
        localStorage.setItem('session', JSON.stringify(session));
    } else {
        sessionStorage.setItem('session', JSON.stringify(session));
    }
    
    // Show loading state
    const submitBtn = loginForm.querySelector('.btn-primary');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Redirect to chat after short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
});

// Handle Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showError(signupError, 'Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        showError(signupError, 'Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        showError(signupError, 'Passwords do not match');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError(signupError, 'Please enter a valid email address');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
        showError(signupError, 'An account with this email already exists');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In production, this should be hashed
        createdAt: Date.now()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    const session = {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        loginTime: Date.now(),
        rememberMe: true
    };
    
    localStorage.setItem('session', JSON.stringify(session));
    
    // Show loading state
    const submitBtn = signupForm.querySelector('.btn-primary');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Redirect to chat
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
});

// Helper Functions
function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
    
    setTimeout(() => {
        element.classList.remove('show');
    }, 5000);
}

function clearErrors() {
    loginError.classList.remove('show');
    signupError.classList.remove('show');
    loginError.textContent = '';
    signupError.textContent = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check if already logged in
function checkSession() {
    const session = localStorage.getItem('session') || sessionStorage.getItem('session');
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            // Check if session is still valid (24 hours for remember me, 1 hour for session)
            const maxAge = sessionData.rememberMe ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
            if (Date.now() - sessionData.loginTime < maxAge) {
                window.location.href = 'index.html';
            } else {
                // Session expired
                localStorage.removeItem('session');
                sessionStorage.removeItem('session');
            }
        } catch (e) {
            console.error('Invalid session data');
        }
    }
}

// Check session on page load
checkSession();
