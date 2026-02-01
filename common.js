function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
        return null;
    }
}

function isAuthenticated() {
    return getCurrentUser() !== null;
}

function updateNavigation() {
    const authLink = document.getElementById('auth-link');
    const authText = document.getElementById('auth-text');
    
    if (authLink && authText) {
        if (isAuthenticated()) {
            authLink.href = 'profile.html';
            authText.textContent = 'Кабінет';
        } else {
            authLink.href = 'auth.html';
            authText.textContent = 'Вхід';
        }
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function requireAuth(callback) {
    if (!isAuthenticated()) {
        if (confirm('Для цієї дії необхідно увійти в систему. Перейти на сторінку входу?')) {
            window.location.href = 'auth.html';
        }
        return false;
    }
    return callback();
}

function addToWishlist(tourId, tourData) {
    if (!requireAuth(() => true)) return false;
    
    const user = getCurrentUser();
    const users = JSON.parse(localStorage.getItem('wineTourismUsers')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) return false;
    

    const exists = users[userIndex].wishlist.some(item => item.id === tourId);
    if (exists) {
        alert('Цей тур вже у вашому списку бажаного');
        return false;
    }
    
    users[userIndex].wishlist.push({
        id: tourId,
        ...tourData,
        addedAt: new Date().toISOString()
    });
    
    localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    localStorage.setItem('wineTourismUsers', JSON.stringify(users));
    
    return true;
}

function getWishlist() {
    if (!isAuthenticated()) return [];
    const user = getCurrentUser();
    return user.wishlist || [];
}

document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
        return null;
    }
}

function isAuthenticated() {
    return getCurrentUser() !== null;
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function getWishlist() {
    const user = getCurrentUser();
    return user ? (user.wishlist || []) : [];
}

function isInWishlist(tourId) {
    const wishlist = getWishlist();
    return wishlist.some(item => item.id === tourId);
}

function addToWishlist(tourId, tourData) {
    if (!isAuthenticated()) {
        showNotification('Будь ласка, увійдіть в систему для додавання турів до бажаного', 'error');
        return false;
    }
    
    const users = JSON.parse(localStorage.getItem('wineTourismUsers')) || [];
    const currentUser = getCurrentUser();
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex === -1) {
        showNotification('Помилка: користувача не знайдено', 'error');
        return false;
    }
    
    if (isInWishlist(tourId)) {
        showNotification('Цей тур вже у вашому списку бажаного', 'info');
        return false;
    }
    
    users[userIndex].wishlist = users[userIndex].wishlist || [];
    users[userIndex].wishlist.push({
        id: tourId,
        ...tourData,
        addedAt: new Date().toISOString()
    });
    
    currentUser.wishlist = users[userIndex].wishlist;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('wineTourismUsers', JSON.stringify(users));
    
    showNotification('Тур додано до бажаного!', 'success');
    
    if (typeof updateWishlistButtons === 'function') {
        updateWishlistButtons();
    }
    
    return true;
}

function removeFromWishlist(tourId) {
    if (!isAuthenticated()) {
        return false;
    }
    
    const users = JSON.parse(localStorage.getItem('wineTourismUsers')) || [];
    const currentUser = getCurrentUser();
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex === -1) {
        return false;
    }
    
    users[userIndex].wishlist = users[userIndex].wishlist.filter(item => item.id !== tourId);
    
    currentUser.wishlist = users[userIndex].wishlist;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('wineTourismUsers', JSON.stringify(users));
    
    showNotification('Тур видалено з бажаного', 'success');
    
    if (typeof updateWishlistButtons === 'function') {
        updateWishlistButtons();
    }
    
    return true;
}


function showNotification(message, type = 'info') {
    let notification = document.getElementById('global-notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'global-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            display: none;
        `;
        document.body.appendChild(notification);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    notification.textContent = message;
    notification.className = '';
    
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #c0392b, #e74c3c)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #f39c12, #f1c40f)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, var(--wine-gold), var(--wine-terracotta))';
    }
    
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.style.animation = '';
        }, 300);
    }, 3000);
}

function updateNavigation() {
    const currentUser = getCurrentUser();
    
    const authLink = document.getElementById('auth-link');
    const authIcon = document.getElementById('auth-icon');
    const authText = document.getElementById('auth-text');
    
    if (authLink && authIcon && authText) {
        if (currentUser) {
            authLink.href = 'profile.html';
            authIcon.className = 'fas fa-user-circle';
            authText.textContent = 'Кабінет';
        } else {
            authLink.href = 'auth.html';
            authIcon.className = 'fas fa-user';
            authText.textContent = 'Вхід';
        }
    }
    
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.name;
        userNameElement.style.display = 'inline';
    }
}

function checkPageAccess(requireAuth = false) {
    if (requireAuth && !isAuthenticated()) {
        showNotification('Для доступу до цієї сторінки необхідно увійти в систему', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return false;
    }
    return true;
}

function formatDate(dateString) {
    if (!dateString) return 'Н/Д';
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function formatPrice(price) {
    return price.toLocaleString('uk-UA') + ' грн';
}


document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
    
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Ви дійсно хочете вийти з системи?')) {
                logout();
            }
        });
    });
    
    const requireAuth = document.body.hasAttribute('data-require-auth');
    if (requireAuth) {
        checkPageAccess(true);
    }
});

window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
window.logout = logout;
window.getWishlist = getWishlist;
window.isInWishlist = isInWishlist;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.showNotification = showNotification;

});
