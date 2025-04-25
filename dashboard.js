document.addEventListener('DOMContentLoaded', function() {
    // Update dashboard stats when the page loads
    updateDashboardStats();

    // Add event listener for edit profile button
    const editProfileBtn = document.querySelector('.edit-profile');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            window.location.hash = 'settings';
        });
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

        // Update profile picture if available
        const profilePic = document.querySelector('.large-profile-img');
        if (profilePic && userData.profile?.picture) {
            profilePic.src = userData.profile.picture;
        }
    }

    function formatCurrency(amount) {
        return Number(amount).toLocaleString();
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short'
        });
    }
}); 