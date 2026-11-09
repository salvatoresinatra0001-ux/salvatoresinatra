/* Social Identity Consolidation V2.1 — Salvatore Sinatra. No third-party scripts. */
class OfficialSocialLinks extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const shadow = this.attachShadow({mode: "open"});
    const style = document.createElement("style");
    style.textContent = ':host{display:block;color:inherit}nav{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin:18px 0}a{display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;color:inherit;border:1px solid currentColor;border-radius:50%;opacity:.88;transition:opacity .2s,transform .2s}a:hover,a:focus-visible{opacity:1;transform:translateY(-2px)}a:focus-visible{outline:2px solid currentColor;outline-offset:4px}svg{width:22px;height:22px;fill:currentColor}@media(prefers-reduced-motion:reduce){a{transition:none}}';
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label","Profili social personali ufficiali");
    const entries = [
      {name:"Facebook principale · @salvatore.sinatra.00.01 · ID 100086030065519",url:"https://www.facebook.com/salvatore.sinatra.00.01",path:"M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.1 0 2.25.2 2.25.2v2.47H15.2c-1.25 0-1.64.78-1.64 1.58V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0 0 22 12z"},
      {name:"Facebook Salvatore Sinatra Official · @SalvatoreSinatraOfficial · ID 61594648539977",url:"https://www.facebook.com/SalvatoreSinatraOfficial",path:"M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.1 0 2.25.2 2.25.2v2.47H15.2c-1.25 0-1.64.78-1.64 1.58V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0 0 22 12z"},
      {name:"WhatsApp · Contatto fotografia",url:"https://wa.me/salvatoresinatraphotography_it",path:"M12 2a10 10 0 0 0-8.57 15.15L2 22l4.85-1.43A10 10 0 1 0 12 2zm0 2a8 8 0 1 1 0 16 7.9 7.9 0 0 1-4.2-1.2L5 19l.8-2.8A8 8 0 0 1 12 4z"},
      {name:"Instagram",url:"https://www.instagram.com/salvatoresinatraofficial/",path:"M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-2.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"}
    ];
    for (const entry of entries) {
      const link=document.createElement("a");
      link.href=entry.url;link.target="_blank";link.rel="noopener noreferrer";
      link.title=entry.name;link.setAttribute("aria-label",entry.name+" — collegamento di Salvatore Sinatra (apre nuova scheda)");
      const svg=document.createElementNS("http://www.w3.org/2000/svg","svg");
      svg.setAttribute("viewBox","0 0 24 24");svg.setAttribute("aria-hidden","true");
      const path=document.createElementNS("http://www.w3.org/2000/svg","path");path.setAttribute("d",entry.path);
      svg.appendChild(path);link.appendChild(svg);nav.appendChild(link);
    }
    shadow.append(style,nav);
  }
}
if (!customElements.get("official-social-links")) customElements.define("official-social-links", OfficialSocialLinks);
