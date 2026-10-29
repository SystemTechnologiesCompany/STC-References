(() => {
  const header=document.querySelector('.topbar'),nav=header?.querySelector('.main-nav'),toggle=header?.querySelector('#menuToggle');
  if(!header||!nav||!toggle)return;
  const close=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',document.documentElement.lang==='fr'?'Ouvrir le menu':'Open menu')};
  const updateLabel=()=>toggle.setAttribute('aria-label',nav.classList.contains('open')?(document.documentElement.lang==='fr'?'Fermer le menu':'Close menu'):(document.documentElement.lang==='fr'?'Ouvrir le menu':'Open menu'));
  toggle.addEventListener('click',()=>{nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(nav.classList.contains('open')));updateLabel()});
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
  document.addEventListener('click',event=>{if(!header.contains(event.target))close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')close()});
  document.addEventListener('stc:language',updateLabel);
  updateLabel();
})();
