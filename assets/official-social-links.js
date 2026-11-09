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
      {name:"Facebook Official · ID 61594648539977",url:"https://www.facebook.com/profile.php?id=61594648539977",path:"M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.1 0 2.25.2 2.25.2v2.47H15.2c-1.25 0-1.64.78-1.64 1.58V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0 0 22 12z"},
      {name:"Instagram",url:"https://www.instagram.com/salvatoresinatraofficial/",path:"M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.5-2.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"},
      {name:"WhatsApp Photography · +39 347 777 6454",url:"https://wa.me/393477776454",path:"M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.45 0 .08 5.36.08 11.96c0 2.11.55 4.17 1.6 5.99L0 24l6.22-1.63a11.94 11.94 0 0 0 5.82 1.48h.01C18.64 23.85 24 18.48 24 11.89c0-3.18-1.24-6.17-3.48-8.41zM12.05 21.83a9.91 9.91 0 0 1-5.05-1.38l-.36-.21-3.75.98 1-3.65-.23-.38a9.91 9.91 0 1 1 8.39 4.64zm5.45-7.43c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.93-2.24-.25-.59-.5-.51-.68-.52h-.58c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.08 2.89 1.23 3.09c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.49 1.72.63.72.23 1.38.2 1.9.12.58-.09 1.77-.73 2.02-1.44.25-.72.25-1.34.17-1.47-.07-.12-.27-.2-.57-.35z"}
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
