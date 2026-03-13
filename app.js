(function () {
  // --- DOM refs ---
  const setupEl = document.getElementById('setup');
  const timerEl = document.getElementById('timer');
  const phaseLabel = document.getElementById('phaseLabel');
  const roundLabel = document.getElementById('roundLabel');
  const clockEl = document.getElementById('clock');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');

  // --- Settings state ---
  const settings = { rounds: 3, roundTime: 3, restTime: 1, prepTime: 10 };
  const limits = {
    rounds:    { min: 1, max: 20, step: 1 },
    roundTime: { min: 1, max: 10, step: 1 },
    restTime:  { min: 1, max: 5,  step: 1 },
    prepTime:  { min: 5, max: 30, step: 5 },
  };

  // --- Timer state ---
  let intervalId = null;
  let paused = false;
  let secondsLeft = 0;
  let currentRound = 1;
  let phase = 'prep'; // prep | round | rest | done

  // --- Audio helpers (Web Audio beeps) ---
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function beep(freq, duration, count) {
    for (let i = 0; i < count; i++) {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.value = freq;
      gain.gain.value = 0.3;
      const start = audioCtx.currentTime + i * (duration / 1000 + 0.15);
      osc.start(start);
      osc.stop(start + duration / 1000);
    }
  }

  function beepShort() { beep(800, 150, 1); }
  function beepRound() { beep(1000, 200, 3); }
  function beepDone()  { beep(600, 400, 2); }

  // --- Stepper buttons ---
  document.querySelectorAll('.stepper-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const key = btn.dataset.target;
      const dir = Number(btn.dataset.dir);
      const lim = limits[key];
      settings[key] = Math.min(lim.max, Math.max(lim.min, settings[key] + dir * lim.step));
      document.getElementById(key).textContent = settings[key];
    });
  });

  // --- Formatting ---
  function fmt(secs) {
    var m = Math.floor(secs / 60);
    var s = secs % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // --- Render ---
  function render() {
    clockEl.textContent = fmt(secondsLeft);
    clockEl.classList.toggle('warning', phase !== 'done' && secondsLeft <= 10 && secondsLeft > 0);

    phaseLabel.className = 'phase-label ' + phase;

    if (phase === 'prep') {
      phaseLabel.textContent = 'GET READY';
      roundLabel.textContent = 'Round 1 / ' + settings.rounds;
    } else if (phase === 'round') {
      phaseLabel.textContent = 'ROUND';
      roundLabel.textContent = 'Round ' + currentRound + ' / ' + settings.rounds;
    } else if (phase === 'rest') {
      phaseLabel.textContent = 'REST';
      roundLabel.textContent = 'Round ' + currentRound + ' / ' + settings.rounds;
    } else {
      phaseLabel.textContent = 'DONE';
      roundLabel.textContent = 'Great work!';
    }
  }

  // --- Phase transitions ---
  function nextPhase() {
    if (phase === 'prep') {
      phase = 'round';
      currentRound = 1;
      secondsLeft = settings.roundTime * 60;
      beepRound();
    } else if (phase === 'round') {
      if (currentRound >= settings.rounds) {
        phase = 'done';
        secondsLeft = 0;
        beepDone();
        clearInterval(intervalId);
        intervalId = null;
      } else {
        phase = 'rest';
        secondsLeft = settings.restTime * 60;
        beepShort();
      }
    } else if (phase === 'rest') {
      currentRound++;
      phase = 'round';
      secondsLeft = settings.roundTime * 60;
      beepRound();
    }
    render();
  }

  // --- Tick ---
  function tick() {
    if (paused) return;
    secondsLeft--;
    if (secondsLeft === 10) beepShort();
    if (secondsLeft <= 0) {
      secondsLeft = 0;
      render();
      nextPhase();
      return;
    }
    render();
  }

  // --- Start ---
  startBtn.addEventListener('click', function () {
    // Resume audio context (required after user gesture)
    if (audioCtx.state === 'suspended') audioCtx.resume();

    phase = 'prep';
    currentRound = 1;
    secondsLeft = settings.prepTime;
    paused = false;
    pauseBtn.textContent = 'PAUSE';

    setupEl.style.display = 'none';
    timerEl.classList.remove('hidden');
    render();

    intervalId = setInterval(tick, 1000);
  });

  // --- Pause / Resume ---
  pauseBtn.addEventListener('click', function () {
    paused = !paused;
    pauseBtn.textContent = paused ? 'RESUME' : 'PAUSE';
  });

  // --- Reset ---
  resetBtn.addEventListener('click', function () {
    clearInterval(intervalId);
    intervalId = null;
    paused = false;
    timerEl.classList.add('hidden');
    setupEl.style.display = '';
  });
})();
