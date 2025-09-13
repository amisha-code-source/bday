// Database simulation using localStorage
class BirthdayWishesDB {
    constructor() {
        this.storageKey = 'birthdayWishes';
        this.init();
    }

    init() {
        // Initialize database if it doesn't exist
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
    }

    // Add a new wish to the database
    addWish(name, wish) {
        const wishes = this.getAllWishes();
        const newWish = {
            id: Date.now().toString(),
            name: name.trim(),
            wish: wish.trim(),
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        wishes.unshift(newWish); // Add to beginning of array
        localStorage.setItem(this.storageKey, JSON.stringify(wishes));
        return newWish;
    }

    // Get all wishes from the database
    getAllWishes() {
        const wishes = localStorage.getItem(this.storageKey);
        return wishes ? JSON.parse(wishes) : [];
    }

    // Delete a wish by ID
    deleteWish(id) {
        const wishes = this.getAllWishes();
        const filteredWishes = wishes.filter(wish => wish.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredWishes));
        return filteredWishes;
    }

    // Clear all wishes
    clearAllWishes() {
        localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
}

// Initialize database
const db = new BirthdayWishesDB();

// Admin configuration
const ADMIN_PASSWORD = 'admin123'; // Change this to your desired admin password
const ADMIN_SESSION_KEY = 'adminLoggedIn';

// DOM elements
const wishForm = document.getElementById('wishForm');
const wishesContainer = document.getElementById('wishesContainer');
const adminLoginSection = document.getElementById('adminLoginSection');
const adminPanel = document.getElementById('adminPanel');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const closeLoginBtn = document.getElementById('closeLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');
const exportBtn = document.getElementById('exportBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const closeAdminBtn = document.getElementById('closeAdminBtn');

// Navigation elements
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');



// ---------------- HEART BACKGROUND ----------------
document.addEventListener("DOMContentLoaded", function () {
    const heartContainer = document.querySelector(".hearts");
  
    function createHeart() {
      const heart = document.createElement("div");
      heart.classList.add("heart");
      heart.innerHTML = "❤️";
  
      heart.style.left = Math.random() * 100 + "vw";
      heart.style.fontSize = Math.random() * 20 + 10 + "px";
      heart.style.animationDuration = Math.random() * 3 + 2 + "s";
  
      heartContainer.appendChild(heart);
  
      setTimeout(() => {
        heart.remove();
      }, 5000);
    }
  
    setInterval(createHeart, 300);
  });

  

// Surprise modal elements
const surpriseBtn = document.getElementById('surpriseBtn');
const surpriseModal = document.getElementById('surpriseModal');
const closeModal = document.querySelector('.close');
const modalImage = document.getElementById('modalImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentImageSpan = document.getElementById('currentImage');
const totalImagesSpan = document.getElementById('totalImages');

// Surprise images array
const surpriseImages = ['mom5.jpg', 'mom6.jpg', 'mom2.jpg', 'mom4.jpg'];
let currentImageIndex = 0;

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Today';
    } else if (diffDays === 2) {
        return 'Yesterday';
    } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

function createWishCard(wish) {
    const card = document.createElement('div');
    card.className = 'wish-card';
    card.innerHTML = `
        <div class="wish-name">
            <i class="fas fa-user"></i>
            ${escapeHtml(wish.name)}
        </div>
        <div class="wish-text">${escapeHtml(wish.wish)}</div>
        <div class="wish-date">${formatDate(wish.date)}</div>
    `;
    
    return card;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showLoading() {
    wishesContainer.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner"></i>
            <p>Loading wishes...</p>
        </div>
    `;
}

function showEmptyState() {
    wishesContainer.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-birthday-cake"></i>
            <h3>No wishes yet!</h3>
            <p>Be the first to share a birthday wish!</p>
        </div>
    `;
}

function loadWishes() {
    // Only load wishes if admin is logged in
    if (!isAdminLoggedIn()) {
        return;
    }
    
    showLoading();
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        const wishes = db.getAllWishes();
        
        if (wishes.length === 0) {
            showEmptyState();
            return;
        }
        
        wishesContainer.innerHTML = '';
        wishes.forEach(wish => {
            const wishCard = createWishCard(wish);
            wishesContainer.appendChild(wishCard);
        });
    }, 500);
}

function showSuccessMessage(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function showErrorMessage(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Form submission handler
wishForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const wishInput = document.getElementById('wish');
    
    const name = nameInput.value.trim();
    const wish = wishInput.value.trim();
    
    // Validation
    if (!name || !wish) {
        showErrorMessage('Please fill in all fields!');
        return;
    }
    
    if (name.length < 2) {
        showErrorMessage('Name must be at least 2 characters long!');
        return;
    }
    
    if (wish.length < 10) {
        showErrorMessage('Wish must be at least 10 characters long!');
        return;
    }
    
    if (wish.length > 500) {
        showErrorMessage('Wish must be less than 500 characters!');
        return;
    }
    
    try {
        // Add wish to database
        db.addWish(name, wish);
        
        // Show success message
        showSuccessMessage('Your birthday wish has been submitted! It will be reviewed by admin. 🎉');
        
        // Clear form
        wishForm.reset();
        
        // Reload wishes only if admin is logged in
        if (isAdminLoggedIn()) {
            loadWishes();
            updateAdminStats();
        }
        
    } catch (error) {
        console.error('Error adding wish:', error);
        showErrorMessage('Sorry, there was an error adding your wish. Please try again.');
    }
});

// Add some sample data on first visit
function addSampleData() {
    const wishes = db.getAllWishes();
    if (wishes.length === 0) {
        const sampleWishes = [
            {
                name: "Sarah Johnson",
                wish: "Wishing you a year filled with joy, laughter, and all your heart's desires! May this new year of life bring you endless happiness and wonderful memories. Happy Birthday! 🎂✨"
            },
            {
                name: "Mike Chen",
                wish: "Another year older, another year wiser! Hope your special day is as amazing as you are. Here's to celebrating you today and always! 🎉🎈"
            },
            {
                name: "Emily Rodriguez",
                wish: "Birthdays are nature's way of telling us to eat more cake! Wishing you a day filled with love, laughter, and lots of delicious treats. Have a fantastic birthday! 🍰🎁"
            }
        ];
        
        sampleWishes.forEach(sampleWish => {
            db.addWish(sampleWish.name, sampleWish.wish);
        });
    }
}

// Admin functions
function isAdminLoggedIn() {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

function loginAdmin(password) {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
        showAdminPanel();
        showSuccessMessage('Admin login successful!');
        return true;
    } else {
        showErrorMessage('Invalid admin password!');
        return false;
    }
}

function logoutAdmin() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    showLoginSection();
    showSuccessMessage('Logged out successfully!');
}

