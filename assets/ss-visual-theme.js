/* Salvatore Sinatra — Accessible dark AMOLED / modern light switch, V2.1 */
(()=>{'use strict';
const storageKey='ss-visual-theme-v2';
const body=document.body;
if(!body||document.querySelector('[data-ss-theme-toggle]'))return;
const meta=document.querySelector('meta[name="theme-color"]');
const original=document.documentElement.getAttribute('data-ss-original-theme')||'dark';
let initial=original;
try{const saved=localStorage.getItem(storageKey);if(saved==='light'||saved==='dark')initial=saved;}catch(_){}
const button=document.createElement('button');
button.type='button';button.className='ss-theme-switch';button.setAttribute('data-ss-theme-toggle','');
button.setAttribute('aria-live','polite');
button.title='Cambia tema visivo';
function apply(theme){
 const t=theme==='light'?'light':'dark';
 document.documentElement.dataset.ssTheme=t;
 document.documentElement.style.colorScheme=t;
 if(meta)meta.setAttribute('content',t==='light'?'#fafaf8':'#000000');
 button.textContent=t==='dark'?'☀ Modern Light':'◐ Dark AMOLED';
 button.setAttribute('aria-label',t==='dark'?'Attiva tema chiaro Modern Light':'Attiva tema scuro Dark AMOLED');
 button.setAttribute('aria-pressed',String(t==='light'));
}
apply(initial);
button.addEventListener('click',()=>{
 const next=document.documentElement.dataset.ssTheme==='light'?'dark':'light';
 apply(next);
 try{localStorage.setItem(storageKey,next);}catch(_){}
});
body.appendChild(button);
})();