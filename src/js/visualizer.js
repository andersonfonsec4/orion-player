const canvas = document.getElementById("music-bars");

const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}

window.addEventListener("resize", resize);

resize();

function draw() {
  requestAnimationFrame(draw);

  if (!player.analyser) return;

  const bufferLength = player.analyser.frequencyBinCount;

  const data = new Uint8Array(bufferLength);

  player.analyser.getByteFrequencyData(data);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / bufferLength;

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = data[i];

    const x = i * barWidth;

    const y = canvas.height - barHeight;

    ctx.fillStyle = "#3b82f6";

    ctx.fillRect(x, y, barWidth - 2, barHeight);
  }
}

draw();
