/**
 * CALCULATIONS.JS - Hesaplama Fonksiyonları
 * 
 * Bu modül fitness ve sağlık ile ilgili tüm hesaplamaları içerir:
 * - VKİ (BMI - Body Mass Index) hesaplama
 * - BMR (Basal Metabolic Rate) hesaplama
 * - Egzersiz kalori yakımı hesaplama
 * - Hedef kalori hesaplama
 */

// ============================================================================
// VKİ (VÜCUT KİTLE İNDEKSİ) HESAPLAMA
// ============================================================================

/**
 * VKİ (Body Mass Index) hesaplar
 * Formül: VKİ = kilo (kg) / boy (m)²
 * 
 * @param {number} weight - Kilo (kg)
 * @param {number} height - Boy (cm)
 * @returns {number} VKİ değeri (ondalıklı)
 */
function calculateBMI(weight, height) {
    // Hata kontrolü
    if (!weight || !height || weight <= 0 || height <= 0) {
        console.error('Geçersiz kilo veya boy değeri!');
        return 0;
    }

    // Boyu metreye çevir
    const heightInMeters = height / 100;

    // VKİ hesapla
    const bmi = weight / (heightInMeters * heightInMeters);

    // İki ondalık basamağa yuvarla
    return Math.round(bmi * 10) / 10;
}

/**
 * VKİ değerine göre kategori belirler
 * 
 * @param {number} bmi - VKİ değeri
 * @returns {Object} Kategori bilgileri (label, color, advice)
 */
function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return bmiCategories.underweight;
    } else if (bmi >= 18.5 && bmi < 25) {
        return bmiCategories.normal;
    } else if (bmi >= 25 && bmi < 30) {
        return bmiCategories.overweight;
    } else {
        return bmiCategories.obese;
    }
}

// ============================================================================
// BMR (BAZAL METABOLİZMA HIZI) HESAPLAMA
// ============================================================================

/**
 * BMR (Basal Metabolic Rate) hesaplar - Harris-Benedict Denklemi
 * BMR: Vücudun dinlenme halinde harcadığı minimum kalori
 * 
 * ERKEK: BMR = 88.362 + (13.397 × kilo) + (4.799 × boy) - (5.677 × yaş)
 * KADIN: BMR = 447.593 + (9.247 × kilo) + (3.098 × boy) - (4.330 × yaş)
 * 
 * @param {number} weight - Kilo (kg)
 * @param {number} height - Boy (cm)
 * @param {number} age - Yaş
 * @param {string} gender - Cinsiyet ('male' veya 'female')
 * @returns {number} BMR değeri (kalori/gün)
 */
function calculateBMR(weight, height, age, gender) {
    // Hata kontrolü
    if (!weight || !height || !age || !gender) {
        console.error('Eksik parametre!');
        return 0;
    }

    if (weight <= 0 || height <= 0 || age <= 0) {
        console.error('Geçersiz değerler!');
        return 0;
    }

    let bmr;

    if (gender === 'male') {
        // Erkek formülü
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else if (gender === 'female') {
        // Kadın formülü
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    } else {
        console.error('Geçersiz cinsiyet değeri!');
        return 0;
    }

    // Tam sayıya yuvarla
    return Math.round(bmr);
}

/**
 * Günlük kalori ihtiyacını hesaplar (Aktivite seviyesine göre)
 * BMR × Aktivite faktörü
 * 
 * Aktivite Seviyeleri:
 * - sedentary: Hareketsiz (ofis işi) → BMR × 1.2
 * - light: Hafif aktif (haftada 1-3 gün) → BMR × 1.375
 * - moderate: Orta aktif (haftada 3-5 gün) → BMR × 1.55
 * - active: Çok aktif (haftada 6-7 gün) → BMR × 1.725
 * - extreme: Aşırı aktif (günde 2 kez) → BMR × 1.9
 * 
 * @param {number} bmr - BMR değeri
 * @param {string} activityLevel - Aktivite seviyesi
 * @returns {number} Günlük kalori ihtiyacı
 */
function calculateDailyCalories(bmr, activityLevel = 'sedentary') {
    const activityFactors = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        extreme: 1.9
    };

    const factor = activityFactors[activityLevel] || 1.2;
    return Math.round(bmr * factor);
}

// ============================================================================
// EGZERSİZ KALORİ YAKIMI HESAPLAMA
// ============================================================================

/**
 * Egzersiz kalori yakımını hesaplar (Süre bazlı)
 * Formül: Yakılan Kalori = (MET × Kilo × Süre) / 60
 * 
 * MET (Metabolic Equivalent of Task): Aktivite yoğunluğu ölçüsü
 * 1 MET = Dinlenme halindeki oksijen tüketimi
 * 
 * @param {number} met - MET değeri
 * @param {number} weight - Kilo (kg)
 * @param {number} duration - Süre (dakika)
 * @returns {number} Yakılan kalori
 */
function calculateCaloriesBurnedByDuration(met, weight, duration) {
    // Hata kontrolü
    if (!met || !weight || !duration || met <= 0 || weight <= 0 || duration <= 0) {
        console.error('Geçersiz egzersiz parametreleri!');
        return 0;
    }

    const caloriesBurned = (met * weight * duration) / 60;

    // Tam sayıya yuvarla
    return Math.round(caloriesBurned);
}

