(function () {
  const nowDisp = document.getElementById('now-display');
  const timeInp = document.getElementById('alarm-time');
  const textInp = document.getElementById('alarm-text');
  const addBtn = document.getElementById('add-alarm');
  const clearPastBtn = document.getElementById('clear-past');
  const list = document.getElementById('alarms');

  const alertBackdrop = document.getElementById('alert-backdrop');
  const alertText = document.getElementById('alert-text');
  const alertCloseBtn = document.getElementById('alert-close');

  
  const alarms = new Map();

  const two = n => String(n).padStart(2, '0');

  function fmtClock(d) {
    return `${two(d.getHours())}:${two(d.getMinutes())}:${two(d.getSeconds())}`;
  }

  function parseTime(str) {
    if (!str) return null;
    const parts = str.trim().split(':').map(Number);
    if (parts.some(Number.isNaN)) return null;

    const now = new Date();
    let h = 0, m = 0, s = 0;

    if (parts.length === 2) [h, m] = parts;
    else if (parts.length === 3) [h, m, s] = parts;
    else return null;

    if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) return null;

    const at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s, 0);
    return at;
  }

  function humanDelta(ms) {
    if (ms <= 0) return 'passée';
    const total = Math.floor(ms / 1000);
    const s = total % 60;
    const m = Math.floor(total / 60) % 60;
    const h = Math.floor(total / 3600);
    if (h > 0) return `dans ${two(h)}:${two(m)}:${two(s)}`;
    return `dans ${two(m)}:${two(s)}`;
  }

  function render() {
    list.innerHTML = '';
    const now = new Date();

  
    const arr = [...alarms.values()].sort((a, b) => a.at - b.at);

    for (const a of arr) {
      const li = document.createElement('li');
      li.style.display = 'grid';
      li.style.gridTemplateColumns = '1fr auto auto';
      li.style.alignItems = 'center';
      li.style.gap = '8px';
      li.style.padding = '8px 6px';

      const statusMs = a.at - now;
      const status = statusMs <= 0 ? 'passée' : humanDelta(statusMs);

      const left = document.createElement('div');
      left.textContent = `${two(a.at.getHours())}:${two(a.at.getMinutes())}:${two(a.at.getSeconds())} — ${a.message || 'Alarme'}`;

      const mid = document.createElement('div');
      mid.textContent = status;
      mid.style.opacity = '0.85';

      const del = document.createElement('button');
      del.className = 'btn danger';
      del.textContent = 'Supprimer';
      del.addEventListener('click', () => {
        alarms.delete(a.id);
        render();
      });

      li.append(left, mid, del);
      list.appendChild(li);
    }
  }

  function showAlert(msg) {
    alertText.textContent = msg || 'Debout';
    alertBackdrop.classList.remove('hidden');
  }

  alertCloseBtn.addEventListener('click', () => {
    alertBackdrop.classList.add('hidden');
  });

  function addAlarm() {
    const at = parseTime(timeInp.value);
    if (!at) return; 

    const now = new Date();

    const id = crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
    alarms.set(id, {
      id,
      at,
      message: textInp.value?.trim() || 'Debout',
      fired: at - now <= 0 
    });

    render();
    
  }

  function clearPast() {
    const now = new Date();
    for (const [id, a] of alarms) {
      if (a.at - now <= 0) alarms.delete(id);
    }
    render();
  }

  
  function tick() {
    const now = new Date();
    nowDisp.textContent = fmtClock(now);

    for (const a of alarms.values()) {
      if (!a.fired && Math.abs(a.at - now) < 1000 && a.at - now <= 0) {
        a.fired = true;
        showAlert(a.message);
      }
    }
    render();
  }

  addBtn.addEventListener('click', addAlarm);
  clearPastBtn.addEventListener('click', clearPast);

  
  nowDisp.textContent = fmtClock(new Date());
  render();
  setInterval(tick, 1000);
})();
