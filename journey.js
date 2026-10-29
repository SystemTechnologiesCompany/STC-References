const journeySplit = document.querySelector('#journeySplit');
if (journeySplit) {
  const journeySlider = journeySplit.querySelector('.journey-slider');
  const updateJourneySplit = () => {
    journeySplit.style.setProperty('--split', `${journeySlider.value}%`);
    journeySlider.setAttribute('aria-valuetext', `${journeySlider.value}% study, ${100 - journeySlider.value}% graduation`);
  };
  journeySlider.addEventListener('input', updateJourneySplit);
  updateJourneySplit();
}
