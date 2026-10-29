/* Visual Identity V11 — production HTTP and deployed-asset smoke test. */
import assert from "node:assert/strict";
import fs from "node:fs";
const sites=[
  {name:"Identita ufficiale",url:"https://salvatoresinatra.it/"},
  {name:"Edizione editoriale",url:"https://www.salvatore-sinatra.it/"},
  {name:"Archivio fotografico",url:"https://www.salvatoresinatraphotography.it/"}
];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const report=[];
async function get(url){
  const res=await fetch(url,{signal:AbortSignal.timeout(20000),headers:{"cache-control":"no-cache","user-agent":"SalvatoreSinatra-V11-QA/1.0"}});
  assert.equal(res.status,200,url+" returned HTTP "+res.status);
  return {text:await res.text(),actualUrl:res.url};
}
for(const site of sites){
  let result=null,lastError;
  for(let attempt=1;attempt<=5;attempt++){
    try{
      const home=await get(site.url);
      assert.ok(home.actualUrl.startsWith("https://"),"HTTPS missing for "+site.name);
      assert.ok(home.text.includes("ss11-network"),"Missing V11 identity navigation on "+site.name);
      assert.ok(home.text.includes('assets/ss-editorial-v11.css'),"Missing V11 stylesheet link on "+site.name);
      assert.ok(home.text.includes('assets/ss-editorial-v11.js'),"Missing V11 script link on "+site.name);
      const css=await get(new URL("assets/ss-editorial-v11.css",site.url).href);
      const js=await get(new URL("assets/ss-editorial-v11.js",site.url).href);
      assert.ok(css.text.includes("VISUAL IDENTITY SYSTEM 11.0"),"Incorrect CSS payload on "+site.name);
      assert.ok(js.text.includes("Visual Identity System 11.0"),"Incorrect JS payload on "+site.name);
      const current=(home.text.match(/aria-current="page"/g)||[]).length;
      assert.equal(current,1,"Active domain link missing on "+site.name);
      const images=(home.text.match(/<img\b/gi)||[]).length;
      assert.ok(images>=1,"No photographic or editorial images on "+site.name);
      result={site:site.name,url:site.url,landing:home.actualUrl,http:200,css:200,js:200,links:3,images,attempt};
      console.log("PASS:",JSON.stringify(result));
      break;
    } catch(e){lastError=String(e);console.warn("TRY",attempt,site.name,lastError);if(attempt<5)await sleep(8000);}
  }
  report.push(result??{site:site.name,url:site.url,failed:lastError});
}
fs.mkdirSync("qa-artifacts",{recursive:true});
fs.writeFileSync("qa-artifacts/production-smoke.json",JSON.stringify(report,null,2));
assert.ok(report.every(x=>!x.failed),"Live production discrepancy: "+JSON.stringify(report.filter(x=>x.failed)));
console.log("PRODUCTION V11 HTTP SMOKE PASS");
