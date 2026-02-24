// ===== Per-blank correctness check =====

function getBlanks(exId) {
  return document.querySelectorAll('#' + exId + ' .blank');
}

function checkExercise(exId) {
  const blanks = getBlanks(exId);
  let correct = 0;
  blanks.forEach(inp => {
    const ans = (inp.dataset.ans || '').trim();
    const val = inp.value.trim();
    if (val === ans) {
      inp.classList.add('ok');
      inp.classList.remove('err');
      correct++;
    } else {
      inp.classList.add('err');
      inp.classList.remove('ok');
    }
  });
  showFeedback(exId, correct, blanks.length);
  updateScore();
}

function revealExercise(exId) {
  const blanks = getBlanks(exId);
  blanks.forEach(inp => {
    inp.value = inp.dataset.ans;
    inp.classList.add('ok');
    inp.classList.remove('err');
  });
  showFeedback(exId, blanks.length, blanks.length);
  updateScore();
}

function resetExercise(exId) {
  const blanks = getBlanks(exId);
  blanks.forEach(inp => {
    inp.value = '';
    inp.classList.remove('ok', 'err');
  });
  const fb = document.getElementById('fb-' + exId);
  if (fb) { fb.classList.remove('active'); fb.innerHTML = ''; }
  updateScore();
}

function showFeedback(exId, correct, total) {
  const fb = document.getElementById('fb-' + exId);
  if (!fb) return;
  let cls, icon, msg;
  if (correct === total) {
    cls = 'all-ok'; icon = '✅'; msg = `¡Perfecto! Todos los ${total} blancos correctos.`;
  } else if (correct > 0) {
    cls = 'partial'; icon = '⚠️'; msg = `${correct} de ${total} correctos. Revisa los marcados en rojo.`;
  } else {
    cls = 'none'; icon = '❌'; msg = `Ninguno correcto todavía (${total} por completar).`;
  }
  fb.innerHTML = `<div class="feedback-bar ${cls}">${icon} ${msg}</div>`;
  fb.classList.add('active');
}

function updateScore() {
  let totalBlanks = 0, totalCorrect = 0;
  document.querySelectorAll('.blank').forEach(inp => {
    totalBlanks++;
    if (inp.classList.contains('ok')) totalCorrect++;
  });
  document.getElementById('score').textContent = totalCorrect;
  document.getElementById('total').textContent = totalBlanks;
}

document.addEventListener('DOMContentLoaded', () => { updateScore(); });

// ===== From-scratch exercises =====

function toggleSolution(exId) {
  const panel = document.getElementById('sol-' + exId);
  if (!panel) return;
  panel.classList.toggle('open');
  const btn = document.querySelector(`#${exId} .btn-reveal`);
  if (btn) btn.textContent = panel.classList.contains('open') ? '🙈 Ocultar solución' : '👁 Ver solución';
}

// Live checklist counter per free exercise
document.addEventListener('change', e => {
  if (e.target.matches('input[type=checkbox][data-free]')) {
    updateCheckScore(e.target.dataset.free);
  }
});

function updateCheckScore(exId) {
  const all   = document.querySelectorAll(`#${exId} input[type=checkbox]`);
  const ticked = document.querySelectorAll(`#${exId} input[type=checkbox]:checked`);
  const labels = document.querySelectorAll(`#${exId} .checklist-box label`);
  labels.forEach(l => {
    const cb = l.querySelector('input');
    l.style.color = cb.checked ? 'var(--accent2)' : '';
  });
  // Update the global score badge totals
  updateScore();
}