function showAdminPanel() {
    adminLoginSection.style.display = 'none';
    adminPanel.style.display = 'block';
    adminLoginBtn.style.display = 'none';
    loadWishes();
    updateAdminStats();
}

function showLoginSection() {
    adminLoginSection.style.display = 'none';
    adminPanel.style.display = 'none';
    adminLoginBtn.style.display = 'flex';
}

function showAdminLogin() {
    adminLoginSection.style.display = 'block';
    adminLoginBtn.style.display = 'none';
}

function hideAdminLogin() {
    adminLoginSection.style.display = 'none';
    adminLoginBtn.style.display = 'flex';
}

function updateAdminStats() {
    const wishes = db.getAllWishes();
    document.getElementById('totalWishes').textContent = wishes.length;
}

// Admin event listeners
adminLoginBtn.addEventListener('click', showAdminLogin);

closeLoginBtn.addEventListener('click', hideAdminLogin);

adminLoginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    if (loginAdmin(password)) {
        adminLoginForm.reset();
    }
});

logoutBtn.addEventListener('click', logoutAdmin);

refreshBtn.addEventListener('click', function() {
    loadWishes();
    updateAdminStats();
    showSuccessMessage('Data refreshed!');
});

exportBtn.addEventListener('click', function() {
    try {
        db.exportData();
        showSuccessMessage('Data exported successfully!');
    } catch (error) {
        showErrorMessage('Error exporting data. Please try again.');
    }
});

clearAllBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all wishes? This action cannot be undone!')) {
        db.clearAllWishes();
        loadWishes();
        updateAdminStats();
        showSuccessMessage('All wishes have been cleared!');
    }
});

