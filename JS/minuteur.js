
(function() {

  const disp = document.getElementById('time-display');
  const inp = document.getElementById('time-input');
  const incBtn = document.getElementById('inc-btn');
  const decBtn = document.getElementById('dec-btn');
  const startBtn = document.getElementById('toggle-btn');
  const resetBtn = document.getElementById('reset-btn');
  const alertInp = document.getElementById('alert-input');
  const stepSel = document.getElementById('step-select');
  const alertBackdrop = document.getElementById('alert-backdrop');
  const alertText = document.getElementById('alert-text');
  const alertCloseBtn = document.getElementById('alert-close');

  
  let secondsRemaining = 0;
  let timerInterval = null;

  
  function format(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  
  function updateDisplay() {
    disp.textContent = format(secondsRemaining);
  }

 
  function parseTimeInput(inputValue) {
    if (!inputValue || inputValue.trim() === '') {
      return 0;
    }

    const parts = inputValue.trim().split(':').map(Number);

    
    if (parts.some(isNaN)) {
      return 0;
    }

   
    if (parts.length === 1) {
      return Math.max(0, parts[0]);
    }

  
    if (parts.length === 2) {
      return Math.max(0, parts[0] * 60 + parts[1]);
    }

    
    if (parts.length === 3) {
      return Math.max(0, parts[0] * 3600 + parts[1] * 60 + parts[2]);
    }

    return 0;
  }

  
  function start() {
    if (timerInterval) return; 

    
    if (secondsRemaining <= 0) {
      secondsRemaining = parseTimeInput(inp.value);
      if (secondsRemaining <= 0) return; 
      updateDisplay();
    }

    startBtn.textContent = 'Arrêter';
    timerInterval = setInterval(() => {
      secondsRemaining--;
      updateDisplay();

      if (secondsRemaining <= 0) {
        stop();
        showAlert();
      }
    }, 1000);
  }

 
  function stop() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    startBtn.textContent = 'Démarrer';
  }

  
  function reset() {
    stop();
    secondsRemaining = 0;
    inp.value = '';
    updateDisplay();
  }

  
  function showAlert() {
    alertText.textContent = alertInp.value || 'Temps écoulé';
    alertBackdrop.classList.remove('hidden');
  }

  // Gestion des événements 

  incBtn.addEventListener('click', () => {
    const step = parseInt(stepSel.value) || 60;
    secondsRemaining += step;
    updateDisplay();
  });

  decBtn.addEventListener('click', () => {
    const step = parseInt(stepSel.value) || 60;
    secondsRemaining = Math.max(0, secondsRemaining - step);
    updateDisplay();
  });

  startBtn.addEventListener('click', () => {
    if (timerInterval) {
      stop();
    } else {
      start();
    }
  });

  resetBtn.addEventListener('click', reset);

  inp.addEventListener('change', () => {
    secondsRemaining = parseTimeInput(inp.value);
    updateDisplay();
  });

  alertCloseBtn.addEventListener('click', () => {
    alertBackdrop.classList.add('hidden');
  });

  
  updateDisplay();
})();