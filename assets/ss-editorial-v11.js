/* SALVATORE SINATRA — Visual Identity System 11.0: progressive, keyboard accessible */
(()=>{"use strict";
 if(document.documentElement.dataset.ss11Ready==="true")return;
 document.documentElement.dataset.ss11Ready="true";
 const progress=document.createElement("div");
 progress.className="ss11-progress";progress.setAttribute("aria-hidden","true");progress.setAttribute("data-ss11-progress","");
 document.body.appendChild(progress);
 let scheduled=false;
 const syncProgress=()=>{scheduled=false;const max=document.documentElement.scrollHeight-innerHeight;const percent=max>0?Math.min(100,Math.max(0,scrollY/max*100)):100;progress.style.width=percent.toFixed(2)+"%"};
 const onScroll=()=>{if(!scheduled){scheduled=true;requestAnimationFrame(syncProgress)}};
 addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll,{passive:true});syncProgress();
 const nav=document.querySelector(".top .nav,body>header nav:not(.ss11-network__links)");
 if(nav&&"IntersectionObserver"in window&&!document.querySelector("#main-nav")){
   const pairs=[...nav.querySelectorAll('a[href^="#"]')].map(a=>[a,document.getElementById(a.hash.slice(1))]).filter(x=>x[1]);
   if(pairs.length){
     const observer=new IntersectionObserver(entries=>{
       const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
       if(!visible.length)return;
       for(const [a,target] of pairs) target===visible[0].target?a.setAttribute("aria-current","location"):a.removeAttribute("aria-current");
     },{rootMargin:"-15% 0px -60% 0px",threshold:[0,.2,.5]});
     pairs.forEach(pair=>observer.observe(pair[1]));
   }
 }
 const gallery=document.querySelector("#ss-photo-gallery-v10 .ss-photo-grid");
 if(!gallery||document.getElementById("ss11-lightbox")||!window.HTMLDialogElement)return;
 const figures=[...gallery.querySelectorAll("figure")].filter(f=>f.querySelector("img"));
 if(!figures.length)return;
 const dialog=document.createElement("dialog");dialog.id="ss11-lightbox";dialog.className="ss11-lightbox";dialog.setAttribute("aria-label","Archivio fotografico di Salvatore Sinatra");
 dialog.innerHTML='<div class="ss11-lightbox__bar"><span class="ss11-lightbox__eyebrow">SALVATORE SINATRA / ARCHIVIO FOTOGRAFICO</span><button type="button" data-ss11-close aria-label="Chiudi immagine">CHIUDI ×</button></div><img class="ss11-lightbox__image" alt=""><div class="ss11-lightbox__nav"><button type="button" data-ss11-prev aria-label="Fotografia precedente">← PRECEDENTE</button><div><div class="ss11-lightbox__caption" aria-live="polite"></div><div class="ss11-lightbox__count" aria-live="polite"></div></div><button type="button" data-ss11-next aria-label="Fotografia successiva">SUCCESSIVA →</button></div>';
 document.body.appendChild(dialog);
 const image=dialog.querySelector("img"),caption=dialog.querySelector(".ss11-lightbox__caption"),counter=dialog.querySelector(".ss11-lightbox__count");
 const close=dialog.querySelector("[data-ss11-close]"),prev=dialog.querySelector("[data-ss11-prev]"),next=dialog.querySelector("[data-ss11-next]");
 let current=0,lastTrigger=null;
 const show=()=>{const figure=figures[current],original=figure.querySelector("img");if(!original)return;
 image.src=original.currentSrc||original.src;image.alt=original.alt||"Fotografia autoriale";
 caption.textContent=figure.querySelector("figcaption")?.textContent?.trim()||original.alt||"Archivio";
 counter.textContent=String(current+1).padStart(2,"0")+" / "+String(figures.length).padStart(2,"0");
 prev.disabled=next.disabled=figures.length<2;
 };
 figures.forEach((figure,index)=>{const img=figure.querySelector("img");
 if(!img||img.closest("button,a"))return;
 const trigger=document.createElement("button");trigger.type="button";trigger.className="ss11-photo-trigger";trigger.setAttribute("aria-label","Apri fotografia "+String(index+1)+" di "+figures.length);
 img.replaceWith(trigger);trigger.appendChild(img);
 trigger.addEventListener("click",()=>{current=index;lastTrigger=trigger;show();dialog.showModal();close.focus()});
 });
 const step=delta=>{current=(current+delta+figures.length)%figures.length;show()};
 close.addEventListener("click",()=>dialog.close());
 prev.addEventListener("click",()=>step(-1));next.addEventListener("click",()=>step(1));
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 dialog.addEventListener("keydown",e=>{if(e.key==="ArrowLeft"){e.preventDefault();step(-1)}if(e.key==="ArrowRight"){e.preventDefault();step(1)}});
 dialog.addEventListener("close",()=>{image.removeAttribute("src");lastTrigger?.focus()});
})();
