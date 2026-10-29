/* Visual System V11 — automated responsive/browser checks. */
import {chromium} from "playwright";
import {spawn} from "node:child_process";
import fs from "node:fs";
import assert from "node:assert/strict";
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const report=[];
const server=spawn("python3",["-m","http.server","8765","--bind","127.0.0.1"],{stdio:"ignore"});
let browser;
try{
  for(let i=0;i<50;i++){try{const r=await fetch("http://127.0.0.1:8765/index.html");if(r.ok)break;}catch{} await sleep(150);}
  browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  const sizes=[{name:"desktop",width:1440,height:900},{name:"tablet",width:768,height:1024},{name:"mobile",width:390,height:844},{name:"small-mobile",width:320,height:720}];
  fs.mkdirSync("qa-artifacts",{recursive:true});
  for(const size of sizes){
    const page=await browser.newPage({viewport:{width:size.width,height:size.height},deviceScaleFactor:1,reducedMotion:"reduce"});
    const errors=[];
    page.on("pageerror",e=>errors.push(String(e)));
    const response=await page.goto("http://127.0.0.1:8765/",{waitUntil:"domcontentloaded",timeout:30000});
    assert.equal(response.status(),200);
    await page.locator(".ss11-network__link").first().waitFor({timeout:15000});
    await page.waitForTimeout(500);
    const state=await page.evaluate(()=>{
      const network=document.querySelector(".ss11-network");
      const links=[...document.querySelectorAll(".ss11-network__link")];
      const hero=document.querySelector(".hero");
      const header=document.querySelector("header");
      return {
        title:document.title,
        htmlWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,
        networkLinks:links.length,current:links.filter(a=>a.getAttribute("aria-current")==="page").length,
        linkTargets:links.map(a=>a.href),
        networkShown:network?getComputedStyle(network).display!=="none":false,
        heroVisible:!!hero&&hero.getBoundingClientRect().height>0,
        headerVisible:!!header&&header.getBoundingClientRect().height>0,
        imageCount:document.querySelectorAll("img").length,
        progress:!!document.querySelector("[data-ss11-progress]"),
        themeToggle:!!document.querySelector("[data-ss-theme-toggle]")
      };
    });
    assert.equal(state.networkLinks,3,JSON.stringify(state));
    assert.equal(state.current,1,JSON.stringify(state));
    assert.equal(state.networkShown,true);
    assert.equal(state.progress,true);
    assert.equal(state.heroVisible,true);
    assert.equal(state.headerVisible,true);
    assert.ok(state.htmlWidth<=state.clientWidth+3,"Horizontal overflow: "+JSON.stringify(state));
    assert.equal(state.themeToggle,true,"Theme switch was not initialized");
    for(const u of ["salvatoresinatra.it","salvatore-sinatra.it","salvatoresinatraphotography.it"]){
      assert.ok(state.linkTargets.some(v=>v.includes(u)),"Missing network target "+u);
    }
    const galleryCount=await page.locator("#ss-photo-gallery-v10 figure").count();
    if(galleryCount){
      const trigger=page.locator("#ss-photo-gallery-v10 .ss11-photo-trigger").first();
      await trigger.scrollIntoViewIfNeeded();
      await trigger.click();
      const dialog=page.locator("#ss11-lightbox");
      await dialog.waitFor({state:"visible"});
      const fit=await dialog.locator("img").evaluate(e=>getComputedStyle(e).objectFit);
      assert.equal(fit,"contain","Gallery would crop original photo");
      const src=await dialog.locator("img").getAttribute("src");
      assert.ok(src?.length>3);
      await dialog.locator("[data-ss11-next]").click();
      await dialog.locator("[data-ss11-close]").click();
      assert.equal(await dialog.evaluate(e=>e.open),false);
    }
    assert.deepEqual(errors,[],"JavaScript runtime errors on "+size.name+": "+errors.join(" | "));
    if(size.name==="desktop"||size.name==="mobile"){
       await page.screenshot({path:"qa-artifacts/"+size.name+".png",fullPage:true,animations:"disabled",timeout:30000});
    }
    report.push({size:size.name,width:size.width,height:size.height,networkLinks:state.networkLinks,photos:state.imageCount,gallery:galleryCount,overflow:state.htmlWidth-state.clientWidth,errors});
    await page.close();
  }
  fs.writeFileSync("qa-artifacts/results.json",JSON.stringify(report,null,2));
  console.log("VISUAL V11 QA PASS",JSON.stringify(report));
}finally{await browser?.close();server.kill("SIGTERM");}
