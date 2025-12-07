/**
 * APP.JS - Ana Uygulama Kontrolcüsü
 * 
 * Bu modül uygulamanın ana mantığını ve event listener'larını içerir:
 * - Sayfa yükleme ve başlangıç
 * - Event handler'lar
 * - Form submit işlemleri
 * - Modül koordinasyonu
 */

// ============================================================================
// UYGULAMA BAŞLATMA
// ============================================================================

/**
 * Uygulama başlatıldığında çalışır
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('Fitness Takip Uygulaması başlatılıyor...');

    // Kullanıcı profili kontrolü
    initializeApp();

    // Event listener'ları kur
    setupEventListeners();

    // Dropdown'ları doldur
    populateFoodDatabase();
    populateExerciseDatabase();

    console.log('Uygulama başarıyla yüklendi!');
});

/**
 * Uygulamayı başlatır
 */
function initializeApp() {
    const profile = getUserProfile();

    if (profile) {
        // Profil varsa dashboard'u göster
        showPage('dashboard-page');
        updateDashboard();
        updateNutritionPage();
        updateExercisePage();
    } else {
        // Profil yoksa karşılama sayfasını göster
        showPage('welcome-page');
    }
}

// ============================================================================
// EVENT LISTENER'LAR
// ============================================================================

/**
 * Tüm event listener'ları kurar
 */
function setupEventListeners() {
    // Navigation butonları
    setupNavigationListeners();

    // Profil formu
    setupProfileFormListener();

    // Beslenme formları
    setupNutritionListeners();

    // Egzersiz formu
    setupExerciseListeners();

    // Modal kapatma
    setupModalListeners();

    // Profil sıfırlama
    setupResetListener();
}

/**
 * Navigation butonları için event listener'lar
 */
function setupNavigationListeners() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const targetPage = this.dataset.page;
            showPage(targetPage);

            // Sayfa açıldığında güncellemeleri yap
            if (targetPage === 'dashboard-page') {
                updateDashboard();
            } else if (targetPage === 'nutrition-page') {
                updateNutritionPage();
            } else if (targetPage === 'exercise-page') {
                updateExercisePage();
            } else if (targetPage === 'profile-page') {
                const profile = getUserProfile();
                if (profile) {
                    const bmi = calculateBMI(profile.weight, profile.height);
                    const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
                    const dailyCalories = calculateDailyCalories(bmr);
                    updateProfilePage(profile, bmi, bmr, dailyCalories);
                }
            }
        });
    });
}

// ============================================================================
// PROFİL YÖNETİMİ
// ============================================================================

/**
 * Profil formu submit listener'ı
 */
function setupProfileFormListener() {
    const profileForm = document.getElementById('profile-form');

    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleProfileSubmit();
        });
    }
}

/**
 * Profil formu submit işlemini yönetir
 */
function handleProfileSubmit() {
    // Form verilerini al
    const name = document.getElementById('profile-name').value.trim();
    const age = parseInt(document.getElementById('profile-age').value);
    const height = parseInt(document.getElementById('profile-height').value);
    const weight = parseFloat(document.getElementById('profile-weight').value);
    const gender = document.getElementById('profile-gender').value;

    // Validasyon
    if (!validateProfileData(name, age, height, weight, gender)) {
        return;
    }

    // Profil objesini oluştur
    const profileData = {
        name,
        age,
        height,
        weight,
        gender
    };

    // Kaydet
    const success = saveUserProfile(profileData);

    if (success) {
        showToast('Profil başarıyla kaydedildi!', 'success');

        // Dashboard'a geç
        setTimeout(() => {
            showPage('dashboard-page');
            updateDashboard();
            updateNutritionPage();
            updateExercisePage();
        }, 1000);
    } else {
        showToast('Profil kaydedilirken hata oluştu!', 'error');
    }
}

/**
 * Profil verilerini doğrular
 */
function validateProfileData(name, age, height, weight, gender) {
    // İsim kontrolü
    if (!name || name.length < 2) {
        showToast('Lütfen geçerli bir isim girin!', 'error');
        return false;
    }

    // Yaş kontrolü
    if (isNaN(age) || age < 10 || age > 120) {
        showToast('Yaş 10-120 arasında olmalıdır!', 'error');
        return false;
    }

    // Boy kontrolü
    if (isNaN(height) || height < 100 || height > 250) {
        showToast('Boy 100-250 cm arasında olmalıdır!', 'error');
        return false;
    }

    // Kilo kontrolü
    if (isNaN(weight) || weight < 30 || weight > 300) {
        showToast('Kilo 30-300 kg arasında olmalıdır!', 'error');
        return false;
    }

    // Cinsiyet kontrolü
    if (gender !== 'male' && gender !== 'female') {
        showToast('Lütfen cinsiyet seçin!', 'error');
        return false;
    }

    return true;
}

