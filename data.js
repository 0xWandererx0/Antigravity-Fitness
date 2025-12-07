/**
 * DATA.JS - Önceden Tanımlı Veriler
 * 
 * Bu modül uygulamada kullanılacak yemek ve egzersiz verilerini içerir.
 * - Popüler Türk yemekleri ve kalorileri
 * - Temel egzersizler ve MET değerleri
 */

// ============================================================================
// YEMEK VERİTABANI
// ============================================================================

/**
 * Popüler yemekler ve tahmini kalori değerleri (100g bazında)
 * Kullanıcı bu listeden seçim yapabilir veya manuel girebilir
 */
const foodDatabase = [
    // Kahvaltılık Ürünler
    { name: "Menemen (1 porsiyon)", calories: 180, category: "kahvalti" },
    { name: "Beyaz Peynir (50g)", calories: 135, category: "kahvalti" },
    { name: "Kaşar Peyniri (50g)", calories: 190, category: "kahvalti" },
    { name: "Zeytin (10 adet)", calories: 50, category: "kahvalti" },
    { name: "Yumurta (1 adet, haşlanmış)", calories: 78, category: "kahvalti" },
    { name: "Omlet (2 yumurta)", calories: 154, category: "kahvalti" },
    { name: "Simit (1 adet)", calories: 290, category: "kahvalti" },
    { name: "Beyaz Ekmek (1 dilim)", calories: 80, category: "kahvalti" },
    { name: "Tam Buğday Ekmeği (1 dilim)", calories: 70, category: "kahvalti" },
    { name: "Bal (1 yemek kaşığı)", calories: 64, category: "kahvalti" },
    { name: "Reçel (1 yemek kaşığı)", calories: 56, category: "kahvalti" },
    { name: "Tereyağı (10g)", calories: 72, category: "kahvalti" },

    // Ana Yemekler - Türk Mutfağı
    { name: "Kuru Fasulye (1 porsiyon)", calories: 320, category: "ana_yemek" },
    { name: "Mercimek Çorbası (1 kase)", calories: 180, category: "ana_yemek" },
    { name: "Pilav (1 porsiyon)", calories: 250, category: "ana_yemek" },
    { name: "Makarna (1 porsiyon)", calories: 280, category: "ana_yemek" },
    { name: "Köfte (4 adet)", calories: 400, category: "ana_yemek" },
    { name: "Tavuk Göğsü Izgara (150g)", calories: 165, category: "ana_yemek" },
    { name: "Balık Izgara (150g)", calories: 180, category: "ana_yemek" },
    { name: "Et Döner (1 porsiyon)", calories: 450, category: "ana_yemek" },
    { name: "Tavuk Döner (1 porsiyon)", calories: 380, category: "ana_yemek" },
    { name: "Lahmacun (1 adet)", calories: 230, category: "ana_yemek" },
    { name: "Pide (1 dilim)", calories: 280, category: "ana_yemek" },
    { name: "Karnıyarık (1 porsiyon)", calories: 350, category: "ana_yemek" },
    { name: "İmam Bayıldı (1 porsiyon)", calories: 280, category: "ana_yemek" },
    { name: "Mantı (1 porsiyon)", calories: 420, category: "ana_yemek" },
    { name: "Dolma (10 adet)", calories: 250, category: "ana_yemek" },

    // Salatalar ve Mezeler
    { name: "Çoban Salatası (1 porsiyon)", calories: 120, category: "salata" },
    { name: "Cacık (1 kase)", calories: 95, category: "salata" },
    { name: "Haydari (1 porsiyon)", calories: 180, category: "salata" },
    { name: "Humus (100g)", calories: 166, category: "salata" },
    { name: "Yeşil Salata (1 porsiyon)", calories: 45, category: "salata" },

    // Ara Öğünler ve Atıştırmalıklar
    { name: "Muz (1 adet)", calories: 89, category: "ara_ogun" },
    { name: "Elma (1 adet)", calories: 95, category: "ara_ogun" },
    { name: "Portakal (1 adet)", calories: 62, category: "ara_ogun" },
    { name: "Üzüm (1 kase)", calories: 104, category: "ara_ogun" },
    { name: "Yoğurt (1 kase)", calories: 150, category: "ara_ogun" },
    { name: "Ayran (1 bardak)", calories: 50, category: "ara_ogun" },
    { name: "Ceviz (30g)", calories: 196, category: "ara_ogun" },
    { name: "Badem (30g)", calories: 170, category: "ara_ogun" },
    { name: "Fındık (30g)", calories: 180, category: "ara_ogun" },
    { name: "Kraker (5 adet)", calories: 100, category: "ara_ogun" },
    { name: "Çikolata (1 küçük)", calories: 220, category: "ara_ogun" },

    // İçecekler
    { name: "Çay (1 bardak, şekersiz)", calories: 2, category: "icecek" },
    { name: "Çay (1 bardak, 1 şeker)", calories: 22, category: "icecek" },
    { name: "Türk Kahvesi (şekersiz)", calories: 5, category: "icecek" },
    { name: "Türk Kahvesi (şekerli)", calories: 45, category: "icecek" },
    { name: "Kola (330ml)", calories: 139, category: "icecek" },
    { name: "Meyve Suyu (200ml)", calories: 90, category: "icecek" },
    { name: "Su", calories: 0, category: "icecek" },
];

