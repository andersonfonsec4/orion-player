class Player {
  constructor() {
    this.audio = new Audio();
    this.index = 0;

    this.progress = document.getElementById("progress");
    this.currentTimeEl = document.getElementById("current-time");
    this.durationEl = document.getElementById("duration");
    this.playBtn = document.getElementById("play");

    this.audio.addEventListener("timeupdate", () => this.updateProgress());

    this.audio.addEventListener("loadedmetadata", () => {
      this.durationEl.textContent = this.formatTime(this.audio.duration);
    });

    this.audio.addEventListener("play", () => {
      this.playBtn.textContent = "⏸";
    });

    this.audio.addEventListener("pause", () => {
      this.playBtn.textContent = "▶";
    });

    // 🔥 NOVO: AUTO NEXT
    this.audio.addEventListener("ended", () => {
      this.next();
    });
  }

  load(index) {
    if (!playlist[index]) return;

    this.index = index;
    this.audio.src = playlist[index].file;
    this.audio.load();

    // 🎵 CAPA TEMPORÁRIA
    document.getElementById("cover").src =
      "https://picsum.photos/300?random=" + index;
  }

  play() {
    this.audio.play();
  }

  toggle() {
    this.audio.paused ? this.play() : this.audio.pause();
  }

  next() {
    if (!playlist.length) return;

    this.index = (this.index + 1) % playlist.length;
    this.load(this.index);
    this.play();
  }

  prev() {
    if (!playlist.length) return;

    this.index = (this.index - 1 + playlist.length) % playlist.length;
    this.load(this.index);
    this.play();
  }

  formatTime(seconds) {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${min}:${sec}`;
  }

  updateProgress() {
    const current = this.audio.currentTime;
    const duration = this.audio.duration;
    if (!duration) return;

    this.progress.value = (current / duration) * 100;
    this.currentTimeEl.textContent = this.formatTime(current);
  }
}

const player = new Player();