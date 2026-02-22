import React, { useState, useEffect, useRef, useCallback } from 'react';

const SURAHS = [
  { number: 1,   name: 'Al-Fatiha',      arabic: 'الفاتحة' },
  { number: 2,   name: 'Al-Baqarah',     arabic: 'البقرة' },
  { number: 3,   name: 'Al-Imran',       arabic: 'آل عمران' },
  { number: 4,   name: 'An-Nisa',        arabic: 'النساء' },
  { number: 5,   name: 'Al-Maidah',      arabic: 'المائدة' },
  { number: 6,   name: 'Al-Anam',        arabic: 'الأنعام' },
  { number: 7,   name: 'Al-Araf',        arabic: 'الأعراف' },
  { number: 8,   name: 'Al-Anfal',       arabic: 'الأنفال' },
  { number: 9,   name: 'At-Tawbah',      arabic: 'التوبة' },
  { number: 10,  name: 'Yunus',          arabic: 'يونس' },
  { number: 11,  name: 'Hud',            arabic: 'هود' },
  { number: 12,  name: 'Yusuf',          arabic: 'يوسف' },
  { number: 13,  name: 'Ar-Rad',         arabic: 'الرعد' },
  { number: 14,  name: 'Ibrahim',        arabic: 'إبراهيم' },
  { number: 15,  name: 'Al-Hijr',        arabic: 'الحجر' },
  { number: 16,  name: 'An-Nahl',        arabic: 'النحل' },
  { number: 17,  name: 'Al-Isra',        arabic: 'الإسراء' },
  { number: 18,  name: 'Al-Kahf',        arabic: 'الكهف' },
  { number: 19,  name: 'Maryam',         arabic: 'مريم' },
  { number: 20,  name: 'Ta-Ha',          arabic: 'طه' },
  { number: 21,  name: 'Al-Anbiya',      arabic: 'الأنبياء' },
  { number: 22,  name: 'Al-Hajj',        arabic: 'الحج' },
  { number: 23,  name: 'Al-Muminun',     arabic: 'المؤمنون' },
  { number: 24,  name: 'An-Nur',         arabic: 'النور' },
  { number: 25,  name: 'Al-Furqan',      arabic: 'الفرقان' },
  { number: 26,  name: 'Ash-Shuara',     arabic: 'الشعراء' },
  { number: 27,  name: 'An-Naml',        arabic: 'النمل' },
  { number: 28,  name: 'Al-Qasas',       arabic: 'القصص' },
  { number: 29,  name: 'Al-Ankabut',     arabic: 'العنكبوت' },
  { number: 30,  name: 'Ar-Rum',         arabic: 'الروم' },
  { number: 31,  name: 'Luqman',         arabic: 'لقمان' },
  { number: 32,  name: 'As-Sajdah',      arabic: 'السجدة' },
  { number: 33,  name: 'Al-Ahzab',       arabic: 'الأحزاب' },
  { number: 34,  name: 'Saba',           arabic: 'سبأ' },
  { number: 35,  name: 'Fatir',          arabic: 'فاطر' },
  { number: 36,  name: 'Ya-Sin',         arabic: 'يس' },
  { number: 37,  name: 'As-Saffat',      arabic: 'الصافات' },
  { number: 38,  name: 'Sad',            arabic: 'ص' },
  { number: 39,  name: 'Az-Zumar',       arabic: 'الزمر' },
  { number: 40,  name: 'Ghafir',         arabic: 'غافر' },
  { number: 41,  name: 'Fussilat',       arabic: 'فصلت' },
  { number: 42,  name: 'Ash-Shura',      arabic: 'الشورى' },
  { number: 43,  name: 'Az-Zukhruf',     arabic: 'الزخرف' },
  { number: 44,  name: 'Ad-Dukhan',      arabic: 'الدخان' },
  { number: 45,  name: 'Al-Jathiyah',    arabic: 'الجاثية' },
  { number: 46,  name: 'Al-Ahqaf',       arabic: 'الأحقاف' },
  { number: 47,  name: 'Muhammad',       arabic: 'محمد' },
  { number: 48,  name: 'Al-Fath',        arabic: 'الفتح' },
  { number: 49,  name: 'Al-Hujurat',     arabic: 'الحجرات' },
  { number: 50,  name: 'Qaf',            arabic: 'ق' },
  { number: 51,  name: 'Adh-Dhariyat',   arabic: 'الذاريات' },
  { number: 52,  name: 'At-Tur',         arabic: 'الطور' },
  { number: 53,  name: 'An-Najm',        arabic: 'النجم' },
  { number: 54,  name: 'Al-Qamar',       arabic: 'القمر' },
  { number: 55,  name: 'Ar-Rahman',      arabic: 'الرحمن' },
  { number: 56,  name: 'Al-Waqiah',      arabic: 'الواقعة' },
  { number: 57,  name: 'Al-Hadid',       arabic: 'الحديد' },
  { number: 58,  name: 'Al-Mujadila',    arabic: 'المجادلة' },
  { number: 59,  name: 'Al-Hashr',       arabic: 'الحشر' },
  { number: 60,  name: 'Al-Mumtahanah', arabic: 'الممتحنة' },
  { number: 61,  name: 'As-Saf',         arabic: 'الصف' },
  { number: 62,  name: 'Al-Jumuah',      arabic: 'الجمعة' },
  { number: 63,  name: 'Al-Munafiqun',   arabic: 'المنافقون' },
  { number: 64,  name: 'At-Taghabun',    arabic: 'التغابن' },
  { number: 65,  name: 'At-Talaq',       arabic: 'الطلاق' },
  { number: 66,  name: 'At-Tahrim',      arabic: 'التحريم' },
  { number: 67,  name: 'Al-Mulk',        arabic: 'الملك' },
  { number: 68,  name: 'Al-Qalam',       arabic: 'القلم' },
  { number: 69,  name: 'Al-Haqqah',      arabic: 'الحاقة' },
  { number: 70,  name: "Al-Ma'arij",     arabic: 'المعارج' },
  { number: 71,  name: 'Nuh',            arabic: 'نوح' },
  { number: 72,  name: 'Al-Jinn',        arabic: 'الجن' },
  { number: 73,  name: 'Al-Muzzammil',   arabic: 'المزمل' },
  { number: 74,  name: 'Al-Muddaththir', arabic: 'المدثر' },
  { number: 75,  name: 'Al-Qiyamah',     arabic: 'القيامة' },
  { number: 76,  name: 'Al-Insan',       arabic: 'الإنسان' },
  { number: 77,  name: 'Al-Mursalat',    arabic: 'المرسلات' },
  { number: 78,  name: "An-Naba'",       arabic: 'النبأ' },
  { number: 79,  name: "An-Nazi'at",     arabic: 'النازعات' },
  { number: 80,  name: 'Abasa',          arabic: 'عبس' },
  { number: 81,  name: 'At-Takwir',      arabic: 'التكوير' },
  { number: 82,  name: 'Al-Infitar',     arabic: 'الانفطار' },
  { number: 83,  name: 'Al-Mutaffifin',  arabic: 'المطففين' },
  { number: 84,  name: 'Al-Inshiqaq',    arabic: 'الانشقاق' },
  { number: 85,  name: 'Al-Buruj',       arabic: 'البروج' },
  { number: 86,  name: 'At-Tariq',       arabic: 'الطارق' },
  { number: 87,  name: "Al-A'la",        arabic: 'الأعلى' },
  { number: 88,  name: 'Al-Ghashiyah',   arabic: 'الغاشية' },
  { number: 89,  name: 'Al-Fajr',        arabic: 'الفجر' },
  { number: 90,  name: 'Al-Balad',       arabic: 'البلد' },
  { number: 91,  name: 'Ash-Shams',      arabic: 'الشمس' },
  { number: 92,  name: 'Al-Layl',        arabic: 'الليل' },
  { number: 93,  name: 'Ad-Duha',        arabic: 'الضحى' },
  { number: 94,  name: 'Ash-Sharh',      arabic: 'الشرح' },
  { number: 95,  name: 'At-Tin',         arabic: 'التين' },
  { number: 96,  name: "Al-'Alaq",       arabic: 'العلق' },
  { number: 97,  name: 'Al-Qadr',        arabic: 'القدر' },
  { number: 98,  name: 'Al-Bayyinah',    arabic: 'البينة' },
  { number: 99,  name: 'Az-Zalzalah',    arabic: 'الزلزلة' },
  { number: 100, name: "Al-'Adiyat",     arabic: 'العاديات' },
  { number: 101, name: "Al-Qari'ah",     arabic: 'القارعة' },
  { number: 102, name: 'At-Takathur',    arabic: 'التكاثر' },
  { number: 103, name: "Al-'Asr",        arabic: 'العصر' },
  { number: 104, name: 'Al-Humazah',     arabic: 'الهمزة' },
  { number: 105, name: 'Al-Fil',         arabic: 'الفيل' },
  { number: 106, name: 'Quraysh',        arabic: 'قريش' },
  { number: 107, name: "Al-Ma'un",       arabic: 'الماعون' },
  { number: 108, name: 'Al-Kawthar',     arabic: 'الكوثر' },
  { number: 109, name: 'Al-Kafirun',     arabic: 'الكافرون' },
  { number: 110, name: 'An-Nasr',        arabic: 'النصر' },
  { number: 111, name: 'Al-Masad',       arabic: 'المسد' },
  { number: 112, name: 'Al-Ikhlas',      arabic: 'الإخلاص' },
  { number: 113, name: 'Al-Falaq',       arabic: 'الفلق' },
  { number: 114, name: 'An-Nas',         arabic: 'الناس' },
];