// ============================================================================
// BESLENME YÖNETİMİ
// ============================================================================

/**
 * Beslenme event listener'larını kurar
 */
function setupNutritionListeners() {
    // Yemek ekle butonları (her kategori için)
    ['kahvalti', 'ogle', 'aksam', 'ara_ogun'].forEach(category => {
        const btn = document.getElementById(`add-${category}-btn`);
        if (btn) {
            btn.addEventListener('click', () => openAddMealModal(category));
        }
    });

    // Yemek ekle formu
    const mealForm = document.getElementById('add-meal-form');
    if (mealForm) {
        mealForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleAddMeal();
        });
    }

    // Yemek seçimi değiştiğinde
    const foodSelect = document.getElementById('food-select');
    if (foodSelect) {
        foodSelect.addEventListener('change', function () {
            handleFoodSelection(this.value);
        });
    }
}

/**
 * Yemek ekleme modalını açar
 */
function openAddMealModal(category) {
    // Kategoriyi sakla
    document.getElementById('add-meal-form').dataset.category = category;

    // Modal başlığını güncelle
    const modalTitle = document.getElementById('meal-modal-title');
    if (modalTitle) {
        modalTitle.textContent = `${mealCategories[category]} - Yemek Ekle`;
    }

    // Formu temizle
    clearForm('add-meal-form');

    // Modalı aç
    openModal('add-meal-modal');
}

/**
 * Yemek seçimi yapıldığında
 */
function handleFoodSelection(value) {
    const nameInput = document.getElementById('meal-name');
    const caloriesInput = document.getElementById('meal-calories');

    if (value) {
        // Önceden tanımlı yemek seçildi
        const food = JSON.parse(value);
        nameInput.value = food.name;
        nameInput.readOnly = true;
        caloriesInput.value = food.calories;
        caloriesInput.readOnly = true;
    } else {
        // Manuel giriş
        nameInput.value = '';
        nameInput.readOnly = false;
        caloriesInput.value = '';
        caloriesInput.readOnly = false;
    }
}

/**
 * Yemek ekleme işlemini yönetir
 */
function handleAddMeal() {
    const form = document.getElementById('add-meal-form');
    const category = form.dataset.category;

    const name = document.getElementById('meal-name').value.trim();
    const calories = parseInt(document.getElementById('meal-calories').value);

    // Validasyon
    if (!name) {
        showToast('Lütfen yemek adı girin!', 'error');
        return;
    }

    if (isNaN(calories) || calories <= 0 || calories > 5000) {
        showToast('Kalori 1-5000 arasında olmalıdır!', 'error');
        return;
    }

    // Yemek objesini oluştur
    const mealData = {
        name,
        calories,
        category
    };

    // Kaydet
    const success = addMeal(mealData);

    if (success) {
        showToast('Yemek eklendi!', 'success');

        // Sayfaları güncelle
        updateNutritionPage();
        updateDashboard();

        // Modalı kapat ve formu temizle
        closeModal('add-meal-modal');
        clearForm('add-meal-form');
    } else {
        showToast('Yemek eklenirken hata oluştu!', 'error');
    }
}

/**
 * Yemek silme işlemi (Global fonksiyon - HTML'den çağrılır)
 */
function deleteMealItem(mealId) {
    if (confirm('Bu yemeği silmek istediğinize emin misiniz?')) {
        const success = deleteMeal(mealId);

        if (success) {
            showToast('Yemek silindi!', 'success');
            updateNutritionPage();
            updateDashboard();
        } else {
            showToast('Silme işlemi başarısız!', 'error');
        }
    }
}

// ============================================================================
// EGZERSİZ YÖNETİMİ
// ============================================================================

/**
 * Egzersiz event listener'larını kurar
 */
function setupExerciseListeners() {
    // Egzersiz ekle butonu
    const addExBtn = document.getElementById('add-exercise-btn');
    if (addExBtn) {
        addExBtn.addEventListener('click', () => openModal('add-exercise-modal'));
    }

    // Egzersiz ekle formu
    const exerciseForm = document.getElementById('add-exercise-form');
    if (exerciseForm) {
        exerciseForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleAddExercise();
        });
    }

    // Egzersiz seçimi değiştiğinde
    const exerciseSelect = document.getElementById('exercise-select');
    if (exerciseSelect) {
        exerciseSelect.addEventListener('change', function () {
            handleExerciseSelection(this.value);
        });
    }
}

