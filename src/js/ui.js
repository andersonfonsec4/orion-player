const playlist = [];

const playlistUI = document.getElementById("playlist");

const uploadBtn = document.getElementById("upload-btn");
const fileInput = document.getElementById("file-input");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const fullscreenBtn = document.getElementById("fullscreen");

const title = document.getElementById("track-title");

let dragIndex = null;

/* UPLOAD */

fileInput.addEventListener("change", (e) => {
  const files = e.target.files;

  const startIndex = playlist.length;

  for (let file of files) {
    playlist.push({
      title: file.name,
      file: URL.createObjectURL(file),
    });
  }

  render();

  /* AUTOPLAY PRIMEIRA MÚSICA */

  if (playlist.length > 0 && !player.audio.src) {
    player.load(startIndex);
    player.play();
    updateTitle();
  }

  fileInput.value = "";
});

/* RENDER PLAYLIST */

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

/* UPDATE TITLE */

function updateTitle() {
  if (playlist[player.index]) {
    title.textContent = playlist[player.index].title;
  }
}

/* CONTROLES */

playBtn.onclick = () => {
  if (!playlist.length) return;

  if (!player.audio.src) {
    player.load(0);
    updateTitle();
  }

  player.toggle();
};

nextBtn.onclick = () => {
  if (!playlist.length) return;

  player.next();
};

prevBtn.onclick = () => {
  if (!playlist.length) return;

  player.prev();
};

/* PROGRESS */

player.audio.ontimeupdate = () => {
  if (player.audio.duration) {
    progress.value = (player.audio.currentTime / player.audio.duration) * 100;
  }
};

progress.oninput = () => {
  if (player.audio.duration) {
    player.audio.currentTime = (progress.value / 100) * player.audio.duration;
  }
};

/* VOLUME */

volume.oninput = () => {
  player.audio.volume = volume.value;
};

/* FULLSCREEN */

fullscreenBtn.onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
};

/* EQUALIZER */

const eqSliders = document.querySelectorAll(".eq-band input");

eqSliders.forEach((slider, index) => {
  slider.addEventListener("input", () => {
    player.setEQ(index, slider.value);
  });
});

/* PRESETS */

const presetSelect = document.getElementById("preset");

const presets = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0, 0],

  pop: [-1, 2, 4, 4, 2, 0, -1, -1, -1],

  rock: [4, 3, 2, 1, 0, 1, 2, 3, 4],

  dance: [6, 5, 4, 2, 0, -2, -2, -2, -2],
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
/* PLAYLIST DESLIZANTE MOBILE */

const sidebar = document.querySelector(".sidebar");
const dragBar = document.querySelector(".drag-bar");

if (dragBar) {
  dragBar.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}
