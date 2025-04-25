document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();

    // Event Listeners
    setupEventListeners();

    // Handle back button
    window.addEventListener('popstate', function(e) {
        const page = e.state ? e.state.page : 'home';
        navigateToPage(page, true);
    });
});

function initializeApp() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Get current page from URL hash or default to home
    const hash = window.location.hash.slice(1) || 'home';
    
    if (isLoggedIn) {
        // If logged in, show dashboard for home/login/register
        if (['home', 'login', 'register'].includes(hash)) {
            navigateToPage('dashboard');
        } else {
            navigateToPage(hash);
        }
        updateUserInfo();
        updateDashboardStats();
    } else {
        // If not logged in, only allow home/login/register
        if (!['home', 'login', 'register'].includes(hash)) {
            navigateToPage('home');
        } else {
            navigateToPage(hash);
        }
    }
}

function setupEventListeners() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Registration Form
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', handleRegistration);
    }

    // Menu Items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                createPageFiles(page);
                navigateToPage(page);
            }
        });
    });

    // Back Arrow
    const backArrow = document.querySelector('.back-arrow');
    if (backArrow) {
        backArrow.addEventListener('click', () => {
            window.history.back();
        });
    }

    // Edit Profile Button
    const editProfileBtn = document.querySelector('.edit-profile');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => navigateToPage('settings'));
    }

    // Home Button
    const homeBtn = document.querySelector('.home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => navigateToPage('home'));
    }

    // Logout Button
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

function navigateToPage(pageId, isBackNavigation = false) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    // Check if user is trying to access protected pages
    if (!isLoggedIn && !['home', 'login', 'register'].includes(pageId)) {
        navigateToPage('login');
        return;
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    // Show selected page
    const page = document.getElementById(pageId + '-page');
    if (page) {
        page.style.display = 'block';
    }

    // Update menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        if (item.getAttribute('data-page') === pageId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update URL and history
    if (!isBackNavigation) {
        window.history.pushState({ page: pageId }, '', `#${pageId}`);
    }

    // Update user info and stats if on dashboard
    if (pageId === 'dashboard') {
        updateUserInfo();
        updateDashboardStats();
    }
}

function handleLogin(e) {
    e.preventDefault();

    const userName = document.getElementById('userName').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Get stored user data
    const userData = JSON.parse(localStorage.getItem('userData'));

    // Check if user exists and password matches
    if (userData && userData.userName === userName && userData.password === password) {
        localStorage.setItem('isLoggedIn', 'true');
        if (remember) {
            localStorage.setItem('currentUser', JSON.stringify(userData));
        }
        navigateToPage('dashboard');
        showNotification('Login successful!');
    } else {
        showNotification('Invalid username or password', 'error');
    }
}

