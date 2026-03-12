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

uploadBtn.onclick = () => fileInput.click();

fileInput.addEventListener("change", (e) => {
  const files = e.target.files;

  for (let file of files) {
    playlist.push({
      title: file.name,
      file: URL.createObjectURL(file),
    });
  }

  render();
});

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

function updateTitle() {
  if (playlist[player.index]) {
    title.textContent = playlist[player.index].title;
  }
}

playBtn.onclick = () => player.toggle();

nextBtn.onclick = () => player.next();

prevBtn.onclick = () => player.prev();

player.audio.ontimeupdate = () => {
  if (player.audio.duration) {
    progress.value = (player.audio.currentTime / player.audio.duration) * 100;
  }
};

progress.oninput = () => {
  player.audio.currentTime = (progress.value / 100) * player.audio.duration;
};

volume.oninput = () => {
  player.audio.volume = volume.value;
};

fullscreenBtn.onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};
/* ===== EQUALIZER CONTROLS ===== */

const eqSliders = document.querySelectorAll(".eq-band input");

eqSliders.forEach((slider, index) => {
  slider.addEventListener("input", () => {
    player.setEQ(index, slider.value);
  });
});
/* ===== PRESETS DO EQUALIZADOR ===== */

const presetSelect = document.getElementById("presetSelect");

const presets = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0, 0],

  bass: [6, 5, 4, 2, 0, -2, -2, -2, -2],

  rock: [4, 3, 2, 1, 0, 1, 2, 3, 4],

  pop: [-1, 2, 4, 4, 2, 0, -1, -1, -1],
};

presetSelect.addEventListener("change", () => {
  const preset = presets[presetSelect.value];

  if (!preset) return;

  const sliders = document.querySelectorAll(".eq-band input");

  sliders.forEach((slider, index) => {
    slider.value = preset[index];

    player.setEQ(index, preset[index]);
  });
});
