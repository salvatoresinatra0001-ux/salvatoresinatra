/* Visual Identity V11 — verify interactive behavior on actual production origins. */
import {chromium} from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs";
const sites=[
  {name:"identity",url:"https://salvatoresinatra.it/"},
  {name:"editorial",url:"https://www.salvatore-sinatra.it/"},
  {name:"photography",url:"https://www.salvatoresinatraphotography.it/"}
];
const results=[];
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
fs.mkdirSync("qa-artifacts/live",{recursive:true});
try{
  for(const site of sites){
    for(const viewport of [{name:"desktop",width:1440,height:900},{name:"mobile",width:390,height:844},{name:"narrow",width:320,height:720}]){
      const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1,reducedMotion:"reduce"});
      const errors=[];page.on("pageerror",e=>errors.push(String(e)));
      const res=await page.goto(site.url,{waitUntil:"domcontentloaded",timeout:45000});
      assert.equal(res.status(),200,site.name+" HTTP status");
      await page.locator(".ss11-network__link").first().waitFor({timeout:10000});
      await page.waitForTimeout(350);
      const info=await page.evaluate(()=>{
        const nav=[...document.querySelectorAll(".ss11-network__link")];
        const doc=document.documentElement;
        return {links:nav.length,current:nav.filter(x=>x.getAttribute("aria-current")==="page").length,overflow:doc.scrollWidth-doc.clientWidth,progress:!!document.querySelector(".ss11-progress"),theme:!!document.querySelector("[data-ss-theme-toggle]"),photos:document.querySelectorAll("img").length};
      });
      assert.equal(info.links,3);assert.equal(info.current,1);
      assert.ok(info.overflow<=3,"Live page overflow on "+site.name+" "+viewport.name+" by "+info.overflow);
      assert.ok(info.progress,"Progress component unavailable");
      assert.ok(info.theme,"Theme switch unavailable");
      const theme=page.locator("[data-ss-theme-toggle]");
      await theme.click();
      assert.equal(await page.locator("html").getAttribute("data-ss-theme"),"light");
      await theme.click();
      assert.equal(await page.locator("html").getAttribute("data-ss-theme"),"dark");
      const gallery=page.locator("#ss-photo-gallery-v10 .ss11-photo-trigger");
      if(await gallery.count()){
        await gallery.first().click();
        const dialog=page.locator("#ss11-lightbox");
        await dialog.waitFor({state:"visible",timeout:10000});
        assert.equal(await dialog.locator("img").evaluate(el=>getComputedStyle(el).objectFit),"contain");
        await dialog.locator("[data-ss11-next]").click();
        await dialog.locator("[data-ss11-close]").click();
        assert.equal(await dialog.evaluate(el=>el.open),false);
      } else if(await page.locator(".portfolio-grid .photo-open").count()){
        const b=page.locator(".portfolio-grid .photo-open").first();
        await b.click();
        const native=page.locator("#photo-dialog");
        await native.waitFor({state:"visible",timeout:10000});
        await native.locator(".lightbox-close").click();
        assert.equal(await native.evaluate(el=>el.open),false);
      }
      assert.deepEqual(errors,[],"Browser JS errors on "+site.name+" "+viewport.name);
      if(viewport.name==="desktop"||viewport.name==="mobile")await page.screenshot({path:"qa-artifacts/live/"+site.name+"-"+viewport.name+".png",fullPage:true,animations:"disabled",timeout:40000});
      const result={site:site.name,viewport:viewport.name,width:viewport.width,http:res.status(),...info,jsErrors:errors};
      console.log("LIVE BROWSER PASS:",JSON.stringify(result));
      results.push(result);
      await page.close();
    }
  }
  fs.writeFileSync("qa-artifacts/live/results.json",JSON.stringify(results,null,2));
  console.log("LIVE V11 BROWSER QA PASS");
}finally{await browser.close();}
