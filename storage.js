/**
 * STORAGE.JS - LocalStorage Yönetim Modülü
 * 
 * Bu modül tarayıcının LocalStorage API'sini kullanarak veri saklama işlemlerini yönetir.
 * - Kullanıcı profili
 * - Günlük beslenme kayıtları
 * - Egzersiz geçmişi
 * - Hata yönetimi (try-catch)
 */

// ============================================================================
// STORAGE ANAHTARLARI (Keys)
// ============================================================================

const STORAGE_KEYS = {
    USER_PROFILE: 'fitness_user_profile',
    MEALS: 'fitness_meals',
    EXERCISES: 'fitness_exercises',
    SETTINGS: 'fitness_settings'
};

// ============================================================================
// YARDIMCI FONKSİYONLAR
// ============================================================================

/**
 * Bugünün tarihini YYYY-MM-DD formatında döndürür
 * @returns {string} Bugünün tarihi
 */
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * LocalStorage'a güvenli şekilde veri yazar
 * @param {string} key - Anahtar
 * @param {*} value - Değer (object, array, string, vb.)
 * @returns {boolean} Başarılı olup olmadığı
 */
function safeSetItem(key, value) {
    try {
        const jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
        return true;
    } catch (error) {
        console.error(`LocalStorage yazma hatası (${key}):`, error);
        alert('Veri kaydedilirken bir hata oluştu. Tarayıcı belleği dolu olabilir.');
        return false;
    }
}

/**
 * LocalStorage'dan güvenli şekilde veri okur
 * @param {string} key - Anahtar
 * @param {*} defaultValue - Veri yoksa döndürülecek varsayılan değer
 * @returns {*} Okunan değer veya varsayılan değer
 */
function safeGetItem(key, defaultValue = null) {
    try {
        const jsonValue = localStorage.getItem(key);
        if (jsonValue === null) {
            return defaultValue;
        }
        return JSON.parse(jsonValue);
    } catch (error) {
        console.error(`LocalStorage okuma hatası (${key}):`, error);
        return defaultValue;
    }
}

// ============================================================================
// KULLANICI PROFİLİ İŞLEMLERİ
// ============================================================================

/**
 * Kullanıcı profilini kaydeder
 * @param {Object} profileData - Profil bilgileri
 * @param {string} profileData.name - İsim
 * @param {number} profileData.age - Yaş
 * @param {number} profileData.height - Boy (cm)
 * @param {number} profileData.weight - Kilo (kg)
 * @param {string} profileData.gender - Cinsiyet ('male' veya 'female')
 * @returns {boolean} Başarılı olup olmadığı
 */
function saveUserProfile(profileData) {
    // Veri doğrulama
    if (!profileData.name || !profileData.age || !profileData.height ||
        !profileData.weight || !profileData.gender) {
        console.error('Eksik profil verisi!');
        return false;
    }

    // Kaydetme tarihi ekle
    profileData.savedAt = new Date().toISOString();

    return safeSetItem(STORAGE_KEYS.USER_PROFILE, profileData);
}

/**
 * Kullanıcı profilini yükler
 * @returns {Object|null} Profil bilgileri veya null
 */
function getUserProfile() {
    return safeGetItem(STORAGE_KEYS.USER_PROFILE, null);
}

/**
 * Kullanıcı profilinin var olup olmadığını kontrol eder
 * @returns {boolean}
 */
function hasUserProfile() {
    return getUserProfile() !== null;
}

/**
 * Kullanıcı profilini siler
 * @returns {boolean}
 */
function deleteUserProfile() {
    try {
        localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
        return true;
    } catch (error) {
        console.error('Profil silme hatası:', error);
        return false;
    }
}

// ============================================================================
// BESLENME KAYITLARI İŞLEMLERİ
// ============================================================================

/**
 * Tüm yemek kayıtlarını yükler
 * @returns {Object} Tarih bazlı yemek kayıtları
 */
function getAllMeals() {
    return safeGetItem(STORAGE_KEYS.MEALS, {});
}

/**
 * Belirli bir tarihteki yemekleri getirir
 * @param {string} date - Tarih (YYYY-MM-DD formatında)
 * @returns {Array} O tarihteki yemekler
 */
function getMealsByDate(date) {
    const allMeals = getAllMeals();
    return allMeals[date] || [];
}

/**
 * Bugünkü yemekleri getirir
 * @returns {Array} Bugünkü yemekler
 */
function getTodayMeals() {
    return getMealsByDate(getTodayDate());
}

/**
 * Yeni yemek ekler
 * @param {Object} mealData - Yemek bilgileri
 * @param {string} mealData.name - Yemek adı
 * @param {number} mealData.calories - Kalori miktarı
 * @param {string} mealData.category - Kategori (kahvalti, ogle, aksam, ara_ogun)
 * @returns {boolean} Başarılı olup olmadığı
 */
function addMeal(mealData) {
    // Veri doğrulama
    if (!mealData.name || !mealData.calories || !mealData.category) {
        console.error('Eksik yemek verisi!');
        return false;
    }

    const today = getTodayDate();
    const allMeals = getAllMeals();

    // Bugünün yemekleri yoksa yeni array oluştur
    if (!allMeals[today]) {
        allMeals[today] = [];
    }

    // Timestamp ve ID ekle
    const meal = {
        ...mealData,
        id: Date.now(), // Benzersiz ID
        timestamp: new Date().toISOString()
    };

    allMeals[today].push(meal);

    return safeSetItem(STORAGE_KEYS.MEALS, allMeals);
}

