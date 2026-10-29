(() => {
  const config = window.STC_SUPABASE || {};
  const page = document.body.classList.contains('explore-page') ? 'explore.html' : document.body.classList.contains('profile-page') ? 'profile.html' : 'index.html';
  const params = new URLSearchParams(location.search);
  const requested = params.get('next');
  const nextPage = ['explore.html','profile.html'].includes(requested) ? requested : '';
  const isHome = page === 'index.html';
  const modal = document.querySelector('#authModal');

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
  client.auth.onAuthStateChange((event, session) => {
    if (session) unlock(session);
    else if (event === 'SIGNED_OUT') {
      document.documentElement.classList.remove('auth-checking');
      document.body.classList.add('signed-out');
      document.body.classList.remove('auth-required');
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
