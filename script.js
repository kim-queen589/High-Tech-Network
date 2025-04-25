document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!localStorage.getItem('isLoggedIn') && !window.location.href.includes('login.html') && !window.location.href.includes('register.html') && !window.location.href.includes('home.html')) {
        window.location.href = 'login.html';
        return;
    }

    // DOM Elements
    const menuItems = document.querySelectorAll('.menu-item');
    const backArrow = document.querySelector('.back-arrow');
    const logoutBtn = document.querySelector('.logout-btn');
    const homeBtn = document.querySelector('.home-btn');

    // Event Listeners
    if (menuItems) {
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                const page = this.getAttribute('data-page');
                if (page) {
                    // Remove active class from all menu items
                    menuItems.forEach(menuItem => menuItem.classList.remove('active'));
                    // Add active class to clicked item
                    this.classList.add('active');
                    // Navigate to the page
                    window.location.href = `${page}.html`;
                }
            });
        });
    }

    // Back arrow functionality
    if (backArrow) {
        backArrow.addEventListener('click', function() {
            window.history.back();
        });
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    // Home button functionality
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }

    // Update user information if logged in
    updateUserInfo();

    function updateUserInfo() {
        const userNameElement = document.querySelector('.user-name');
        const userRoleElement = document.querySelector('.user-role');
        const profileImg = document.querySelector('.profile-img');

        if (userNameElement && userRoleElement) {
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            
            // Update user name
            if (userData.profile) {
                userNameElement.textContent = `${userData.profile.firstName || ''} ${userData.profile.lastName || ''}`;
            }

            // Update user role
            userRoleElement.textContent = userData.rank || 'Member';

            // Update profile picture
            if (profileImg && userData.profile?.picture) {
                profileImg.src = userData.profile.picture;
            }
        }
    }
});

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

// Helper function for floating labels
function addFloatingLabelEffect() {
    const inputs = document.querySelectorAll('.form-group input:not([type="checkbox"])');
    inputs.forEach(input => {
        if (input.value) {
            input.classList.add('has-value');
        }

        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    });
} 