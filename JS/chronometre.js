(function () {
  const disp = document.getElementById('chrono-display');
  const toggleBtn = document.getElementById('toggle-btn');
  const lapBtn = document.getElementById('lap-btn');
  const resetBtn = document.getElementById('reset-btn');
  const lapsUl = document.getElementById('laps');

  let running = false;
  let startTs = 0;
  let elapsedBase = 0;
  let rafId = null;

  const two = n => String(n).padStart(2, '0');

  // Affichage  mm:ss.cc si < 1h, sinon hh:mm:ss
 
  function format(ms) {
    const total = Math.floor(ms / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    const s = total % 60;
    const m = Math.floor(total / 60) % 60;
    const h = Math.floor(total / 3600);
    return h > 0 ? `${two(h)}:${two(m)}:${two(s)}` : `${two(m)}:${two(s)}.${two(cs)}`;
  }

  function now() { return performance.now(); }
  function render(ms) { disp.textContent = format(ms); }

  function loop() {
    const elapsed = elapsedBase + (running ? now() - startTs : 0);
    render(elapsed);
    if (running) rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    startTs = now();
    toggleBtn.textContent = 'Arrêter';
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (!running) return;
    running = false;
    elapsedBase += now() - startTs;
    toggleBtn.textContent = 'Démarrer';
    if (rafId) cancelAnimationFrame(rafId);
    render(elapsedBase);
  }

  function reset() {
    stop();
    elapsedBase = 0;
    render(0);
    lapsUl.innerHTML = '';
  }

  
  function lap() {
    const current = running ? elapsedBase + (now() - startTs) : elapsedBase;
    if (Math.floor(current) <= 0) return; 
    const li = document.createElement('li');
    li.textContent = format(current);
    lapsUl.prepend(li);
  }

 
  toggleBtn.addEventListener('click', () => (running ? stop() : start()));
  resetBtn.addEventListener('click', reset);
  lapBtn.addEventListener('click', lap);

  
  render(0);
})();
