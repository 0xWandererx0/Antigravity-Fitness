/**
 * UI.JS - Kullanıcı Arayüzü Yönetimi
 * 
 * Bu modül tüm DOM manipülasyonlarını ve arayüz güncellemelerini yönetir:
 * - Sayfa geçişleri
 * - Dinamik içerik oluşturma
 * - Modal ve bildirim sistemleri
 * - Progress bar güncellemeleri
 */

// ============================================================================
// SAYFA YÖNETİMİ
// ============================================================================

/**
 * Belirli bir sayfayı gösterir, diğerlerini gizler
 * @param {string} pageId - Gösterilecek sayfa ID'si
 */
function showPage(pageId) {
    // Tüm sayfaları gizle
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => {
        page.classList.remove('active');
    });

    // İstenen sayfayı göster
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Navigation butonlarını güncelle
    updateNavigationButtons(pageId);
}

/**
 * Navigation butonlarının aktif durumunu günceller
 * @param {string} activePage - Aktif sayfa ID'si
 */
function updateNavigationButtons(activePage) {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === activePage) {
            btn.classList.add('active');
        }
    });
}

// ============================================================================
// BİLDİRİM SİSTEMİ
// ============================================================================

/**
 * Toast bildirimi gösterir (otomatik kapanan bildirim)
 * @param {string} message - Mesaj
 * @param {string} type - Tip ('success', 'error', 'info', 'warning')
 * @param {number} duration - Süre (ms)
 */
function showToast(message, type = 'info', duration = 3000) {
    // Toast container'ı oluştur (yoksa)
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    // Toast element oluştur
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    // İkon ekle
    const icon = getToastIcon(type);
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

    // Container'a ekle
    toastContainer.appendChild(toast);

    // Animasyon için timeout
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Belirli süre sonra kaldır
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, duration);
}

/**
 * Toast tip için ikon döndürür
 * @param {string} type - Toast tipi
 * @returns {string} Icon emoji
 */
function getToastIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

// ============================================================================
// MODAL YÖNETİMİ
// ============================================================================

/**
 * Modal açar
 * @param {string} modalId - Modal ID'si
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Scroll'u engelle
    }
}

/**
 * Modal kapatır
 * @param {string} modalId - Modal ID'si
 */
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Scroll'u geri aç
    }
}

/**
 * Tüm modalleri kapatır
 */
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// ============================================================================
// DASHBOARD GÜNCELLEMELERİ
// ============================================================================

/**
 * Dashboard'u tüm bilgilerle günceller
 */
function updateDashboard() {
    const profile = getUserProfile();
    if (!profile) {
        showPage('welcome-page');
        return;
    }

    // Kullanıcı adını göster
    const userName = document.getElementById('user-name');
    if (userName) {
        userName.textContent = profile.name;
    }

    // VKİ ve BMR hesapla
    const bmi = calculateBMI(profile.weight, profile.height);
    const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
    const dailyCalories = calculateDailyCalories(bmr, 'sedentary');

    // VKİ bilgisini göster
    updateBMIDisplay(bmi);

    // Günlük kalori bilgilerini al
    const consumedCalories = getTodayTotalCalories();
    const burnedCalories = getTodayBurnedCalories();
    const netCalories = calculateNetCalories(consumedCalories, burnedCalories);

    // Dashboard kartlarını güncelle
    updateCalorieCards(consumedCalories, burnedCalories, netCalories, dailyCalories);

    // Progress bar'ı güncelle
    updateCalorieProgress(netCalories, dailyCalories);

    // Motivasyon mesajı göster
    updateMotivationalMessage(netCalories, dailyCalories, burnedCalories);

    // Profil sayfasını güncelle
    updateProfilePage(profile, bmi, bmr, dailyCalories);
}

/**
 * VKİ göstergesini günceller
 * @param {number} bmi - VKİ değeri
 */
function updateBMIDisplay(bmi) {
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');

    if (bmiValue) {
        bmiValue.textContent = formatBMI(bmi);
    }

    if (bmiCategory) {
        const category = getBMICategory(bmi);
        bmiCategory.textContent = category.label;
        bmiCategory.style.color = category.color;
    }
}

/**
 * Kalori kartlarını günceller
 */
function updateCalorieCards(consumed, burned, net, target) {
    // Alınan kalori
    const consumedEl = document.getElementById('consumed-calories');
    if (consumedEl) {
        consumedEl.textContent = Math.round(consumed);
    }

    // Yakılan kalori
    const burnedEl = document.getElementById('burned-calories');
    if (burnedEl) {
        burnedEl.textContent = Math.round(burned);
    }

    // Net kalori
    const netEl = document.getElementById('net-calories');
    if (netEl) {
        netEl.textContent = Math.round(net);
    }

    // Hedef kalori
    const targetEl = document.getElementById('target-calories');
    if (targetEl) {
        targetEl.textContent = Math.round(target);
    }
}

