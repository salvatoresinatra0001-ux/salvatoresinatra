/* Salvatore Sinatra — Digital Identity Atlas 3.0 | accessible, dependency-free */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("it").trim();
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const toggle = $(".nav-toggle");
  const nav = $("#main-nav");
  if (toggle && nav) {
    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Apri il menu");
      nav.classList.remove("is-open");
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Chiudi il menu" : "Apri il menu");
      nav.classList.toggle("is-open", open);
    });
    $$("a", nav).forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
    if ("IntersectionObserver" in window) {
      const links = $$('a[href^="#"]', nav);
      const targets = links.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
      const observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (!visible.length) return;
        links.forEach(link => {
          if (link.hash.slice(1) === visible[0].target.id) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }, { rootMargin: "-15% 0px -65% 0px", threshold: [0, 0.1, 0.4] });
      targets.forEach(target => observer.observe(target));
    }
  }

  const photoFigures = $$(".portfolio-grid .photo-item");
  const photoSearch = $("#portfolio-search");
  const photoButtons = $$("[data-photo-filter]");
  const photoCount = $("#portfolio-count");
  const photoEmpty = $("#portfolio-empty");
  let activePhotoFilter = "all";
  let visiblePhotos = [];
  const updatePhotos = () => {
    const query = normalize(photoSearch?.value);
    visiblePhotos = photoFigures.filter(figure => {
      const filterMatches = activePhotoFilter === "all" || figure.dataset.location === activePhotoFilter || figure.dataset.genre === activePhotoFilter;
      const textMatches = !query || normalize(figure.dataset.search).includes(query);
      const show = filterMatches && textMatches;
      figure.hidden = !show;
      return show;
    });
    if (photoCount) photoCount.textContent = visiblePhotos.length + " fotografie su " + photoFigures.length;
    if (photoEmpty) photoEmpty.hidden = visiblePhotos.length > 0;
  };
  photoButtons.forEach(button => button.addEventListener("click", () => {
    activePhotoFilter = button.dataset.photoFilter;
    photoButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    updatePhotos();
  }));
  photoSearch?.addEventListener("input", updatePhotos);
  updatePhotos();

  const dialog = $("#photo-dialog");
  const lightboxImage = $("#lightbox-image");
  const lightboxCaption = $("#lightbox-caption");
  const lightboxIndex = $("#lightbox-index");
  const previous = $("#lightbox-prev");
  const next = $("#lightbox-next");
  const close = $(".lightbox-close", dialog || document);
  let activeIndex = 0;
  const renderLightbox = () => {
    if (!dialog || !lightboxImage || !visiblePhotos.length) return;
    const figure = visiblePhotos[activeIndex];
    const img = $("img", figure);
    if (!img) return;
    lightboxImage.src = img.currentSrc || img.src;
    lightboxImage.alt = img.alt;
    if (lightboxCaption) lightboxCaption.textContent = img.alt;
    if (lightboxIndex) lightboxIndex.textContent = (activeIndex + 1) + " / " + visiblePhotos.length;
    if (previous) previous.disabled = visiblePhotos.length < 2;
    if (next) next.disabled = visiblePhotos.length < 2;
  };
  photoFigures.forEach(figure => {
    $(".photo-open", figure)?.addEventListener("click", () => {
      activeIndex = visiblePhotos.indexOf(figure);
      if (activeIndex < 0 || !dialog || typeof dialog.showModal !== "function") return;
      renderLightbox();
      if (!dialog.open) dialog.showModal();
      close?.focus();
    });
  });
  previous?.addEventListener("click", () => {
    if (!visiblePhotos.length) return;
    activeIndex = (activeIndex + visiblePhotos.length - 1) % visiblePhotos.length;
    renderLightbox();
  });
  next?.addEventListener("click", () => {
    if (!visiblePhotos.length) return;
    activeIndex = (activeIndex + 1) % visiblePhotos.length;
    renderLightbox();
  });
  close?.addEventListener("click", () => dialog?.close());
  dialog?.addEventListener("click", event => {
    if (event.target === dialog) dialog.close();
  });
  dialog?.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") { event.preventDefault(); next?.click(); }
    if (event.key === "ArrowLeft") { event.preventDefault(); previous?.click(); }
  });
  dialog?.addEventListener("close", () => {
    if (lightboxImage) lightboxImage.removeAttribute("src");
  });

  const directoryItems = $$(".atlas-directory article");
  const directorySearch = $("#directory-search");
  const directoryButtons = $$("[data-dir-filter]");
  const directoryCount = $("#directory-count");
  const directoryEmpty = $("#directory-empty");
  let activeDirectoryFilter = "all";
  const updateDirectory = () => {
    const query = normalize(directorySearch?.value);
    let count = 0;
    directoryItems.forEach(item => {
      const show = (activeDirectoryFilter === "all" || item.dataset.category === activeDirectoryFilter) && (!query || normalize(item.dataset.search).includes(query));
      item.hidden = !show;
      if (show) count++;
    });
    if (directoryCount) directoryCount.textContent = count + " risultati su " + directoryItems.length;
    if (directoryEmpty) directoryEmpty.hidden = count > 0;
  };
  directoryButtons.forEach(button => button.addEventListener("click", () => {
    activeDirectoryFilter = button.dataset.dirFilter;
    directoryButtons.forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    updateDirectory();
  }));
  directorySearch?.addEventListener("input", updateDirectory);
  updateDirectory();
})();