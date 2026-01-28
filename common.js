// common.js - загальні функції для всіх сторінок

// Завантаження поточного користувача
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
        return null;
    }
}

// Перевірка авторизації
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Оновлення навігації (викликати на кожній сторінці)
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

// Функція для виходу
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Функція для перевірки авторизації перед дією
function requireAuth(callback) {
    if (!isAuthenticated()) {
        if (confirm('Для цієї дії необхідно увійти в систему. Перейти на сторінку входу?')) {
            window.location.href = 'auth.html';
        }
        return false;
    }
    return callback();
}

// Функція для додавання до бажаного
function addToWishlist(tourId, tourData) {
    if (!requireAuth(() => true)) return false;
    
    const user = getCurrentUser();
    const users = JSON.parse(localStorage.getItem('wineTourismUsers')) || [];
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) return false;
    
    // Перевірка наявності вже в бажаному
    const exists = users[userIndex].wishlist.some(item => item.id === tourId);
    if (exists) {
        alert('Цей тур вже у вашому списку бажаного');
        return false;
    }
    
    // Додавання
    users[userIndex].wishlist.push({
        id: tourId,
        ...tourData,
        addedAt: new Date().toISOString()
    });
    
    // Оновлення поточного користувача
    localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    localStorage.setItem('wineTourismUsers', JSON.stringify(users));
    
    return true;
}

// Завантаження списку бажаного
function getWishlist() {
    if (!isAuthenticated()) return [];
    const user = getCurrentUser();
    return user.wishlist || [];
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();

    // Отримання поточного користувача
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
        return null;
    }
}

// Перевірка авторизації
function isAuthenticated() {
    return getCurrentUser() !== null;
}

// Вихід з системи
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ========== ФУНКЦІЇ БАЖАНОГО ==========

// Отримання списку бажаного
function getWishlist() {
    const user = getCurrentUser();
    return user ? (user.wishlist || []) : [];
}

// Перевірка чи тур вже в бажаному
function isInWishlist(tourId) {
    const wishlist = getWishlist();
    return wishlist.some(item => item.id === tourId);
}

// Додавання до бажаного
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
    
    // Перевірка чи тур вже в бажаному
    if (isInWishlist(tourId)) {
        showNotification('Цей тур вже у вашому списку бажаного', 'info');
        return false;
    }
    
    // Додавання туру до бажаного
    users[userIndex].wishlist = users[userIndex].wishlist || [];
    users[userIndex].wishlist.push({
        id: tourId,
        ...tourData,
        addedAt: new Date().toISOString()
    });
    
    // Оновлення поточного користувача
    currentUser.wishlist = users[userIndex].wishlist;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('wineTourismUsers', JSON.stringify(users));
    
    showNotification('Тур додано до бажаного!', 'success');
    
    // Оновлюємо кнопки на сторінці
    if (typeof updateWishlistButtons === 'function') {
        updateWishlistButtons();
    }
    
    return true;
}

// Видалення з бажаного
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
    
    // Видалення туру з бажаного
    users[userIndex].wishlist = users[userIndex].wishlist.filter(item => item.id !== tourId);
    
    // Оновлення поточного користувача
    currentUser.wishlist = users[userIndex].wishlist;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('wineTourismUsers', JSON.stringify(users));
    
    showNotification('Тур видалено з бажаного', 'success');
    
    // Оновлюємо кнопки на сторінці
    if (typeof updateWishlistButtons === 'function') {
        updateWishlistButtons();
    }
    
    return true;
}

// ========== СПОВІЩЕННЯ ==========

// Функція для показу сповіщень
function showNotification(message, type = 'info') {
    // Спочатку спробуємо знайти існуюче сповіщення
    let notification = document.getElementById('global-notification');
    
    // Якщо немає - створимо
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
        
        // Додаємо CSS анімації
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
    
    // Встановлюємо текст та стиль
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
    
    // Автоматично ховаємо сповіщення через 3 секунди
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.style.animation = '';
        }, 300);
    }, 3000);
}

// ========== ОНОВЛЕННЯ НАВІГАЦІЇ ==========

// Функція для оновлення навігації на всіх сторінках
function updateNavigation() {
    const currentUser = getCurrentUser();
    
    // Оновлюємо лінк Вхід/Кабінет
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
    
    // Оновлюємо відображення імені користувача (якщо є відповідний елемент)
    const userNameElement = document.getElementById('user-name');
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.name;
        userNameElement.style.display = 'inline';
    }
}

// ========== ПЕРЕВІРКА ДОСТУПУ ==========

// Функція для перевірки доступу до сторінки
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

// ========== ЗАГАЛЬНІ ФУНКЦІЇ ==========

// Функція для форматування дати
function formatDate(dateString) {
    if (!dateString) return 'Н/Д';
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Функція для форматування ціни
function formatPrice(price) {
    return price.toLocaleString('uk-UA') + ' грн';
}

// ========== ІНІЦІАЛІЗАЦІЯ ==========

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    // Оновлюємо навігацію
    updateNavigation();
    
    // Додаємо обробники для кнопок виходу
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Ви дійсно хочете вийти з системи?')) {
                logout();
            }
        });
    });
    
    // Перевіряємо доступ до сторінки (якщо потрібно)
    const requireAuth = document.body.hasAttribute('data-require-auth');
    if (requireAuth) {
        checkPageAccess(true);
    }
});

// Робимо функції глобально доступними
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
window.logout = logout;
window.getWishlist = getWishlist;
window.isInWishlist = isInWishlist;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.showNotification = showNotification;
});