/**
 * Kalori progress bar'ını günceller
 */
function updateCalorieProgress(current, target) {
    const progressBar = document.getElementById('calorie-progress-bar');
    const progressText = document.getElementById('calorie-progress-text');

    if (progressBar && progressText) {
        const percentage = calculateCaloriePercentage(current, target);

        // Progress bar genişliği
        progressBar.style.width = `${Math.min(percentage, 100)}%`;

        // Renk ayarla (yeşil -> sarı -> kırmızı)
        if (percentage < 80) {
            progressBar.style.backgroundColor = '#2ecc71'; // Yeşil
        } else if (percentage < 100) {
            progressBar.style.backgroundColor = '#f39c12'; // Sarı
        } else {
            progressBar.style.backgroundColor = '#e74c3c'; // Kırmızı
        }

        // Yüzde yazısı
        progressText.textContent = `${Math.round(percentage)}%`;
    }
}

/**
 * Motivasyon mesajını günceller
 */
function updateMotivationalMessage(netCalories, targetCalories, burnedCalories) {
    const messageEl = document.getElementById('motivational-message');
    if (!messageEl) return;

    let message;
    const difference = Math.abs(netCalories - targetCalories);
    const percentDiff = (difference / targetCalories) * 100;

    // Mesaj seçimi
    if (burnedCalories > 0) {
        // Egzersiz yaptıysa
        message = getRandomMessage(motivationalMessages.exercised);
    } else if (percentDiff < 10) {
        // Hedefe çok yakınsa (%10 içinde)
        message = getRandomMessage(motivationalMessages.onTarget);
    } else if (netCalories < targetCalories - (targetCalories * 0.2)) {
        // Hedefin %20 altındaysa
        message = getRandomMessage(motivationalMessages.underTarget);
    } else if (netCalories > targetCalories + (targetCalories * 0.2)) {
        // Hedefin %20 üstündeyse
        message = getRandomMessage(motivationalMessages.overTarget);
    } else {
        // Varsayılan
        message = getRandomMessage(motivationalMessages.welcome);
    }

    messageEl.textContent = message;
}

/**
 * Array'den rastgele element seçer
 */
function getRandomMessage(messagesArray) {
    return messagesArray[Math.floor(Math.random() * messagesArray.length)];
}

// ============================================================================
// BESLENME SAYFASI GÜNCELLEMELERİ
// ============================================================================

/**
 * Beslenme sayfasını günceller
 */
function updateNutritionPage() {
    const todayMeals = getTodayMeals();

    // Her kategori için yemekleri göster
    ['kahvalti', 'ogle', 'aksam', 'ara_ogun'].forEach(category => {
        const categoryMeals = todayMeals.filter(m => m.category === category);
        renderMealList(category, categoryMeals);
    });

    // Toplam kaloriyi güncelle
    updateNutritionSummary();
}

/**
 * Belirli kategori için yemek listesini render eder
 */
function renderMealList(category, meals) {
    const listEl = document.getElementById(`meals-${category}`);
    if (!listEl) return;

    if (meals.length === 0) {
        listEl.innerHTML = '<p class="empty-message">Henüz yemek eklenmedi</p>';
        return;
    }

    listEl.innerHTML = meals.map(meal => `
        <div class="meal-item" data-id="${meal.id}">
            <div class="meal-info">
                <span class="meal-name">${meal.name}</span>
                <span class="meal-calories">${meal.calories} kcal</span>
            </div>
            <button class="btn-delete" onclick="deleteMealItem(${meal.id})">
                <span>🗑️</span>
            </button>
        </div>
    `).join('');
}

/**
 * Beslenme özet bilgilerini günceller
 */
function updateNutritionSummary() {
    const totalCalories = getTodayTotalCalories();
    const summaryEl = document.getElementById('nutrition-total');

    if (summaryEl) {
        summaryEl.textContent = `Toplam: ${formatCalories(totalCalories)}`;
    }
}

// ============================================================================
// EGZERSİZ SAYFASI GÜNCELLEMELERİ
// ============================================================================

/**
 * Egzersiz sayfasını günceller
 */
function updateExercisePage() {
    const todayExercises = getTodayExercises();
    renderExerciseList(todayExercises);
    updateExerciseSummary();
}

/**
 * Egzersiz listesini render eder
 */