const QuranPlayer = () => {
  const [reciters, setReciters]               = useState([]);
  const [selectedReciter, setSelectedReciter] = useState(null);
  const [currentSurah, setCurrentSurah]       = useState(SURAHS[0]);
  const [isPlaying, setIsPlaying]             = useState(false);
  const [isLoading, setIsLoading]             = useState(false);
  const [error, setError]                     = useState('');
  const [search, setSearch]                   = useState('');
  const audioRef    = useRef(null);
  const audioLoaded = useRef(false);

  useEffect(() => {
    fetch('https://mp3quran.net/api/v3/reciters?language=eng')
      .then((res) => res.json())
      .then((data) => {
        if (data.reciters && data.reciters.length > 0) {
          setReciters(data.reciters);
          setSelectedReciter(data.reciters[0]);
        }
      })
      .catch(() => setError('Failed to load reciters. Please check your connection.'));
  }, []);

  const getAudioUrl = useCallback(
    (surahNumber) => {
      if (!selectedReciter || !selectedReciter.moshaf || selectedReciter.moshaf.length === 0)
        return null;
      const server = selectedReciter.moshaf[0].server;
      const num    = String(surahNumber).padStart(3, '0');
      return `${server}${num}.mp3`;
    },
    [selectedReciter],
  );

  const loadAndPlay = useCallback(
    (surah) => {
      const url = getAudioUrl(surah.number);
      if (!url || !audioRef.current) return;
      setIsLoading(true);
      setError('');
      audioRef.current.src = url;
      audioRef.current.load();
      audioLoaded.current = true;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
          setError('Could not play this surah. Try another reciter.');
        });
    },
    [getAudioUrl],
  );

  const handleSurahClick = (surah) => {
    setCurrentSurah(surah);
    loadAndPlay(surah);
  };

  const handleReciterChange = (e) => {
    const reciter = reciters.find((r) => String(r.id) === e.target.value);
    if (reciter) {
      setSelectedReciter(reciter);
      setIsPlaying(false);
      audioLoaded.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioLoaded.current) {
        loadAndPlay(currentSurah);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handlePrev = () => {
    if (currentSurah.number > 1) {
      const prev = SURAHS[currentSurah.number - 2];
      setCurrentSurah(prev);
      loadAndPlay(prev);
    }
  };

  const handleNext = () => {
    if (currentSurah.number < 114) {
      const next = SURAHS[currentSurah.number];
      setCurrentSurah(next);
      loadAndPlay(next);
    }
  };

  const handleEnded = () => {
    if (currentSurah.number < 114) {
      handleNext();
    } else {
      setIsPlaying(false);
    }
  };

  const filteredSurahs = SURAHS.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.arabic.includes(search) ||
      String(s.number).includes(search),
  );

  return (
    <main className="quran-page">
      <div className="quran-hero">
        <h1 className="quran-title">القرآن الكريم</h1>
        <p className="quran-subtitle">The Holy Quran – Free for All</p>
      </div>

      <div className="container quran-container">
        {error && (
          <div className="alert alert-warning text-center" role="alert">
            {error}
          </div>
        )}

        {/* Reciter selector */}
        <div className="quran-reciter-row">
          <label htmlFor="reciter-select" className="quran-label">
            Reciter
          </label>
          <select
            id="reciter-select"
            className="form-select quran-select"
            value={selectedReciter ? String(selectedReciter.id) : ''}
            onChange={handleReciterChange}
            disabled={reciters.length === 0}
          >
            {reciters.length === 0 && <option>Loading reciters…</option>}
            {reciters.map((r) => (
              <option key={r.id} value={String(r.id)}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Now-playing bar */}
        <div className="quran-player-bar">
          <div className="quran-now-playing">
            <span className="quran-surah-num">{currentSurah.number}.</span>
            <span className="quran-surah-name">{currentSurah.name}</span>
            <span className="quran-surah-arabic">{currentSurah.arabic}</span>
          </div>

          <div className="quran-controls">
            <button
              className="quran-ctrl-btn"
              onClick={handlePrev}
              disabled={currentSurah.number === 1}
              title="Previous surah"
            >
              ⏮
            </button>

            <button
              className="quran-ctrl-btn quran-play-btn"
              onClick={handlePlayPause}
              disabled={isLoading || !selectedReciter}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
            </button>

            <button
              className="quran-ctrl-btn"
              onClick={handleNext}
              disabled={currentSurah.number === 114}
              title="Next surah"
            >
              ⏭
            </button>
          </div>

          <audio
            ref={audioRef}
            onEnded={handleEnded}
            onError={() => {
              setIsLoading(false);
              setIsPlaying(false);
              setError('Audio not available for this surah / reciter combination.');
            }}
          />
        </div>

        {/* Surah list */}
        <div className="quran-search-row">
          <input
            type="text"
            className="form-control quran-search"
            placeholder="Search surah by name or number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="quran-surah-list">
          {filteredSurahs.map((surah) => (
            <button
              key={surah.number}
              className={`quran-surah-item${currentSurah.number === surah.number ? ' active' : ''}`}
              onClick={() => handleSurahClick(surah)}
            >
              <span className="surah-num">{surah.number}</span>
              <span className="surah-en">{surah.name}</span>
              <span className="surah-ar">{surah.arabic}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default QuranPlayer;
