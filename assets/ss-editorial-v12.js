/* Salvatore Sinatra — restrained interaction layer 12.0 */
(()=>{"use strict";
 if(document.documentElement.dataset.ss12Ready==="true")return;
 document.documentElement.dataset.ss12Ready="true";
 const top=document.createElement("button");
 top.type="button";top.className="ss12-top";top.setAttribute("aria-label","Torna all'inizio della pagina");top.title="Torna all'inizio";
 top.textContent="↑";document.body.appendChild(top);
 top.addEventListener("click",()=>{window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});});
 let ticking=false;
 function update(){ticking=false;top.classList.toggle("is-visible",scrollY>520)}
 addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});update();
 const dialog=document.getElementById("photo-dialog");
 if(dialog){dialog.addEventListener("close",()=>{const a=document.querySelector(".portfolio-grid .photo-item button:focus");if(a)a.focus()})}
 const sections=[...document.querySelectorAll("main > section[id]")];
 if("IntersectionObserver" in window&&sections.length){
   const map=new Map([...document.querySelectorAll("#main-nav a[href^='#']")].map(a=>[a.getAttribute("href").slice(1),a]));
   const observer=new IntersectionObserver(entries=>{
     const active=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
     if(!active)return;
     for(const link of map.values())link.removeAttribute("aria-current");
     const chosen=map.get(active.target.id);if(chosen)chosen.setAttribute("aria-current","location");
   },{rootMargin:"-20% 0px -65% 0px",threshold:[0,.15,.3]});
   sections.forEach(s=>observer.observe(s));
 }
})();