function renderExerciseList(exercises) {
    const listEl = document.getElementById('exercises-list');
    if (!listEl) return;

    if (exercises.length === 0) {
        listEl.innerHTML = '<p class="empty-message">Henüz egzersiz eklenmedi</p>';
        return;
    }

    listEl.innerHTML = exercises.map(ex => `
        <div class="exercise-item" data-id="${ex.id}">
            <div class="exercise-info">
                <span class="exercise-name">${ex.name}</span>
                <span class="exercise-detail">${ex.duration} ${ex.type === 'sure' ? 'dk' : 'tekrar'}</span>
                <span class="exercise-calories">${ex.caloriesBurned} kcal</span>
            </div>
            <button class="btn-delete" onclick="deleteExerciseItem(${ex.id})">
                <span>🗑️</span>
            </button>
        </div>
    `).join('');
}

/**
 * Egzersiz özet bilgilerini günceller
 */
function updateExerciseSummary() {
    const totalBurned = getTodayBurnedCalories();
    const summaryEl = document.getElementById('exercise-total');

    if (summaryEl) {
        summaryEl.textContent = `Toplam: ${formatCalories(totalBurned)}`;
    }
}

// ============================================================================
// PROFİL SAYFASI GÜNCELLEMELERİ
// ============================================================================

/**
 * Profil sayfasını günceller
 */
function updateProfilePage(profile, bmi, bmr, dailyCalories) {
    // Profil bilgilerini göster
    const profileInfo = document.getElementById('profile-info');
    if (profileInfo) {
        const bmiCategory = getBMICategory(bmi);

        profileInfo.innerHTML = `
            <div class="profile-stat">
                <span class="stat-label">İsim:</span>
                <span class="stat-value">${profile.name}</span>
            </div>
            <div class="profile-stat">
                <span class="stat-label">Yaş:</span>
                <span class="stat-value">${profile.age}</span>
            </div>
            <div class="profile-stat">
                <span class="stat-label">Boy:</span>
                <span class="stat-value">${profile.height} cm</span>
            </div>
            <div class="profile-stat">
                <span class="stat-label">Kilo:</span>
                <span class="stat-value">${profile.weight} kg</span>
            </div>
            <div class="profile-stat">
                <span class="stat-label">Cinsiyet:</span>
                <span class="stat-value">${profile.gender === 'male' ? 'Erkek' : 'Kadın'}</span>
            </div>
            <div class="profile-stat highlight">
                <span class="stat-label">VKİ:</span>
                <span class="stat-value" style="color: ${bmiCategory.color}">${formatBMI(bmi)} (${bmiCategory.label})</span>
            </div>
            <div class="profile-stat highlight">
                <span class="stat-label">BMR:</span>
                <span class="stat-value">${formatCalories(bmr)}</span>
            </div>
            <div class="profile-stat highlight">
                <span class="stat-label">Günlük Hedef:</span>
                <span class="stat-value">${formatCalories(dailyCalories)}</span>
            </div>
            <div class="profile-advice">
                <strong>Öneri:</strong> ${bmiCategory.advice}
            </div>
        `;
    }
}

// ============================================================================
// FORM YÖNETİMİ
// ============================================================================

/**
 * Yemek veritabanı dropdown'ını doldurur
 */
function populateFoodDatabase() {
    const select = document.getElementById('food-select');
    if (!select) return;

    // Manuel seçeneği ekle
    select.innerHTML = '<option value="">-- Manuel gir --</option>';

    // Yemekleri alfabetik sırala ve ekle
    const sortedFoods = [...foodDatabase].sort((a, b) =>
        a.name.localeCompare(b.name, 'tr')
    );

    sortedFoods.forEach(food => {
        const option = document.createElement('option');
        option.value = JSON.stringify(food);
        option.textContent = `${food.name} (${food.calories} kcal)`;
        select.appendChild(option);
    });
}

/**
 * Egzersiz veritabanı dropdown'ını doldurur
 */
function populateExerciseDatabase() {
    const select = document.getElementById('exercise-select');
    if (!select) return;

    select.innerHTML = '<option value="">-- Egzersiz seç --</option>';

    exerciseDatabase.forEach((exercise, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${exercise.name} (${exercise.description})`;
        select.appendChild(option);
    });
}

/**
 * Form alanlarını temizler
 */
function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.reset();
    }
}

// ============================================================================
// YARDIMCI FONKSİYONLAR
// ============================================================================

/**
 * Element'in içeriğini smooth scroll ile gösterir
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Loading spinner gösterir/gizler
 */
function toggleLoading(show) {
    let loader = document.getElementById('loading-spinner');

    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loading-spinner';
            loader.className = 'loading-spinner';
            loader.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    } else if (loader) {
        loader.style.display = 'none';
    }
}