/**
 * Egzersiz kalori yakımını hesaplar (Tekrar bazlı)
 * Basitleştirilmiş hesaplama: Tekrar × Tekrar başına kalori
 * 
 * @param {number} reps - Tekrar sayısı
 * @param {number} caloriesPerRep - Tekrar başına yakılan kalori
 * @returns {number} Yakılan kalori
 */
function calculateCaloriesBurnedByReps(reps, caloriesPerRep) {
    // Hata kontrolü
    if (!reps || !caloriesPerRep || reps <= 0 || caloriesPerRep <= 0) {
        console.error('Geçersiz tekrar parametreleri!');
        return 0;
    }

    const caloriesBurned = reps * caloriesPerRep;

    // Tam sayıya yuvarla
    return Math.round(caloriesBurned);
}

/**
 * Egzersiz bilgisine göre kalori yakımını otomatik hesaplar
 * 
 * @param {Object} exercise - Egzersiz objesi (exerciseDatabase'den)
 * @param {number} weight - Kullanıcının kilosu
 * @param {number} value - Süre (dakika) veya tekrar sayısı
 * @returns {number} Yakılan kalori
 */
function calculateExerciseCalories(exercise, weight, value) {
    if (!exercise || !weight || !value) {
        console.error('Eksik egzersiz bilgisi!');
        return 0;
    }

    if (exercise.type === 'sure') {
        // Süre bazlı egzersiz
        return calculateCaloriesBurnedByDuration(exercise.met, weight, value);
    } else if (exercise.type === 'tekrar') {
        // Tekrar bazlı egzersiz
        return calculateCaloriesBurnedByReps(value, exercise.caloriesPerRep);
    } else {
        console.error('Bilinmeyen egzersiz tipi!');
        return 0;
    }
}

// ============================================================================
// HEDEF VE İLERLEME HESAPLAMALARI
// ============================================================================

/**
 * Günlük net kaloriyi hesaplar
 * Net Kalori = Alınan Kalori - Yakılan Kalori
 * 
 * @param {number} consumed - Alınan kalori
 * @param {number} burned - Yakılan kalori (egzersiz)
 * @returns {number} Net kalori
 */
function calculateNetCalories(consumed, burned) {
    return consumed - burned;
}

/**
 * Hedef kalori yüzdesini hesaplar
 * 
 * @param {number} current - Mevcut kalori
 * @param {number} target - Hedef kalori
 * @returns {number} Yüzde (0-100 arası)
 */
function calculateCaloriePercentage(current, target) {
    if (!target || target <= 0) {
        return 0;
    }

    const percentage = (current / target) * 100;

    // Yüzdeyi sınırla (0-150 arası gösterelim)
    return Math.min(Math.max(percentage, 0), 150);
}

/**
 * Hedef kilo için gerekli günlük kalori değişikliğini hesaplar
 * 
 * 1 kg yağ ≈ 7700 kalori
 * Örnek: 5 kg vermek için → -38500 kalori gerekli
 * 2 ayda (60 gün) → günde -642 kalori açığı
 * 
 * @param {number} currentWeight - Mevcut kilo (kg)
 * @param {number} targetWeight - Hedef kilo (kg)
 * @param {number} days - Gün sayısı
 * @returns {Object} Hesaplama sonucu
 */
function calculateWeightGoal(currentWeight, targetWeight, days) {
    const weightDifference = targetWeight - currentWeight;
    const totalCalories = weightDifference * 7700; // 1 kg = 7700 kalori
    const dailyCalorieChange = totalCalories / days;

    return {
        weightDifference: Math.round(weightDifference * 10) / 10,
        totalCalories: Math.round(totalCalories),
        dailyCalorieChange: Math.round(dailyCalorieChange),
        isLosing: weightDifference < 0,
        isGaining: weightDifference > 0,
        recommendation: Math.abs(dailyCalorieChange) > 1000
            ? 'Hedef çok agresif, daha uzun süreye yayın!'
            : 'Hedef ulaşılabilir görünüyor!'
    };
}

// ============================================================================
// YARDIMCI FONKSİYONLAR
// ============================================================================

/**
 * Sayıyı binlik ayraçlarla formatlar (Türkçe)
 * 
 * @param {number} num - Sayı
 * @returns {string} Formatlanmış sayı (örn: "2.450")
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Kaloriyi formatlar ve birim ekler
 * 
 * @param {number} calories - Kalori değeri
 * @returns {string} Formatlanmış string (örn: "2.450 kcal")
 */
function formatCalories(calories) {
    return `${formatNumber(Math.round(calories))} kcal`;
}

/**
 * Yüzdeyi formatlar
 * 
 * @param {number} percentage - Yüzde değeri
 * @returns {string} Formatlanmış string (örn: "%85")
 */
function formatPercentage(percentage) {
    return `%${Math.round(percentage)}`;
}

/**
 * VKİ'yi formatlar
 * 
 * @param {number} bmi - VKİ değeri
 * @returns {string} Formatlanmış string (örn: "22.5")
 */
function formatBMI(bmi) {
    return bmi.toFixed(1);
}