closeAdminBtn.addEventListener('click', function() {
    adminPanel.style.display = 'none';
    adminLoginSection.style.display = 'block';
});

// Navigation functions
function showSection(sectionId) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Close mobile menu
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    
    // Load wishes if navigating to wishes section
    if (sectionId === 'wishes') {
        if (isAdminLoggedIn()) {
            showAdminPanel();
        } else {
            showLoginSection();
        }
    }
}

// Surprise modal functions
function openSurpriseModal() {
    surpriseModal.style.display = 'block';
    currentImageIndex = 3;
    updateModalImage();
    createConfetti();
}

function closeSurpriseModal() {
    surpriseModal.style.display = 'none';
}

function updateModalImage() {
    modalImage.src = surpriseImages[currentImageIndex];
    currentImageSpan.textContent = currentImageIndex + 1;
    totalImagesSpan.textContent = surpriseImages.length;
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % surpriseImages.length;
    updateModalImage();
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + surpriseImages.length) % surpriseImages.length;
    updateModalImage();
}

// Event listeners for navigation
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const sectionId = this.getAttribute('data-section');
        showSection(sectionId);
    });
});

// Hamburger menu toggle
hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Surprise modal event listeners
surpriseBtn.addEventListener('click', openSurpriseModal);
closeModal.addEventListener('click', closeSurpriseModal);
nextBtn.addEventListener('click', showNextImage);
prevBtn.addEventListener('click', showPrevImage);

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === surpriseModal) {
        closeSurpriseModal();
    }
    
    // Close admin login when clicking outside
    if (e.target === adminLoginSection) {
        hideAdminLogin();
    }
});

// Keyboard navigation for surprise modal
document.addEventListener('keydown', function(e) {
    if (surpriseModal.style.display === 'block') {
        if (e.key === 'Escape') {
            closeSurpriseModal();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Show home section by default
    showSection('home');
    
    // Check if admin is already logged in
    if (isAdminLoggedIn()) {
        showAdminPanel();
    } else {
        showLoginSection();
    }
    
    // Add sample data if this is the first visit
    addSampleData();
    
    // Add some interactive effects
    const submitBtn = document.querySelector('.submit-btn');
    
    submitBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    submitBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
    
    // Add floating animation to wish cards
    const style = document.createElement('style');
    style.textContent = `
        .wish-card {
            animation: floatIn 0.6s ease-out;
        }
        
        @keyframes floatIn {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (document.activeElement.tagName !== 'TEXTAREA') {
            wishForm.dispatchEvent(new Event('submit'));
        }
    }
});

// Add some confetti effect on form submission
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            z-index: 1000;
            pointer-events: none;
            animation: confettiFall 3s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            document.body.removeChild(confetti);
        }, 3000);
    }
    
    // Add confetti animation CSS
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(-100vh) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

l

// Modify form submission to include confetti
const originalSubmitHandler = wishForm.onsubmit;
wishForm.addEventListener('submit', function(e) {
    // Let the original handler run first
    setTimeout(() => {
        // Check if form was successfully submitted (no error messages)
        const errorNotifications = document.querySelectorAll('[style*="background: linear-gradient(135deg, #ff6b6b"]');
        if (errorNotifications.length === 0) {
            createConfetti();
        }
    }, 100);
});


	// <![CDATA[  <-- For SVG support
	if ('WebSocket' in window) {
		(function () {
			function refreshCSS() {
				var sheets = [].slice.call(document.getElementsByTagName("link"));
				var head = document.getElementsByTagName("head")[0];
				for (var i = 0; i < sheets.length; ++i) {
					var elem = sheets[i];
					var parent = elem.parentElement || head;
					parent.removeChild(elem);
					var rel = elem.rel;
					if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
						var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
						elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
					}
					parent.appendChild(elem);
				}
			}
			var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
			var address = protocol + window.location.host + window.location.pathname + '/ws';
			var socket = new WebSocket(address);
			socket.onmessage = function (msg) {
				if (msg.data == 'reload') window.location.reload();
				else if (msg.data == 'refreshcss') refreshCSS();
			};
			if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
				console.log('Live reload enabled.');
				sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
			}
		})();
	}
	else {
		console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
	}
	// ]]>

  
  












