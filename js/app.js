/* ============================================
   Quran Player - Application Logic
   ============================================ */

(function () {
  'use strict';

  const API_BASE = 'https://api.alquran.cloud/v1';

  // DOM Elements
  const reciterSelect = document.getElementById('reciter-select');
  const surahSelect = document.getElementById('surah-select');
  const surahInfo = document.getElementById('surah-info');
  const surahArabicName = document.getElementById('surah-arabic-name');
  const surahEnglishName = document.getElementById('surah-english-name');
  const surahTranslation = document.getElementById('surah-translation');
  const surahAyahCount = document.getElementById('surah-ayah-count');
  const surahRevelationType = document.getElementById('surah-revelation-type');
  const nowPlaying = document.getElementById('now-playing');
  const currentAyahNum = document.getElementById('current-ayah-num');
  const totalAyahs = document.getElementById('total-ayahs');
  const progressContainer = document.getElementById('progress-container');
  const progressFill = document.getElementById('progress-fill');
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');
  const btnPlay = document.getElementById('btn-play');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnMute = document.getElementById('btn-mute');
  const volumeIcon = document.getElementById('volume-icon');
  const muteIcon = document.getElementById('mute-icon');
  const volumeSlider = document.getElementById('volume-slider');
  const btnRepeatSurah = document.getElementById('btn-repeat-surah');
  const btnContinuous = document.getElementById('btn-continuous');
  const surahGrid = document.getElementById('surah-grid');
  const surahSearch = document.getElementById('surah-search');
  const audioPlayer = document.getElementById('audio-player');
  const progressBar = document.querySelector('.progress-bar');

  // State
  let reciters = [];
  let surahs = [];
  let currentAyahs = [];
  let currentAyahIndex = 0;
  let isPlaying = false;
  let isMuted = false;
  let repeatSurah = false;
  let continuousPlay = false;
  let selectedReciter = '';
  let selectedSurahNumber = null;
  let isLoading = false;

  // ---- Initialize ----
  async function init() {
    try {
      const [recitersData, surahsData] = await Promise.all([
        fetchJSON(`${API_BASE}/edition?format=audio&type=versebyverse`),
        fetchJSON(`${API_BASE}/surah`)
      ]);

      reciters = recitersData.data || [];
      surahs = surahsData.data || [];

      populateReciters();
      populateSurahs();
      renderSurahGrid();
      setupEventListeners();
      restoreState();
    } catch (err) {
      console.error('Failed to initialize:', err);
      surahGrid.innerHTML = '<div class="loading-spinner">Failed to load data. Please refresh the page.</div>';
    }
  }

  // ---- API Helper ----
  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  // ---- Populate Dropdowns ----
  function populateReciters() {
    reciterSelect.innerHTML = '<option value="">Select a reciter</option>';
    reciters.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.identifier;
      opt.textContent = `${r.englishName} (${r.language.toUpperCase()})`;
      reciterSelect.appendChild(opt);
    });
    reciterSelect.disabled = false;
  }

  function populateSurahs() {
    surahSelect.innerHTML = '<option value="">Select a surah</option>';
    surahs.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.number;
      opt.textContent = `${s.number}. ${s.englishName} - ${s.englishNameTranslation}`;
      surahSelect.appendChild(opt);
    });
    surahSelect.disabled = false;
  }

  // ---- Surah Grid ----
  function renderSurahGrid(filter) {
    const filtered = filter
      ? surahs.filter(s =>
          s.englishName.toLowerCase().includes(filter) ||
          s.englishNameTranslation.toLowerCase().includes(filter) ||
          s.name.includes(filter) ||
          String(s.number) === filter
        )
      : surahs;

    if (filtered.length === 0) {
      surahGrid.innerHTML = '<div class="no-results">No surahs found</div>';
      return;
    }

    surahGrid.innerHTML = filtered.map(s => `
      <div class="surah-card${selectedSurahNumber === s.number ? ' active' : ''}"
           data-surah="${s.number}" role="button" tabindex="0">
        <div class="surah-number">${s.number}</div>
        <div class="surah-card-info">
          <div class="surah-card-english">${s.englishName}</div>
          <div class="surah-card-translation">${s.englishNameTranslation}</div>
          <div class="surah-card-meta">${s.numberOfAyahs} ayahs &middot; ${s.revelationType}</div>
        </div>
        <div class="surah-card-arabic">${s.name}</div>
      </div>
    `).join('');

    // Attach click listeners
    surahGrid.querySelectorAll('.surah-card').forEach(card => {
      card.addEventListener('click', () => {
        const num = parseInt(card.dataset.surah);
        surahSelect.value = num;
        selectSurah(num);
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // ---- Select Surah ----
  async function selectSurah(number) {
    selectedSurahNumber = number;
    const surah = surahs.find(s => s.number === number);
    if (!surah) return;

    // Update info display
    surahArabicName.textContent = surah.name;
    surahEnglishName.textContent = surah.englishName;
    surahTranslation.textContent = surah.englishNameTranslation;
    surahAyahCount.textContent = `${surah.numberOfAyahs} Ayahs`;
    surahRevelationType.textContent = surah.revelationType;
    surahInfo.hidden = false;

    // Highlight in grid
    renderSurahGrid(surahSearch.value.toLowerCase().trim());

    // Save state
    saveState();

    // Load audio if reciter is selected
    if (selectedReciter) {
      await loadSurahAudio(number, selectedReciter);
    }
  }

  // ---- Load Surah Audio ----
  async function loadSurahAudio(surahNumber, reciterIdentifier) {
    if (isLoading) return;
    isLoading = true;

    // Reset player state
    stopPlayback();

    try {
      const data = await fetchJSON(`${API_BASE}/surah/${surahNumber}/${reciterIdentifier}`);
      currentAyahs = data.data.ayahs || [];
      currentAyahIndex = 0;

      if (currentAyahs.length > 0) {
        totalAyahs.textContent = currentAyahs.length;
        currentAyahNum.textContent = 1;
        nowPlaying.hidden = false;
        progressContainer.hidden = false;
        enablePlayerControls(true);
        loadAyah(0);
        // Auto-play
        playAudio();
      }
    } catch (err) {
      console.error('Failed to load surah audio:', err);
    } finally {
      isLoading = false;
    }
  }

  // ---- Audio Playback ----
  function loadAyah(index) {
    if (index < 0 || index >= currentAyahs.length) return;
    currentAyahIndex = index;
    currentAyahNum.textContent = index + 1;
    audioPlayer.src = currentAyahs[index].audio;
    audioPlayer.load();
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    durationTimeEl.textContent = '0:00';
  }

  function playAudio() {
    audioPlayer.play().then(() => {
      isPlaying = true;
      updatePlayButton();
    }).catch(err => {
      console.warn('Playback failed:', err);
    });
  }

  function pauseAudio() {
    audioPlayer.pause();
    isPlaying = false;
    updatePlayButton();
  }

  function stopPlayback() {
    audioPlayer.pause();
    audioPlayer.src = '';
    isPlaying = false;
    currentAyahs = [];
    currentAyahIndex = 0;
    updatePlayButton();
    nowPlaying.hidden = true;
    progressContainer.hidden = true;
    enablePlayerControls(false);
    progressFill.style.width = '0%';
  }

  function updatePlayButton() {
    playIcon.hidden = isPlaying;
    pauseIcon.hidden = !isPlaying;
    btnPlay.title = isPlaying ? 'Pause' : 'Play';
  }

  function enablePlayerControls(enabled) {
    btnPlay.disabled = !enabled;
    btnPrev.disabled = !enabled;
    btnNext.disabled = !enabled;
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ---- Event Listeners ----
  function setupEventListeners() {
    // Reciter selection
    reciterSelect.addEventListener('change', () => {
      selectedReciter = reciterSelect.value;
      saveState();
      if (selectedReciter && selectedSurahNumber) {
        loadSurahAudio(selectedSurahNumber, selectedReciter);
      }
    });

    // Surah selection (dropdown)
    surahSelect.addEventListener('change', () => {
      const num = parseInt(surahSelect.value);
      if (num) selectSurah(num);
    });

    // Play / Pause
    btnPlay.addEventListener('click', () => {
      if (!currentAyahs.length) return;
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });

    // Previous ayah
    btnPrev.addEventListener('click', () => {
      if (currentAyahIndex > 0) {
        loadAyah(currentAyahIndex - 1);
        playAudio();
      }
    });

    // Next ayah
    btnNext.addEventListener('click', () => {
      playNextAyah();
    });

    // Audio time update
    audioPlayer.addEventListener('timeupdate', () => {
      if (audioPlayer.duration) {
        const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = pct + '%';
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
      }
    });

    // Audio loaded metadata
    audioPlayer.addEventListener('loadedmetadata', () => {
      durationTimeEl.textContent = formatTime(audioPlayer.duration);
    });

    // Audio ended - play next ayah
    audioPlayer.addEventListener('ended', () => {
      playNextAyah();
    });

    // Progress bar click
    progressBar.addEventListener('click', (e) => {
      if (!audioPlayer.duration) return;
      const rect = progressBar.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      audioPlayer.currentTime = pct * audioPlayer.duration;
    });

    // Volume
    volumeSlider.addEventListener('input', () => {
      const vol = volumeSlider.value / 100;
      audioPlayer.volume = vol;
      if (vol === 0) {
        isMuted = true;
      } else {
        isMuted = false;
      }
      updateMuteButton();
    });

    // Mute
    btnMute.addEventListener('click', () => {
      isMuted = !isMuted;
      audioPlayer.muted = isMuted;
      updateMuteButton();
    });

    // Repeat surah
    btnRepeatSurah.addEventListener('click', () => {
      repeatSurah = !repeatSurah;
      btnRepeatSurah.classList.toggle('active', repeatSurah);
      if (repeatSurah) {
        continuousPlay = false;
        btnContinuous.classList.remove('active');
      }
    });

    // Continuous play
    btnContinuous.addEventListener('click', () => {
      continuousPlay = !continuousPlay;
      btnContinuous.classList.toggle('active', continuousPlay);
      if (continuousPlay) {
        repeatSurah = false;
        btnRepeatSurah.classList.remove('active');
      }
    });

    // Search
    surahSearch.addEventListener('input', () => {
      renderSurahGrid(surahSearch.value.toLowerCase().trim());
    });

    // Set initial volume
    audioPlayer.volume = volumeSlider.value / 100;
  }

  function updateMuteButton() {
    volumeIcon.hidden = isMuted;
    muteIcon.hidden = !isMuted;
  }

  function playNextAyah() {
    if (currentAyahIndex < currentAyahs.length - 1) {
      // Next ayah in current surah
      loadAyah(currentAyahIndex + 1);
      playAudio();
    } else if (repeatSurah) {
      // Repeat from beginning of surah
      loadAyah(0);
      playAudio();
    } else if (continuousPlay && selectedSurahNumber < 114) {
      // Move to next surah
      const nextSurah = selectedSurahNumber + 1;
      surahSelect.value = nextSurah;
      selectSurah(nextSurah);
    } else {
      // End of playback
      isPlaying = false;
      updatePlayButton();
    }
  }

  // ---- Persist State ----
  function saveState() {
    try {
      localStorage.setItem('quranPlayer', JSON.stringify({
        reciter: selectedReciter,
        surah: selectedSurahNumber
      }));
    } catch (e) { /* ignore */ }
  }

  function restoreState() {
    try {
      const saved = JSON.parse(localStorage.getItem('quranPlayer'));
      if (saved) {
        if (saved.reciter && reciters.find(r => r.identifier === saved.reciter)) {
          selectedReciter = saved.reciter;
          reciterSelect.value = saved.reciter;
        }
        if (saved.surah) {
          surahSelect.value = saved.surah;
          selectSurah(saved.surah);
        }
      }
    } catch (e) { /* ignore */ }
  }

  // ---- Start ----
  init();
})();
