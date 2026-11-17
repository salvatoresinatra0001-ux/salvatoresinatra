import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

/* Atlas quality gate aligned with the current independent identity portal. */
const root = process.cwd();
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const js = fs.readFileSync(path.join(root, "assets/site.js"), "utf8");
const css = fs.readFileSync(path.join(root, "assets/site.css"), "utf8");
const social = fs.readFileSync(path.join(root, "assets/official-social-links.js"), "utf8");
const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");

const expectedSections = [
  "home", "identita", "framework", "portfolio", "collezioni",
  "visual-arts", "ricerca", "formazione", "technology", "music",
  "projects", "directory", "approccio", "contatti"
];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const links = [...html.matchAll(/href="#([^"]+)"/g)].map(match => match[1]);
const images = [...html.matchAll(/<img\b[^>]*>/g)]
  .map(match => match[0])
  .filter(tag => /\bsrc=/.test(tag));
const sources = images
  .map(tag => tag.match(/\bsrc="([^"]+)"/)?.[1])
  .filter(Boolean);
const visibleText = html
  .replace(/<script[\s\S]*?<\/script>/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&[a-z]+;/g, " ");
const words = visibleText.split(/\s+/).filter(Boolean).length;
const failures = [];

function check(name, fn) {
  try {
    fn();
    console.log("PASS", name);
  } catch (error) {
    failures.push(name + ": " + error.message);
    console.error("FAIL", name, error.message);
  }
}

check("current editorial sections", () => {
  for (const id of expectedSections) assert.ok(ids.includes(id), "Missing " + id);
});
check("unique HTML ids", () => assert.equal(ids.length, new Set(ids).size));
check("internal anchor targets", () => {
  for (const target of links) {
    assert.ok(target === "top" || ids.includes(target), "Missing " + target);
  }
});
check("photographic assets exist", () => {
  assert.equal(images.length, 7, "Expected seven original portfolio photographs");
  for (const src of sources) assert.ok(fs.existsSync(path.join(root, src)), src);
});
check("all photographs have descriptive alt", () => {
  for (const image of images) assert.match(image, /\balt="[^"]{8,}"/);
});
check("no synthetic or stock photography sources", () => {
  assert.doesNotMatch(html, /unsplash|pexels|placeholder\.com|imagegen|stock-photo/i);
});
check("no private identifiers or credentials in public HTML", () => {
  assert.doesNotMatch(html, /\b(?:codice fiscale|IBAN|password|API[_ -]?key|numero di documento)\b/i);
});
check("academic status is accurate", () => {
  assert.match(html, /L-24/);
  assert.match(html, /studente/i);
  assert.match(html, /eCampus/i);
  assert.doesNotMatch(html, /\b(?:laureato|psicologo|psicoterapeuta)\b/i);
});
check("current photographic series and archive", () => {
  for (const series of ["NOIRVEIL", "STILL ECHOES", "TRUE MONOCHROME", "ARCHIVIO FOTOGRAFICO"]) {
    assert.ok(html.includes(series), series);
  }
});
check("functional controls", () => {
  for (const control of ["portfolio-search", "directory-search", "photo-dialog", "data-photo-filter", "data-dir-filter"]) {
    assert.ok(html.includes(control), control);
  }
});
check("monochrome design and motion reduction", () => {
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /--black:/);
});
check("responsive and accessible foundations", () => {
  assert.match(css, /@media/);
  assert.match(css, /focus-visible/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-label=/);
});
check("JavaScript implementation", () => {
  for (const feature of ["showModal", "updatePhotos", "updateDirectory", "aria-pressed"]) {
    assert.ok(js.includes(feature), feature);
  }
});
check("substantive editorial copy", () => {
  assert.ok(words >= 1500, "Only " + words + " words; target >= 1500");
});
check("SEO metadata and canonical host", () => {
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta name="description"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/www\.salvatoresinatra\.it\//);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:url"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="robots"/);
});
check("robots.txt and sitemap are present and use the www host", () => {
  assert.match(robots, /Sitemap: https:\/\/www\.salvatoresinatra\.it\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/www\.salvatoresinatra\.it\/<\/loc>/);
});
check("official social profile allowlist", () => {
  const combined = html + "\n" + social;
  const found = combined.match(/https:\/\/(?:www\.)?(?:facebook\.com|instagram\.com|x\.com|linkedin\.com)\/[^\s"'<>]+/g) || [];
  const allowed = [
    "https://www.facebook.com/profile.php?id=61594648539977",
    "https://www.instagram.com/salvatoresinatraofficial/"
  ];
  assert.deepEqual([...new Set(found)].sort(), allowed.sort());
});
check("Schema.org Person and WebSite graph", () => {
  const raw = html.split('<script type="application/ld+json">')[1]?.split("</script>")[0];
  assert.ok(raw, "Missing JSON-LD");
  const graph = JSON.parse(raw);
  const person = (graph["@graph"] || []).find(item => item["@type"] === "Person");
  const types = (graph["@graph"] || []).map(item => item["@type"]);
  assert.ok(person, "Missing Person entity");
  assert.ok(types.includes("WebSite"), "Missing WebSite entity");
  assert.deepEqual(person.sameAs, [
    "https://www.facebook.com/profile.php?id=61594648539977",
    "https://www.instagram.com/salvatoresinatraofficial/"
  ]);
});
check("no inline styling", () => assert.doesNotMatch(html, /\sstyle="/));

console.log("\nAtlas quality audit:", {
  words,
  images: images.length,
  sections: expectedSections.length,
  failures: failures.length
});
if (failures.length) process.exitCode = 1;