// ============================================================================
// EGZERSİZ VERİTABANI
// ============================================================================

/**
 * Temel egzersizler ve MET (Metabolic Equivalent of Task) değerleri
 * MET: Dinlenme halindeki oksijen tüketimine göre aktivite yoğunluğu
 * 
 * Kalori Hesaplama Formülü:
 * Yakılan Kalori = (MET × Kilo × Süre(dk)) / 60
 */
const exerciseDatabase = [
    // Kuvvet Antrenmanları
    {
        name: "Şınav",
        met: 8.0,
        type: "tekrar",
        description: "Göğüs ve kol kaslarını güçlendirir",
        caloriesPerRep: 0.5 // Tekrar başına tahmini kalori
    },
    {
        name: "Mekik",
        met: 8.0,
        type: "tekrar",
        description: "Karın kaslarını çalıştırır",
        caloriesPerRep: 0.4
    },
    {
        name: "Squat (Çömelme)",
        met: 8.0,
        type: "tekrar",
        description: "Bacak ve kalça kaslarını güçlendirir",
        caloriesPerRep: 0.6
    },
    {
        name: "Burpee",
        met: 10.0,
        type: "tekrar",
        description: "Tüm vücut egzersizi",
        caloriesPerRep: 1.2
    },
    {
        name: "Plank (Tutma)",
        met: 5.0,
        type: "sure",
        description: "Core kaslarını güçlendirir"
    },

    // Kardiyo Egzersizleri
    {
        name: "Yürüyüş (Orta Tempo)",
        met: 3.5,
        type: "sure",
        description: "Hafif kardiyo, tüm vücut"
    },
    {
        name: "Yürüyüş (Hızlı)",
        met: 5.0,
        type: "sure",
        description: "Yoğun kardiyo"
    },
    {
        name: "Koşu (Yavaş)",
        met: 7.0,
        type: "sure",
        description: "Orta yoğunlukta kardiyo"
    },
    {
        name: "Koşu (Orta Hızda)",
        met: 9.0,
        type: "sure",
        description: "Yoğun kardiyo"
    },
    {
        name: "Koşu (Hızlı)",
        met: 11.5,
        type: "sure",
        description: "Çok yoğun kardiyo"
    },
    {
        name: "Bisiklet (Hafif)",
        met: 4.0,
        type: "sure",
        description: "Hafif bisiklet sürme"
    },
    {
        name: "Bisiklet (Orta)",
        met: 6.8,
        type: "sure",
        description: "Orta yoğunlukta bisiklet"
    },
    {
        name: "Bisiklet (Yoğun)",
        met: 10.0,
        type: "sure",
        description: "Yoğun bisiklet antrenmanı"
    },
    {
        name: "İp Atlama",
        met: 11.0,
        type: "sure",
        description: "Yüksek yoğunlukta kardiyo"
    },
    {
        name: "Yüzme (Orta)",
        met: 7.0,
        type: "sure",
        description: "Tüm vücut kardiyo"
    },
    {
        name: "Dans",
        met: 5.5,
        type: "sure",
        description: "Eğlenceli kardiyo"
    },
    {
        name: "Aerobik",
        met: 7.0,
        type: "sure",
        description: "Grup egzersizi"
    },

    // Yoga ve Esneme
    {
        name: "Yoga (Hafif)",
        met: 2.5,
        type: "sure",
        description: "Esneklik ve gevşeme"
    },
    {
        name: "Yoga (Yoğun)",
        met: 4.0,
        type: "sure",
        description: "Güç ve denge"
    },
    {
        name: "Pilates",
        met: 3.0,
        type: "sure",
        description: "Core güçlendirme"
    },
    {
        name: "Esneme (Stretching)",
        met: 2.3,
        type: "sure",
        description: "Hafif aktivite"
    }
];

