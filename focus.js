const focusChallenge = document.querySelector('#focusChallenge');
if (focusChallenge) {
  const focusInstruction = focusChallenge.querySelector('#focusInstruction');
  const focusCenter = focusChallenge.querySelector('#focusCenter');
  let moveFrame = 0;
  let resetTimer = 0;

  focusChallenge.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = focusChallenge.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const distance = Math.hypot(x - centerX, y - centerY);
    if (moveFrame) cancelAnimationFrame(moveFrame);
    moveFrame = requestAnimationFrame(() => {
      focusChallenge.style.setProperty('--cursor-x', `${x}px`);
      focusChallenge.style.setProperty('--cursor-y', `${y}px`);
      focusChallenge.style.setProperty('--tilt-x', `${((x / bounds.width) - 0.5) * 8}deg`);
      focusChallenge.style.setProperty('--tilt-y', `${((y / bounds.height) - 0.5) * -6}deg`);
      focusChallenge.classList.toggle('is-near', distance < Math.min(bounds.width, bounds.height) * 0.2);
      moveFrame = 0;
    });
  });

  focusChallenge.addEventListener('pointerleave', () => {
    focusChallenge.classList.remove('is-near');
    focusChallenge.style.setProperty('--cursor-x', '50%');
    focusChallenge.style.setProperty('--cursor-y', '50%');
    focusChallenge.style.setProperty('--tilt-x', '0deg');
    focusChallenge.style.setProperty('--tilt-y', '0deg');
  });

  focusChallenge.addEventListener('click', (event) => {
    const bounds = focusChallenge.getBoundingClientRect();
    const distance = Math.hypot(event.clientX - (bounds.left + bounds.width / 2), event.clientY - (bounds.top + bounds.height / 2));
    const hit = event.target === focusCenter || event.detail === 0 || distance < Math.min(bounds.width, bounds.height) * 0.12;
    focusChallenge.classList.remove('is-hit', 'is-miss');
    focusChallenge.classList.add(hit ? 'is-hit' : 'is-miss');
    focusInstruction.textContent = hit ? 'Perfectly centered' : 'Bring the light closer to center';
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      focusChallenge.classList.remove('is-hit', 'is-miss');
      focusInstruction.textContent = 'Move the light and find the center';
    }, 2700);
  });
}
