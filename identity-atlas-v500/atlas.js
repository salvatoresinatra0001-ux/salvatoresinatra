(() => {
      const searchInput = document.getElementById('link-search');
      const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
      const cards = Array.from(document.querySelectorAll('.link-card'));
      const resultCount = document.getElementById('result-count');
      const noResults = document.getElementById('no-results');
      const toast = document.getElementById('toast');
      let activeFilter = 'all';
      let toastTimer;

      function normalize(value) {
        return (value || '').toLocaleLowerCase('it-IT').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }

      function updateDirectory() {
        const query = normalize(searchInput.value.trim());
        let visible = 0;
        cards.forEach(card => {
          const categoryMatch = activeFilter === 'all' || card.dataset.category === activeFilter;
          const searchable = normalize(card.dataset.search + ' ' + card.textContent + ' ' + card.href);
          const queryMatch = !query || searchable.includes(query);
          const show = categoryMatch && queryMatch;
          card.hidden = !show;
          if (show) visible++;
        });
        document.querySelectorAll('.directory-group').forEach(group => {
          group.hidden = !group.querySelector('.link-card:not([hidden])');
        });
        resultCount.textContent = `${visible} collegamenti visibili su ${cards.length}`;
        noResults.style.display = visible ? 'none' : 'block';
      }

      searchInput.addEventListener('input', updateDirectory);
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          activeFilter = button.dataset.filter;
          filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
          updateDirectory();
        });
      });

      function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
      }

      document.getElementById('copy-main-link').addEventListener('click', async () => {
        const link = 'https://linktr.ee/salvatoresinatra0100011110';
        try {
          await navigator.clipboard.writeText(link);
          showToast('Linktree principale copiato');
        } catch (error) {
          const temp = document.createElement('textarea');
          temp.value = link;
          temp.setAttribute('readonly', '');
          temp.style.position = 'absolute';
          temp.style.left = '-9999px';
          document.body.appendChild(temp);
          temp.select();
          let copied = false;
          try { copied = document.execCommand('copy'); } catch (e) { copied = false; }
          temp.remove();
          showToast(copied ? 'Linktree principale copiato' : link);
        }
      });

      const profileTabs = Array.from(document.querySelectorAll('[data-profile-tab]'));
      const profilePanels = Array.from(document.querySelectorAll('[data-profile-panel]'));
      function activateProfileTab(tab, moveFocus) {
        const name = tab.dataset.profileTab;
        profileTabs.forEach(item => {
          const selected = item === tab;
          item.setAttribute('aria-selected', String(selected));
          item.tabIndex = selected ? 0 : -1;
        });
        profilePanels.forEach(panel => { panel.hidden = panel.dataset.profilePanel !== name; });
        if (moveFocus) tab.focus();
      }
      profileTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activateProfileTab(tab, false));
        tab.addEventListener('keydown', event => {
          let nextIndex = index;
          if (event.key === 'ArrowRight') nextIndex = (index + 1) % profileTabs.length;
          else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + profileTabs.length) % profileTabs.length;
          else if (event.key === 'Home') nextIndex = 0;
          else if (event.key === 'End') nextIndex = profileTabs.length - 1;
          else return;
          event.preventDefault();
          activateProfileTab(profileTabs[nextIndex], true);
        });
      });

      const openNotesButton = document.getElementById('open-profile-notes');
      const profileDetails = Array.from(document.querySelectorAll('#profile-notes details'));
      openNotesButton.addEventListener('click', () => {
        const shouldOpen = profileDetails.some(detail => !detail.open);
        profileDetails.forEach(detail => { detail.open = shouldOpen; });
        openNotesButton.setAttribute('aria-expanded', String(shouldOpen));
        openNotesButton.textContent = shouldOpen ? 'Chiudi tutte le note −' : 'Apri tutte le note +';
      });

      document.getElementById('copy-biography').addEventListener('click', async () => {
        const biographyPanel = document.querySelector('[data-profile-panel="biografia"]');
        const biography = biographyPanel ? biographyPanel.innerText.trim() : 'Salvatore Sinatra, fotografo e autore di arti visive, studente di Scienze Psicologiche.';
        try {
          await navigator.clipboard.writeText(biography);
          showToast('Biografia estesa copiata');
        } catch (error) {
          showToast(biography);
        }
      });

      const progressFill = document.getElementById('reading-progress-fill');
      function updateReadingProgress() {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
        progressFill.style.width = progress + '%';
      }
      window.addEventListener('scroll', updateReadingProgress, { passive: true });
      window.addEventListener('resize', updateReadingProgress);
      updateReadingProgress();

      const facebookProfileUrl = 'https://www.facebook.com/profile.php?id=61594648539977';
      const facebookStorageKey = 'salvatoreSinatraFacebookPublicPostsV1';
      const facebookInputs = Array.from({ length: 5 }, (_, index) => document.getElementById('facebook-post-url-' + (index + 1)));
      const facebookFeedGrid = document.getElementById('facebook-feed-grid');
      const facebookFeedStatus = document.getElementById('facebook-feed-status');
      const facebookFeedCaption = document.getElementById('facebook-feed-caption');
      const facebookConfigMessage = document.getElementById('facebook-config-message');
      const facebookPostLabels = ['Ultimo post pubblicato', 'Secondo più recente', 'Terzo più recente', 'Quarto più recente', 'Quinto più recente'];

      function normalizeFacebookPostUrl(value) {
        try {
          const parsed = new URL((value || '').trim());
          const hostname = parsed.hostname.toLowerCase();
          const allowedHost = hostname === 'facebook.com' || hostname.endsWith('.facebook.com') || hostname === 'fb.watch';
          if (parsed.protocol !== 'https:' || !allowedHost) return null;
          const path = parsed.pathname.toLowerCase();
          const hasPostPath = /\/posts?\//.test(path)
            || /\/permalink\.php$/.test(path) && (parsed.searchParams.has('story_fbid') || parsed.searchParams.has('id'))
            || /\/(photo|photos|reel|watch|videos|share)\//.test(path)
            || /\/(photo|story)\.php$/.test(path) && (parsed.searchParams.has('fbid') || parsed.searchParams.has('story_fbid'));
          if (!hasPostPath) return null;
          parsed.hash = '';
          return parsed.toString();
        } catch (error) {
          return null;
        }
      }

      function makeFacebookPostCard(index, postUrl) {
        const card = document.createElement('article');
        card.className = 'facebook-post-card' + (postUrl ? ' is-embedded' : '');
        const meta = document.createElement('div');
        meta.className = 'facebook-post-meta';
        const number = document.createElement('span');
        number.className = 'facebook-post-number';
        number.textContent = 'Post ' + String(index + 1).padStart(2, '0') + (index === 0 ? ' · più recente' : '');
        const state = document.createElement('span');
        state.className = 'facebook-post-state';
        state.textContent = postUrl ? 'Link inserito' : 'Da configurare';
        meta.append(number, state);
        card.append(meta);

        const body = document.createElement('div');
        body.className = 'facebook-post-body';
        if (postUrl) {
          const embed = document.createElement('iframe');
          embed.className = 'facebook-post-embed';
          embed.loading = 'lazy';
          embed.title = 'Facebook · ' + facebookPostLabels[index];
          embed.referrerPolicy = 'strict-origin-when-cross-origin';
          embed.src = 'https://www.facebook.com/plugins/post.php?href=' + encodeURIComponent(postUrl) + '&show_text=true&width=500';
          embed.setAttribute('allow', 'encrypted-media; picture-in-picture; web-share');
          const fallback = document.createElement('a');
          fallback.className = 'facebook-post-fallback text-link';
          fallback.href = postUrl;
          fallback.target = '_blank';
          fallback.rel = 'noopener noreferrer';
          fallback.textContent = 'Apri il post originale su Facebook ↗';
          body.append(embed, fallback);
        } else {
          const glyph = document.createElement('span');
          glyph.className = 'facebook-post-glyph';
          glyph.setAttribute('aria-hidden', 'true');
          glyph.textContent = String(index + 1).padStart(2, '0');
          const title = document.createElement('h3');
          title.textContent = facebookPostLabels[index];
          const description = document.createElement('p');
          description.textContent = 'Incolla il permalink del post pubblico per incorporare qui il contenuto autentico.';
          const link = document.createElement('a');
          link.className = 'text-link';
          link.href = facebookProfileUrl;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'Apri Facebook per selezionarlo ↗';
          body.append(glyph, title, description, link);
        }
        card.append(body);
        return card;
      }

      function renderFacebookPosts(urls) {
        const safeUrls = Array.from({ length: 5 }, (_, index) => normalizeFacebookPostUrl(urls[index] || ''));
        facebookFeedGrid.replaceChildren(...safeUrls.map((url, index) => makeFacebookPostCard(index, url)));
        const configured = safeUrls.filter(Boolean).length;
        facebookFeedStatus.textContent = configured + ' / 5 post collegati';
        facebookFeedCaption.textContent = configured === 5
          ? 'Cinque permalink configurati · dal più recente al meno recente.'
          : 'Ordine previsto: dal più recente al quinto più recente · ' + (5 - configured) + ' slot ancora da configurare.';
      }

      function readSavedFacebookPosts() {
        try {
          const saved = JSON.parse(window.localStorage.getItem(facebookStorageKey) || '[]');
          return Array.from({ length: 5 }, (_, index) => normalizeFacebookPostUrl(Array.isArray(saved) ? (saved[index] || '') : '') || '');
        } catch (error) {
          return Array(5).fill('');
        }
      }

      let activeFacebookPosts = readSavedFacebookPosts();
      facebookInputs.forEach((input, index) => { input.value = activeFacebookPosts[index]; });
      renderFacebookPosts(activeFacebookPosts);
      if (activeFacebookPosts.some(Boolean)) {
        facebookConfigMessage.textContent = 'Sono stati caricati i permalink salvati localmente in questo browser.';
      }

      document.getElementById('facebook-post-config-form').addEventListener('submit', event => {
        event.preventDefault();
        const entered = facebookInputs.map(input => input.value.trim());
        const invalidIndex = entered.findIndex(value => value && !normalizeFacebookPostUrl(value));
        if (invalidIndex !== -1) {
          facebookConfigMessage.textContent = 'Il campo ' + String(invalidIndex + 1).padStart(2, '0') + ' non sembra un permalink di un singolo post Facebook. Usa il link del post, non quello generale del profilo.';
          facebookInputs[invalidIndex].focus();
          return;
        }
        const safeUrls = entered.map(value => normalizeFacebookPostUrl(value) || '');
        if (!safeUrls.some(Boolean)) {
          facebookConfigMessage.textContent = 'Inserisci almeno un link di post pubblico prima di aggiornare il widget.';
          facebookInputs[0].focus();
          return;
        }
        activeFacebookPosts = safeUrls;
        renderFacebookPosts(activeFacebookPosts);
        try {
          window.localStorage.setItem(facebookStorageKey, JSON.stringify(activeFacebookPosts));
          facebookConfigMessage.textContent = safeUrls.filter(Boolean).length + ' post configurati. I link sono salvati solo in questo browser; per renderli visibili a tutti, aggiungi i permalink al sito pubblicato.';
        } catch (error) {
          facebookConfigMessage.textContent = safeUrls.filter(Boolean).length + ' post caricati per questa sessione. Il browser non ha consentito il salvataggio locale.';
        }
      });

      document.getElementById('clear-facebook-posts').addEventListener('click', () => {
        activeFacebookPosts = Array(5).fill('');
        facebookInputs.forEach(input => { input.value = ''; });
        renderFacebookPosts(activeFacebookPosts);
        try { window.localStorage.removeItem(facebookStorageKey); } catch (error) { /* Storage può essere disabilitato nel browser. */ }
        facebookConfigMessage.textContent = 'Configurazione locale rimossa. I cinque slot sono nuovamente vuoti.';
      });


      const identityMenu = document.getElementById('identity-menu');
      if (identityMenu) {
        document.addEventListener('click', (event) => {
          if (!identityMenu.contains(event.target)) identityMenu.open = false;
        });
        identityMenu.querySelectorAll('.identity-menu-panel a').forEach(link => {
          link.addEventListener('click', () => { identityMenu.open = false; });
        });
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') { identityMenu.open = false; identityMenu.querySelector('summary').focus(); }
        });
      }

      const themeSelect = document.getElementById('theme-select');
      const themeStorageKey = 'salvatoreSinatraLandingThemeV2002';
      function applyTheme(theme) {
        const safeTheme = theme === 'light' ? 'light' : 'dark';
        document.documentElement.dataset.theme = safeTheme;
        themeSelect.value = safeTheme;
        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) themeColor.content = safeTheme === 'dark' ? '#000000' : '#f7f7f4';
      }
      let savedTheme = 'light';
      try {
        const storedTheme = window.localStorage.getItem(themeStorageKey);
        if (storedTheme === 'dark' || storedTheme === 'light') savedTheme = storedTheme;
      } catch (error) { /* Il tema funziona anche senza storage. */ }
      applyTheme(savedTheme);
      themeSelect.addEventListener('change', () => {
        applyTheme(themeSelect.value);
        try { window.localStorage.setItem(themeStorageKey, themeSelect.value); } catch (error) { /* Il tema resta attivo nella sessione. */ }
      });

      document.getElementById('year').textContent = new Date().getFullYear();
      updateDirectory();
    })();