// ============================================================================
// ÖĞÜN KATEGORİLERİ
// ============================================================================

const mealCategories = {
    kahvalti: "Kahvaltı",
    ogle: "Öğle Yemeği",
    aksam: "Akşam Yemeği",
    ara_ogun: "Ara Öğün"
};

// ============================================================================
// MOTİVASYON MESAJLARI
// ============================================================================

/**
 * Kullanıcıya gösterilecek motive edici mesajlar
 * Kalori durumuna göre farklı mesajlar döndürülebilir
 */
const motivationalMessages = {
    onTarget: [
        "Harika gidiyorsun! Hedefine çok yakınsın! 🎯",
        "Mükemmel! Dengeli bir gün geçiriyorsun! 💪",
        "Süpersin! Bu tempoda devam et! 🌟",
        "Bravo! Hedefini yakaladın! 🎉",
        "İnanılmaz! Tam isabet! 🏆"
    ],
    underTarget: [
        "Bugün biraz daha yemek yemeyi unutma! 🍎",
        "Enerjini yüksek tutmak için kalori almayı unutma! 💡",
        "Vücuduna ihtiyacı olan enerjiyi ver! 🔋",
        "Sağlıklı atıştırmalıklar eklemeyi dene! 🥗"
    ],
    overTarget: [
        "Hedefini biraz aştın, yarın daha dikkatli olabilirsin! 😊",
        "Biraz üst sınırdayız, ama endişelenme! Dengeli devam et! ⚖️",
        "Fazla kaloriye egzersizle denge sağlayabilirsin! 🏃‍♂️",
        "Yarın daha dengeli beslenerek dengeyi sağlayabilirsin! 🌈"
    ],
    exercised: [
        "Harika egzersiz! Kendini aştın! 🔥",
        "Spor yapıyorsun! Gururla devam et! 💪",
        "Egzersiz yaparak sağlığına yatırım yapıyorsun! ✨",
        "Müthiş! Aktif bir yaşam sürüyorsun! 🚴‍♀️"
    ],
    welcome: [
        "Günaydın! Bugün harika bir gün olacak! ☀️",
        "Merhaba! Sağlıklı bir gün dilerim! 🌱",
        "Hoş geldin! Hedeflerine ulaşmak için hazır mısın? 🎯",
        "Selam! Bugün de formdasın! 💚"
    ]
};

// ============================================================================
// VKİ DEĞERLENDİRME TABLOSu
// ============================================================================

/**
 * VKİ (Vücut Kitle İndeksi) değerlendirme aralıkları
 * Kaynak: Dünya Sağlık Örgütü (WHO) standartları
 */
const bmiCategories = {
    underweight: { max: 18.5, label: "Zayıf", color: "#3498db", advice: "Kilo almayı hedefleyin" },
    normal: { min: 18.5, max: 24.9, label: "Normal", color: "#2ecc71", advice: "Mükemmel! Devam edin" },
    overweight: { min: 25, max: 29.9, label: "Fazla Kilolu", color: "#f39c12", advice: "Hafif kilo vermeyi hedefleyin" },
    obese: { min: 30, label: "Obez", color: "#e74c3c", advice: "Kilo vermeyi hedefleyin" }
};

// Modülü dışa aktarma (tarayıcıda global değişken olarak kullanılacak)
// NOT: Modern ES6 modules kullanılabilir, ancak basitlik için global değişkenler kullanıyoruz
