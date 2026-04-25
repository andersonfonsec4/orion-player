const playlist = [];

const playlistUI = document.getElementById("playlist");

const fileInput = document.getElementById("file-input");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const volume = document.getElementById("volume");
const fullscreenBtn = document.getElementById("fullscreen");

const title = document.getElementById("track-title");
const cover = document.getElementById("cover");

let dragIndex = null;

/* ========================= */
/* 🎵 METADATA (NOVO) */
/* ========================= */

function updateMetadata(file) {
  // fallback
  title.textContent = file.name;
  cover.src = "assets/default-cover.jpg";

  if (!window.jsmediatags) return;

  window.jsmediatags.read(file, {
    onSuccess: function (tag) {
      const { title: songTitle, artist } = tag.tags;

      // 🎧 título + artista
      title.textContent =
        (artist ? artist + " - " : "") + (songTitle || file.name);

      // 💿 capa
      const picture = tag.tags.picture;

      if (picture) {
        let base64String = "";

        for (let i = 0; i < picture.data.length; i++) {
          base64String += String.fromCharCode(picture.data[i]);
        }

        const imageUrl =
          "data:" + picture.format + ";base64," + btoa(base64String);

        cover.src = imageUrl;
      }
    },

    onError: function (error) {
      console.log("Erro metadata:", error);
    },
  });
}

/* ========================= */
/* UPLOAD */
/* ========================= */

fileInput.addEventListener("change", (e) => {
  const files = e.target.files;
  const startIndex = playlist.length;

  for (let file of files) {
    playlist.push({
      title: file.name,
      file: URL.createObjectURL(file),
      raw: file, // 🔥 necessário para metadata
    });
  }

  render();

  if (playlist.length > 0 && !player.audio.src) {
    player.load(startIndex);
    player.play();
    updateTitle();
    updateMetadata(playlist[startIndex].raw);
  }

  fileInput.value = "";
});

/* ========================= */
/* RENDER PLAYLIST */
/* ========================= */

function render() {
  playlistUI.innerHTML = "";

  playlist.forEach((track, i) => {
    const li = document.createElement("li");
    li.draggable = true;

    const name = document.createElement("span");
    name.textContent = track.title;

    name.onclick = () => {
      player.load(i);
      player.play();
      updateTitle();
      updateMetadata(track.raw); // 🔥 aqui entra metadata
    };

    const remove = document.createElement("button");
    remove.textContent = "✕";
    remove.className = "remove";

    remove.onclick = (e) => {
      e.stopPropagation();

      playlist.splice(i, 1);

      if (player.index >= playlist.length) {
        player.index = playlist.length - 1;
      }

      render();
    };

    /* DRAG & DROP */

    li.addEventListener("dragstart", () => {
      dragIndex = i;
    });

    li.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    li.addEventListener("drop", () => {
      const item = playlist.splice(dragIndex, 1)[0];
      playlist.splice(i, 0, item);
      render();
    });

    li.appendChild(name);
    li.appendChild(remove);

    playlistUI.appendChild(li);
  });
}

/* ========================= */
/* UPDATE TITLE */
/* ========================= */

function updateTitle() {
  if (playlist[player.index]) {
    title.textContent = playlist[player.index].title;
  }
}

/* ========================= */
/* CONTROLES */
/* ========================= */

playBtn.onclick = () => {
  if (!playlist.length) return;

  if (!player.audio.src) {
    player.load(0);
    updateTitle();
    updateMetadata(playlist[0].raw);
  }

  player.toggle();
};

nextBtn.onclick = () => {
  if (!playlist.length) return;

  player.next();
  updateMetadata(playlist[player.index].raw);
};

prevBtn.onclick = () => {
  if (!playlist.length) return;

  player.prev();
  updateMetadata(playlist[player.index].raw);
};

/* ========================= */
/* VOLUME */
/* ========================= */

volume.oninput = () => {
  player.audio.volume = volume.value;
};

/* ========================= */
/* FULLSCREEN */
/* ========================= */

fullscreenBtn.onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
};

/* ========================= */
/* EQUALIZER */
/* ========================= */

const eqSliders = document.querySelectorAll(".eq-band input");

eqSliders.forEach((slider, index) => {
  slider.addEventListener("input", () => {
    player.setEQ(index, slider.value);
  });
});

/* ========================= */
/* PRESETS */
/* ========================= */

const presetSelect = document.getElementById("preset");

const presets = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  pop: [-1, 2, 4, 4, 2, 0, -1, -1, -1],
  rock: [4, 3, 2, 1, 0, 1, 2, 3, 4],
  dance: [6, 5, 4, 2, 0, -2, -2, -2, -2],
  jazz: [2, 1, 0, 1, 2, 2, 1, 0, 0],
  classical: [0, 0, 0, 0, 0, 0, 1, 2, 3],
  bass: [6, 5, 3, 1, 0, -1, -2, -2, -3],
  treble: [-2, -2, -1, 0, 1, 3, 5, 6, 6],
  vocal: [-2, -1, 0, 2, 4, 4, 3, 2, 1],
  electronic: [5, 4, 3, 1, 0, 1, 3, 4, 5],
  hiphop: [6, 5, 4, 2, 0, -1, -2, -2, -3],
};

if (presetSelect) {
  presetSelect.addEventListener("change", () => {
    const preset = presets[presetSelect.value];

    if (!preset) return;

    eqSliders.forEach((slider, index) => {
      slider.value = preset[index];
      player.setEQ(index, preset[index]);
    });
  });
}

/* ========================= */
/* MOBILE SIDEBAR */
/* ========================= */

const sidebar = document.querySelector(".sidebar");
const dragBar = document.querySelector(".drag-bar");

if (sidebar && dragBar) {
  dragBar.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}