/**
 * Yemek siler
 * @param {number} mealId - Yemek ID'si
 * @returns {boolean} Başarılı olup olmadığı
 */
function deleteMeal(mealId) {
    const today = getTodayDate();
    const allMeals = getAllMeals();

    if (!allMeals[today]) {
        return false;
    }

    // ID'ye göre filtrele (silmek istediğimiz hariç)
    allMeals[today] = allMeals[today].filter(meal => meal.id !== mealId);

    return safeSetItem(STORAGE_KEYS.MEALS, allMeals);
}

/**
 * Bugünkü toplam kaloriyi hesaplar
 * @returns {number} Toplam kalori
 */
function getTodayTotalCalories() {
    const todayMeals = getTodayMeals();
    return todayMeals.reduce((total, meal) => total + Number(meal.calories), 0);
}

/**
 * Öğün kategorisine göre bugünkü kalorileri getirir
 * @param {string} category - Kategori
 * @returns {number} O kategorideki toplam kalori
 */
function getTodayCaloriesByCategory(category) {
    const todayMeals = getTodayMeals();
    return todayMeals
        .filter(meal => meal.category === category)
        .reduce((total, meal) => total + Number(meal.calories), 0);
}

// ============================================================================
// EGZERSİZ KAYITLARI İŞLEMLERİ
// ============================================================================

/**
 * Tüm egzersiz kayıtlarını yükler
 * @returns {Object} Tarih bazlı egzersiz kayıtları
 */
function getAllExercises() {
    return safeGetItem(STORAGE_KEYS.EXERCISES, {});
}

/**
 * Belirli bir tarihteki egzersizleri getirir
 * @param {string} date - Tarih (YYYY-MM-DD formatında)
 * @returns {Array} O tarihteki egzersizler
 */
function getExercisesByDate(date) {
    const allExercises = getAllExercises();
    return allExercises[date] || [];
}

/**
 * Bugünkü egzersizleri getirir
 * @returns {Array} Bugünkü egzersizler
 */
function getTodayExercises() {
    return getExercisesByDate(getTodayDate());
}

/**
 * Yeni egzersiz ekler
 * @param {Object} exerciseData - Egzersiz bilgileri
 * @param {string} exerciseData.name - Egzersiz adı
 * @param {number} exerciseData.duration - Süre (dakika) veya tekrar sayısı
 * @param {number} exerciseData.caloriesBurned - Yakılan kalori
 * @param {string} exerciseData.type - Tür ('sure' veya 'tekrar')
 * @returns {boolean} Başarılı olup olmadığı
 */
function addExercise(exerciseData) {
    // Veri doğrulama
    if (!exerciseData.name || !exerciseData.duration || !exerciseData.caloriesBurned) {
        console.error('Eksik egzersiz verisi!');
        return false;
    }

    const today = getTodayDate();
    const allExercises = getAllExercises();

    // Bugünün egzersizleri yoksa yeni array oluştur
    if (!allExercises[today]) {
        allExercises[today] = [];
    }

    // Timestamp ve ID ekle
    const exercise = {
        ...exerciseData,
        id: Date.now(),
        timestamp: new Date().toISOString()
    };

    allExercises[today].push(exercise);

    return safeSetItem(STORAGE_KEYS.EXERCISES, allExercises);
}

/**
 * Egzersiz siler
 * @param {number} exerciseId - Egzersiz ID'si
 * @returns {boolean} Başarılı olup olmadığı
 */
function deleteExercise(exerciseId) {
    const today = getTodayDate();
    const allExercises = getAllExercises();

    if (!allExercises[today]) {
        return false;
    }

    allExercises[today] = allExercises[today].filter(ex => ex.id !== exerciseId);

    return safeSetItem(STORAGE_KEYS.EXERCISES, allExercises);
}

/**
 * Bugünkü toplam yakılan kaloriyi hesaplar
 * @returns {number} Toplam yakılan kalori
 */
function getTodayBurnedCalories() {
    const todayExercises = getTodayExercises();
    return todayExercises.reduce((total, ex) => total + Number(ex.caloriesBurned), 0);
}

// ============================================================================
// GENEL VERİ YÖNETİMİ
// ============================================================================

/**
 * Tüm uygulama verilerini temizler (Reset)
 * @returns {boolean}
 */
function clearAllData() {
    try {
        localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
        localStorage.removeItem(STORAGE_KEYS.MEALS);
        localStorage.removeItem(STORAGE_KEYS.EXERCISES);
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        return true;
    } catch (error) {
        console.error('Veri temizleme hatası:', error);
        return false;
    }
}

/**
 * Uygulama verilerini dışa aktarır (JSON formatında)
 * @returns {string} JSON string
 */
function exportData() {
    try {
        const data = {
            profile: getUserProfile(),
            meals: getAllMeals(),
            exercises: getAllExercises(),
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Veri dışa aktarma hatası:', error);
        return null;
    }
}

/**
 * Dışa aktarılan veriyi içe aktarır
 * @param {string} jsonData - JSON string
 * @returns {boolean}
 */
function importData(jsonData) {
    try {
        const data = JSON.parse(jsonData);

        if (data.profile) saveUserProfile(data.profile);
        if (data.meals) safeSetItem(STORAGE_KEYS.MEALS, data.meals);
        if (data.exercises) safeSetItem(STORAGE_KEYS.EXERCISES, data.exercises);

        return true;
    } catch (error) {
        console.error('Veri içe aktarma hatası:', error);
        alert('Geçersiz veri formatı!');
        return false;
    }
}
