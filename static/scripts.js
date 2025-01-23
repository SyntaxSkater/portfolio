// Admin Login with Google OAuth
const loginButton = document.getElementById('login-button');
const adminLinks = document.getElementById('admin-links');

// Fetch client_id from backend endpoint
fetch('http://localhost:5000/api/env') // Explicitly point to the backend API
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        initializeGoogleOAuth(data.client_id);
    })
    .catch((err) => {
        console.error('Failed to load client_id:', err);
        alert('Google OAuth initialization failed.');
    });

// Load Google OAuth API
function initializeGoogleOAuth(clientId) {
    gapi.load('auth2', () => {
        gapi.auth2.init({
            client_id: clientId,
        });
    });
}

loginButton.addEventListener('click', () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then((user) => {
        const email = user.getBasicProfile().getEmail();
        if (email === 'c63513389@gmail.com') {
            alert('Login successful! Welcome, Admin.');
            loginButton.style.display = 'none';
            adminLinks.style.display = 'block';
            document.body.classList.add('admin-view'); // Toggle admin view class
            localStorage.setItem('admin-logged-in', 'true'); // Remember admin login across sessions
        } else {
            alert('Access denied. Admin only.');
            auth2.signOut(); // Sign out unauthorized users
        }
    }).catch((err) => {
        console.error('Google Sign-In Error:', err);
        alert('Login failed. Please try again.');
    });
});

// Check admin login status on page load
if (localStorage.getItem('admin-logged-in') === 'true') {
    document.body.classList.add('admin-view');
    loginButton.style.display = 'none';
    adminLinks.style.display = 'block';
}

// Improved toggles for user/admin view
const adminViewToggle = document.getElementById('toggle-admin-view');
adminViewToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.add('admin-view');
        localStorage.setItem('admin-view', 'true');
    } else {
        document.body.classList.remove('admin-view');
        localStorage.setItem('admin-view', 'false');
    }
});

// Logout Functionality
const logoutButton = document.getElementById('logout-button');
logoutButton.addEventListener('click', () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        alert('You have been logged out.');
        localStorage.removeItem('admin-logged-in');
        document.body.classList.remove('admin-view');
        loginButton.style.display = 'block';
        adminLinks.style.display = 'none';
    });
});

// Analytics Report Download
const downloadAnalyticsButton = document.getElementById('download-analytics');
downloadAnalyticsButton.addEventListener('click', () => {
    alert('Your analytics report is being prepared for download.');
    const analyticsData = 'Analytics Report\n\nPage Views: 1500\nUnique Visitors: 500\nAverage Time on Site: 3 minutes';
    const blob = new Blob([analyticsData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'analytics_report.txt';
    link.click();
});

// Dynamic Resume Popup
const viewResumeButton = document.getElementById('view-resume');
const resumePopup = document.getElementById('resume-popup');
const closeResumeButton = document.getElementById('close-resume');

viewResumeButton.addEventListener('click', () => {
    resumePopup.classList.add('active');
});

closeResumeButton.addEventListener('click', () => {
    resumePopup.classList.remove('active');
});

// Fetch GitHub Projects
const githubProjectsList = document.getElementById('github-projects');
fetch('https://api.github.com/users/SyntaxSkater/repos')
    .then((response) => response.json())
    .then((repos) => {
        if (repos.length === 0) {
            githubProjectsList.innerHTML = '<p>No projects available. Please check back later.</p>';
        } else {
            repos.forEach((repo) => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description provided.'}</p>
                    <a href="${repo.html_url}" target="_blank" rel="noopener">View on GitHub</a>
                `;
                githubProjectsList.appendChild(card);
            });
        }
    });

// Fetch Leetcode Challenges
const leetcodeChallengesList = document.getElementById('leetcode-challenges');
fetch('https://leetcode-stats-api.herokuapp.com/SyntaxSkater')
    .then((response) => response.json())
    .then((data) => {
        if (!data.solved) {
            leetcodeChallengesList.innerHTML = '<p>No challenges completed yet. Stay tuned!</p>';
        } else {
            const summary = `
                <h3>Leetcode Progress</h3>
                <p>Solved: ${data.totalSolved} / ${data.totalQuestions}</p>
                <p>Easy: ${data.easySolved} / ${data.totalEasy}</p>
                <p>Medium: ${data.mediumSolved} / ${data.totalMedium}</p>
                <p>Hard: ${data.hardSolved} / ${data.totalHard}</p>
            `;
            leetcodeChallengesList.innerHTML = summary;
        }
    });

// Scroll-to-Top Button
const scrollTopButton = document.createElement('button');
scrollTopButton.innerText = '↑';
scrollTopButton.classList.add('scroll-to-top');
document.body.appendChild(scrollTopButton);
scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopButton.style.display = 'block';
    } else {
        scrollTopButton.style.display = 'none';
    }
});
