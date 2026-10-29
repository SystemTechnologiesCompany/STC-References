(() => {
  const config = window.STC_SUPABASE || {};
  const page = document.body.classList.contains('explore-page') ? 'explore.html' : document.body.classList.contains('profile-page') ? 'profile.html' : 'index.html';
  const params = new URLSearchParams(location.search);
  const requested = params.get('next');
  const nextPage = ['explore.html','profile.html'].includes(requested) ? requested : '';
  const isHome = page === 'index.html';
  const modal = document.querySelector('#authModal');
  const logoutDialog = document.querySelector('#logoutDialog');
  const updateProfileNavLabel = () => {
    const label = document.querySelector('[data-profile-nav-label]');
    const navLabel = document.querySelector('.main-nav a[href="profile.html"]');
    const french = document.documentElement.lang === 'fr';
    if (label) label.textContent = french ? 'Mon profil' : 'My profile';
    if (navLabel) navLabel.textContent = french ? 'Mon profil' : 'My profile';
    const copy={
      eyebrow:french?'SESSION DU COMPTE':'ACCOUNT SESSION',
      title:french?'Prêt à vous déconnecter':'Ready to sign out',
      description:french?'Vous pourrez vous reconnecter à tout moment. Vos références enregistrées resteront sur cet appareil.':'You can sign back in anytime. Your saved references will stay on this device.',
      stay:french?'Rester connecté':'Stay signed in',
      logout:french?'Déconnexion':'Log out',
      working:french?'Déconnexion en cours…':'Signing out…',
      failed:french?'La déconnexion a échoué. Réessayez.':'Sign out failed. Please try again.',
      close:french?'Fermer':'Close'
    };
    const set=(selector,value)=>{const el=document.querySelector(selector);if(el)el.textContent=value};
    set('[data-logout-nav-label]',copy.logout);set('[data-logout-eyebrow]',copy.eyebrow);set('[data-logout-title]',copy.title);set('[data-logout-description]',copy.description);set('[data-logout-cancel]',copy.stay);set('[data-logout-confirm]',copy.logout);set('#closeLogoutDialog', '×');
    document.querySelector('#closeLogoutDialog')?.setAttribute('aria-label',copy.close);
  };
  document.addEventListener('stc:language',updateProfileNavLabel);

  function promptHomeSignIn() {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    const close = document.querySelector('#closeAuth');
    if (close) close.hidden = false;
    document.querySelector('.auth-tab[data-mode="signin"]')?.click();
    if (!window.supabase || !config.url || !config.anonKey) {
      const message = document.querySelector('#authMessage');
      if (message) { message.textContent = document.documentElement.lang === 'fr' ? 'La connexion au compte doit être configurée avant de continuer.' : 'Account sign-in must be configured before you can continue.'; message.classList.add('error'); }
    }
  }

  function unlock(session) {
    if (!session) return;
    document.documentElement.classList.remove('auth-checking');
    if (nextPage && isHome) { location.replace(nextPage); return; }
    if (!isHome) return;
    document.body.classList.remove('signed-out');
    document.body.classList.add('signed-in');
    updateProfileNavLabel();
    document.body.classList.remove('auth-required');
    document.body.style.overflow = '';
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden','true');
  }

  function showLanding() {
    document.documentElement.classList.remove('auth-checking');
    document.body.classList.add('signed-out');
    if (nextPage) promptHomeSignIn();
  }

  function closeLogoutDialog() { if(logoutDialog)logoutDialog.hidden=true;document.body.style.overflow='';document.querySelector('#logoutButton')?.focus(); }
  document.querySelector('#logoutButton')?.addEventListener('click',()=>{if(!logoutDialog)return;logoutDialog.hidden=false;document.body.style.overflow='hidden';updateProfileNavLabel();document.querySelector('#cancelLogout')?.focus()});
  document.querySelector('#cancelLogout')?.addEventListener('click',closeLogoutDialog);
  document.querySelector('#closeLogoutDialog')?.addEventListener('click',closeLogoutDialog);
  logoutDialog?.addEventListener('click',event=>{if(event.target===logoutDialog)closeLogoutDialog()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&logoutDialog&&!logoutDialog.hidden)closeLogoutDialog()});

  if (!isHome) {
    if (!config.authEnabled || !window.supabase || !config.url || !config.anonKey) {
      location.replace(`index.html?next=${encodeURIComponent(page)}`);
      return;
    }
    const client = window.supabase.createClient(config.url, config.anonKey);
    client.auth.onAuthStateChange((event, session) => {
      if (session) unlock(session);
      else if (event === 'SIGNED_OUT') location.replace('index.html');
    });
    client.auth.getSession().then(({data,error}) => {
      if (error || !data.session) location.replace(`index.html?next=${encodeURIComponent(page)}`);
      else unlock(data.session);
    }).catch(() => location.replace(`index.html?next=${encodeURIComponent(page)}`));
    return;
  }

  if (!config.authEnabled || !window.supabase || !config.url || !config.anonKey) { showLanding(); return; }
  const client = window.supabase.createClient(config.url, config.anonKey);
  document.querySelector('#confirmLogout')?.addEventListener('click',async()=>{
    const button=document.querySelector('#confirmLogout'),status=document.querySelector('#logoutStatus');
    button.disabled=true;
    status.textContent=document.documentElement.lang==='fr'?'Déconnexion en cours…':'Signing out…';
    const{error}=await client.auth.signOut();
    if(error){status.textContent=document.documentElement.lang==='fr'?'La déconnexion a échoué. Réessayez.':'Sign out failed. Please try again.';button.disabled=false;return}
    if(logoutDialog)logoutDialog.hidden=true;
    document.body.style.overflow='';
    status.textContent='';button.disabled=false;
  });
  client.auth.onAuthStateChange((event, session) => {
    if (session) unlock(session);
    else if (event === 'SIGNED_OUT') {
      document.documentElement.classList.remove('auth-checking');
      document.body.classList.add('signed-out');
      document.body.classList.remove('auth-required');
      document.body.classList.remove('signed-in');
      if(logoutDialog)logoutDialog.hidden=true;
      document.body.style.overflow = '';
      modal?.classList.remove('open');
      modal?.setAttribute('aria-hidden','true');
    }
  });
  client.auth.getSession().then(({data,error}) => {
    if (error || !data.session) showLanding();
    else unlock(data.session);
  }).catch(showLanding);
})();