function handleRegistration(e) {
    e.preventDefault();

    // Get form values
    const formData = {
        sponsorId: document.getElementById('sponsorId').value,
        registrationCode: document.getElementById('registrationCode').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        pin: document.getElementById('pin').value,
        userName: document.getElementById('registerUserName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('registerPassword').value,
        repeatPassword: document.getElementById('repeatPassword').value,
        phone: document.getElementById('phone').value,
        terms: document.getElementById('terms').checked,
        joinDate: new Date().toISOString(),
        rank: 'Member',
        availableBalance: 0,
        withdrawableBalance: 0,
        trainingBonus: 0,
        totalInvested: 0,
        totalPoints: 0,
        directReferrals: 0,
        indirectReferrals: 0,
        totalEarnings: 0
    };

    // Validate registration code
    if (formData.registrationCode !== '09@163#eman') {
        showNotification('Invalid registration code!', 'error');
        document.getElementById('registrationCode').value = '';
        return;
    }

    // Validate passwords match
    if (formData.password !== formData.repeatPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    // Validate PIN
    if (formData.pin.length !== 4 || isNaN(formData.pin)) {
        showNotification('PIN must be 4 digits', 'error');
        return;
    }

    // Validate terms
    if (!formData.terms) {
        showNotification('Please agree to the terms and conditions', 'error');
        return;
    }

    // Store user data
    localStorage.setItem('userData', JSON.stringify(formData));
    showNotification('Registration successful!');
    navigateToPage('login');
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    navigateToPage('home');
    showNotification('Logged out successfully');
}

function updateUserInfo() {
    const userNameElement = document.querySelector('.user-name');
    const userRoleElement = document.querySelector('.user-role');
    const profileImg = document.querySelector('.profile-img');
    const largeProfileImg = document.querySelector('.large-profile-img');

    if (userNameElement && userRoleElement) {
        const userData = JSON.parse(localStorage.getItem('userData')) || {};
        
        // Update user name
        const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
        userNameElement.textContent = fullName || userData.userName || 'User Name';

        // Update user role
        userRoleElement.textContent = userData.rank || 'Member';

        // Update profile pictures
        if (profileImg && userData.profile?.picture) {
            profileImg.src = userData.profile.picture;
        }
        if (largeProfileImg && userData.profile?.picture) {
            largeProfileImg.src = userData.profile.picture;
        }
    }
}

function updateDashboardStats() {
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Update balance cards
    document.getElementById('availableBalance').textContent = formatCurrency(userData.availableBalance || 0);
    document.getElementById('withdrawableBalance').textContent = formatCurrency(userData.withdrawableBalance || 0);
    document.getElementById('trainingBonus').textContent = formatCurrency(userData.trainingBonus || 0);
    document.getElementById('totalInvested').textContent = formatCurrency(userData.totalInvested || 0);

    // Update stats
    document.getElementById('totalPoints').textContent = userData.totalPoints || 0;
    document.getElementById('directReferrals').textContent = userData.directReferrals || 0;
    document.getElementById('indirectReferrals').textContent = userData.indirectReferrals || 0;

    // Update info cards
    document.getElementById('userRank').textContent = userData.rank || 'Member';
    document.getElementById('memberSince').textContent = formatDate(userData.joinDate || new Date());
    document.getElementById('totalEarnings').textContent = formatCurrency(userData.totalEarnings || 0);
    document.getElementById('sponsorName').textContent = userData.sponsorId || 'Admin';
}

// Helper Functions
function formatCurrency(amount) {
    return Number(amount).toLocaleString();
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
    });
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function createPageFiles(page) {
    const pageData = {
        'invest': {
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invest - High-Tech Network</title>
    <link rel="stylesheet" href="app.css">
    <link rel="stylesheet" href="invest.css">
</head>
<body>
    <div class="container">
        <!-- Sidebar and content will be here -->
    </div>
    <script src="app.js"></script>
    <script src="invest.js"></script>
</body>
</html>`,
            js: `document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const investmentPlans = document.querySelectorAll('.investment-plan');
    const investButton = document.getElementById('investButton');
    const amountInput = document.getElementById('investmentAmount');

    // Event Listeners
    investmentPlans.forEach(plan => {
        plan.addEventListener('click', () => selectPlan(plan));
    });

    investButton.addEventListener('click', handleInvestment);

    function selectPlan(plan) {
        // Remove active class from all plans
        investmentPlans.forEach(p => p.classList.remove('active'));
        // Add active class to selected plan
        plan.classList.add('active');
    }

    function handleInvestment() {
        const selectedPlan = document.querySelector('.investment-plan.active');
        const amount = amountInput.value;

        if (!selectedPlan || !amount) {
            showNotification('Please select a plan and enter amount', 'error');
            return;
        }

        // Process investment
        // Add your investment logic here
    }
});`,
            css: `.investment-plans {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.investment-plan {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: all 0.3s ease;
}

.investment-plan:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.investment-plan.active {
    border: 2px solid var(--primary-color);
}`
        },
        'withdraw': {
            html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Withdraw - High-Tech Network</title>
    <link rel="stylesheet" href="app.css">
    <link rel="stylesheet" href="withdraw.css">
</head>
<body>
    <div class="container">
        <!-- Sidebar and content will be here -->
    </div>
    <script src="app.js"></script>
    <script src="withdraw.js"></script>
</body>
</html>`,
            js: `document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const withdrawForm = document.getElementById('withdrawForm');
    const amountInput = document.getElementById('withdrawAmount');
    const methodSelect = document.getElementById('withdrawMethod');

    // Event Listeners
    withdrawForm.addEventListener('submit', handleWithdraw);

    function handleWithdraw(e) {
        e.preventDefault();
        const amount = amountInput.value;
        const method = methodSelect.value;

        if (!amount || !method) {
            showNotification('Please fill all fields', 'error');
            return;
        }

        // Process withdrawal
        // Add your withdrawal logic here
    }
});`,
            css: `.withdraw-methods {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.withdraw-method {
    background: white;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.withdraw-form {
    max-width: 500px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}`
        }
        // Add more page templates as needed
    };

    if (pageData[page]) {
        // Create HTML file
        const htmlContent = pageData[page].html;
        const htmlFile = new Blob([htmlContent], { type: 'text/html' });
        const htmlUrl = URL.createObjectURL(htmlFile);
        const htmlLink = document.createElement('a');
        htmlLink.href = htmlUrl;
        htmlLink.download = `${page}.html`;
        htmlLink.click();

        // Create JS file
        const jsContent = pageData[page].js;
        const jsFile = new Blob([jsContent], { type: 'text/javascript' });
        const jsUrl = URL.createObjectURL(jsFile);
        const jsLink = document.createElement('a');
        jsLink.href = jsUrl;
        jsLink.download = `${page}.js`;
        jsLink.click();

        // Create CSS file
        const cssContent = pageData[page].css;
        const cssFile = new Blob([cssContent], { type: 'text/css' });
        const cssUrl = URL.createObjectURL(cssFile);
        const cssLink = document.createElement('a');
        cssLink.href = cssUrl;
        cssLink.download = `${page}.css`;
        cssLink.click();

        showNotification(`Created files for ${page} page`, 'success');
    }
} 