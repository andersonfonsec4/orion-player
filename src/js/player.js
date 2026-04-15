class Player {
  constructor() {
    this.audio = new Audio();
    this.index = 0;

    this.progress = document.getElementById("progress");
    this.currentTimeEl = document.getElementById("current-time");
    this.durationEl = document.getElementById("duration");
    this.playBtn = document.getElementById("play");

    this.audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();

    this.source = this.audioContext.createMediaElementSource(this.audio);

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;

    this.source.connect(this.analyser);

    this.filters = [
      this.createFilter(60),
      this.createFilter(120),
      this.createFilter(250),
      this.createFilter(500),
      this.createFilter(1000),
      this.createFilter(2000),
      this.createFilter(4000),
      this.createFilter(8000),
      this.createFilter(16000),
    ];

    this.analyser.connect(this.filters[0]);

    for (let i = 0; i < this.filters.length - 1; i++) {
      this.filters[i].connect(this.filters[i + 1]);
    }

    this.filters[this.filters.length - 1].connect(
      this.audioContext.destination,
    );

    /* 🎵 EVENTOS */

    this.audio.addEventListener("timeupdate", () => {
      this.updateProgress();
    });

    this.audio.addEventListener("loadedmetadata", () => {
      this.durationEl.textContent = this.formatTime(this.audio.duration);
    });

    this.audio.addEventListener("ended", () => {
      if (playlist.length === 0) return;
      this.next();
    });

    this.audio.addEventListener("play", () => {
      this.playBtn.textContent = "⏸";
    });

    this.audio.addEventListener("pause", () => {
      this.playBtn.textContent = "▶";
    });

    /* 🎚️ CLIQUE NA BARRA */

    this.progress.addEventListener("input", () => {
      const value = this.progress.value;
      const duration = this.audio.duration;

      this.audio.currentTime = (value / 100) * duration;
    });
  }

  createFilter(freq) {
    const filter = this.audioContext.createBiquadFilter();

    filter.type = "peaking";
    filter.frequency.value = freq;
    filter.Q.value = 1;
    filter.gain.value = 0;

    return filter;
  }

  setEQ(index, value) {
    if (this.filters[index]) {
      this.filters[index].gain.value = value;
    }
  }

  load(index) {
    if (!playlist[index]) return;

    this.index = index;

    this.audio.src = playlist[index].file;
    this.audio.load();
  }

  play() {
    this.audioContext.resume();
    this.audio.play().catch(() => {});
  }

  toggle() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.audio.pause();
    }
  }

  next() {
    this.index++;

    if (this.index >= playlist.length) {
      this.index = 0;
    }

    this.load(this.index);
    this.play();
    updateTitle();
  }

  prev() {
    this.index--;

    if (this.index < 0) {
      this.index = playlist.length - 1;
    }

    this.load(this.index);
    this.play();
    updateTitle();
  }

  /* ⏱️ FORMATAR TEMPO */
  formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${min}:${sec}`;
  }

  /* 🎚️ ATUALIZAR BARRA */
  updateProgress() {
    const current = this.audio.currentTime;
    const duration = this.audio.duration;

    if (!duration) return;

    const progressPercent = (current / duration) * 100;

    this.progress.value = progressPercent;

    this.currentTimeEl.textContent = this.formatTime(current);
  }
}

const player = new Player();
