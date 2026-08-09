(() => {
  const hourHand = document.getElementById('hand-hour');
  const minuteHand = document.getElementById('hand-minute');
  const txt = document.getElementById('clock-text');

  const two = n => String(n).padStart(2, '0');

  function tick() {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();

    txt.textContent = `${two(h)}:${two(m)}:${two(s)}`;
    
    }
  

 
  tick();

  setInterval(tick, 1000);
})();