/**
 * Egzersiz seçimi yapıldığında
 */
function handleExerciseSelection(value) {
    const durationLabel = document.getElementById('exercise-duration-label');
    const durationInput = document.getElementById('exercise-duration');

    if (value) {
        const exercise = exerciseDatabase[value];

        if (exercise.type === 'sure') {
            durationLabel.textContent = 'Süre (dakika):';
            durationInput.placeholder = 'Örn: 30';
        } else {
            durationLabel.textContent = 'Tekrar Sayısı:';
            durationInput.placeholder = 'Örn: 20';
        }
    }
}

/**
 * Egzersiz ekleme işlemini yönetir
 */
function handleAddExercise() {
    const exerciseIndex = document.getElementById('exercise-select').value;
    const duration = parseInt(document.getElementById('exercise-duration').value);

    // Validasyon
    if (!exerciseIndex) {
        showToast('Lütfen egzersiz seçin!', 'error');
        return;
    }

    if (isNaN(duration) || duration <= 0 || duration > 1000) {
        showToast('Geçersiz süre/tekrar sayısı!', 'error');
        return;
    }

    const exercise = exerciseDatabase[exerciseIndex];
    const profile = getUserProfile();

    if (!profile) {
        showToast('Önce profil oluşturun!', 'error');
        return;
    }

    // Kalori hesapla
    const caloriesBurned = calculateExerciseCalories(exercise, profile.weight, duration);

    // Egzersiz objesini oluştur
    const exerciseData = {
        name: exercise.name,
        duration: duration,
        type: exercise.type,
        caloriesBurned: caloriesBurned
    };

    // Kaydet
    const success = addExercise(exerciseData);

    if (success) {
        showToast(`${exercise.name} eklendi! ${caloriesBurned} kcal yaktınız!`, 'success');

        // Sayfaları güncelle
        updateExercisePage();
        updateDashboard();

        // Modalı kapat ve formu temizle
        closeModal('add-exercise-modal');
        clearForm('add-exercise-form');
    } else {
        showToast('Egzersiz eklenirken hata oluştu!', 'error');
    }
}

/**
 * Egzersiz silme işlemi (Global fonksiyon - HTML'den çağrılır)
 */
function deleteExerciseItem(exerciseId) {
    if (confirm('Bu egzersizi silmek istediğinize emin misiniz?')) {
        const success = deleteExercise(exerciseId);

        if (success) {
            showToast('Egzersiz silindi!', 'success');
            updateExercisePage();
            updateDashboard();
        } else {
            showToast('Silme işlemi başarısız!', 'error');
        }
    }
}

// ============================================================================
// MODAL YÖNETİMİ
// ============================================================================

/**
 * Modal event listener'larını kurar
 */
function setupModalListeners() {
    // Tüm modal close butonları
    const closeButtons = document.querySelectorAll('.modal-close, .btn-cancel');

    closeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Modal dışına tıklandığında kapat
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

// ============================================================================
// PROFİL SIFIRLAMA
// ============================================================================

/**
 * Profil sıfırlama listener'ı
 */
function setupResetListener() {
    const resetBtn = document.getElementById('reset-profile-btn');

    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            handleResetProfile();
        });
    }
}

/**
 * Profil sıfırlama işlemini yönetir
 */
function handleResetProfile() {
    const confirmation = confirm(
        'TÜM VERİLERİNİZ SİLİNECEKTİR!\n\n' +
        'Profil, beslenme ve egzersiz kayıtlarınızın tümü kalıcı olarak silinecek.\n\n' +
        'Devam etmek istediğinize emin misiniz?'
    );

    if (confirmation) {
        const success = clearAllData();

        if (success) {
            showToast('Tüm veriler silindi!', 'success');

            setTimeout(() => {
                location.reload(); // Sayfayı yenile
            }, 1500);
        } else {
            showToast('Veri silinirken hata oluştu!', 'error');
        }
    }
}

// ============================================================================
// GENEL YARDIMCI FONKSİYONLAR
// ============================================================================

/**
 * Hata loglama
 */
function logError(context, error) {
    console.error(`[${context}] Hata:`, error);
}

/**
 * Debug mode kontrolü
 */
const DEBUG_MODE = false;

function debugLog(...args) {
    if (DEBUG_MODE) {
        console.log('[DEBUG]', ...args);
    }
}
