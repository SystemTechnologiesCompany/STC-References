const worldFallbackStage = document.querySelector('#worldStage');
if (worldFallbackStage) {
  worldFallbackStage.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = worldFallbackStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    worldFallbackStage.style.setProperty('--fallback-yaw', `${x * 18}deg`);
    worldFallbackStage.style.setProperty('--fallback-pitch', `${-y * 12}deg`);
  });
  worldFallbackStage.addEventListener('pointerleave', () => {
    worldFallbackStage.style.setProperty('--fallback-yaw', '0deg');
    worldFallbackStage.style.setProperty('--fallback-pitch', '0deg');
  });
  document.querySelectorAll('[data-world-group]').forEach((button) => {
    button.addEventListener('click', () => {
      worldFallbackStage.dataset.group = button.dataset.worldGroup;
    });
  });
}
