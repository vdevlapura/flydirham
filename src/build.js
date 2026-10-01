// Builds the static HTML pages from src/pages/*.html using one shared layout.
// Run with: npm run build
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const PAGES = path.join(__dirname, "pages");
const SITE = "https://flydirham.com";

const PHONE = "+971 4 235 3931";
const PHONE_LINK = "tel:+97142353931";
const EMAIL = "info@flydirham.com";
const ADDRESS_LINE = "Office 612, Office Court Building, Oud Metha, Dubai";

const SERVICES = [
  ["flights", "Air Tickets"],
  ["hotels", "Hotel Bookings"],
  ["holidays", "Holiday Packages"],
  ["visas", "Visa Services"],
  ["corporate", "Corporate Travel"],
  ["insurance", "Travel Insurance"],
];

// file, <title>, meta description, active nav key, breadcrumb label, hero image (optional)
const PAGES_LIST = [
  { file: "index", title: "FlyDirham Travel | Travel Agency in Oud Metha, Dubai", desc: "FlyDirham is a travel agency in Oud Metha, Dubai. Air tickets, hotel bookings, holiday packages, visa services and corporate travel. Call +971 4 235 3931.", nav: "home" },
  { file: "flights", title: "Air Tickets | FlyDirham Travel Dubai", desc: "Book international and regional flights from Dubai and Sharjah with FlyDirham. Economy, business and group fares quoted in AED.", nav: "services", crumb: "Air Tickets", hero: "airport", heading: "Air Tickets", sub: "Flights from Dubai, Sharjah and Abu Dhabi to anywhere you need to go." },
  { file: "hotels", title: "Hotel Bookings | FlyDirham Travel Dubai", desc: "Hotel and apartment bookings worldwide and UAE staycations, arranged by FlyDirham in Dubai.", nav: "services", crumb: "Hotel Bookings", hero: "resort", heading: "Hotel Bookings", sub: "City hotels, beach resorts and serviced apartments, chosen around your plans." },
  { file: "holidays", title: "Holiday Packages from Dubai | FlyDirham Travel", desc: "Holiday packages from Dubai with flights, hotel, transfers and sightseeing. Tailor-made trips for families, couples and groups.", nav: "services", crumb: "Holiday Packages", hero: "beach", heading: "Holiday Packages", sub: "Flights, hotel, transfers and sightseeing arranged as one trip." },
  { file: "visas", title: "Visa Services in Dubai | FlyDirham Travel", desc: "UAE visit visas and help with Schengen, UK, US and other visa applications for UAE residents.", nav: "services", crumb: "Visa Services", hero: "map", heading: "Visa Services", sub: "UAE visit visas for your guests, and help with your own travel visas." },
  { file: "corporate", title: "Corporate Travel Management Dubai | FlyDirham", desc: "Business travel for UAE companies: flights, hotels and visas with one point of contact and consolidated billing in AED.", nav: "services", crumb: "Corporate Travel", hero: "desk", heading: "Corporate Travel", sub: "One point of contact for your company's flights, hotels and visas." },
  { file: "insurance", title: "Travel Insurance | FlyDirham Travel Dubai", desc: "Travel insurance for trips from the UAE: medical cover, trip cancellation and baggage protection.", nav: "services", crumb: "Travel Insurance", hero: "sky", heading: "Travel Insurance", sub: "Cover for medical costs, cancellations and lost baggage." },
  { file: "destinations", title: "Holiday Destinations from Dubai | FlyDirham Travel", desc: "Popular holiday destinations from Dubai: Turkey, Maldives, Georgia, Thailand, Europe and UAE staycations.", nav: "destinations", crumb: "Destinations", hero: "wing", heading: "Destinations", sub: "Where UAE travellers go, and what to know before you book." },
  { file: "about", title: "About Us | FlyDirham Travel Dubai", desc: "About FlyDirham, a travel agency in Oud Metha, Dubai serving individuals, families and companies across the UAE.", nav: "about", crumb: "About Us", hero: "dubai", heading: "About FlyDirham", sub: "A travel agency in Oud Metha, Dubai." },
  { file: "faq", title: "Frequently Asked Questions | FlyDirham Travel", desc: "Answers to common questions about booking flights, hotels, holidays and visas with FlyDirham in Dubai.", nav: "faq", crumb: "FAQ", heading: "Frequently Asked Questions", sub: "Booking, payments, changes and visas." },
  { file: "contact", title: "Contact Us | FlyDirham Travel, Oud Metha, Dubai", desc: "Contact FlyDirham Travel. Office 612, Office Court Building, near Oud Metha Metro Station, Dubai. Tel +971 4 235 3931.", nav: "contact", crumb: "Contact Us", heading: "Contact Us", sub: "Visit our office, call us or send us a message." },
  { file: "privacy", title: "Privacy Policy | FlyDirham Travel", desc: "How FlyDirham collects and uses personal information.", nav: "", crumb: "Privacy Policy", heading: "Privacy Policy", sub: "Last updated: 1 October 2026" },
  { file: "terms", title: "Terms & Conditions | FlyDirham Travel", desc: "Terms and conditions for bookings made with FlyDirham.", nav: "", crumb: "Terms & Conditions", heading: "Terms & Conditions", sub: "Last updated: 1 October 2026" },
  { file: "404", title: "Page Not Found | FlyDirham Travel", desc: "", nav: "", crumb: "Page not found", heading: "Page not found", sub: "" },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function head(p) {
  const url = p.file === "index" ? SITE + "/" : `${SITE}/${p.file}`;
  const image = `${SITE}/img/${p.hero || "dubai"}.jpg`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
${p.desc ? `<meta name="description" content="${esc(p.desc)}">` : `<meta name="robots" content="noindex">`}
${p.desc ? `<link rel="canonical" href="${url}">` : ""}
<meta property="og:type" content="website">
<meta property="og:site_name" content="FlyDirham Travel">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
<meta name="theme-color" content="#0d2c54">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"TravelAgency","name":"FlyDirham","url":"${SITE}","logo":"${SITE}/favicon.svg","image":"${SITE}/img/dubai.jpg","telephone":"+97142353931","email":"${EMAIL}","address":{"@type":"PostalAddress","streetAddress":"Office 612, Office Court Building, near Oud Metha Metro Station","postOfficeBoxNumber":"124884","addressLocality":"Dubai","addressCountry":"AE"},"openingHours":"Mo-Sa 09:00-18:00"}
</script>
</head>
<body>`;
}

function header(active) {
  const a = (key) => (key === active ? ' class="active"' : "");
  return `
<div class="topbar">
  <div class="wrap">
    <div><span>Tel: <a href="${PHONE_LINK}">${PHONE}</a></span><span>Email: <a href="mailto:${EMAIL}">${EMAIL}</a></span></div>
    <div class="addr">${ADDRESS_LINE} &nbsp;|&nbsp; Mon to Sat, 9:00 am to 6:00 pm</div>
  </div>
</div>
<header class="header">
  <div class="wrap">
    <a href="/" class="brand">
      <img src="/favicon.svg" alt="FlyDirham logo" width="40" height="40">
      <div><span class="brand-name">Fly<em>Dirham</em></span><span class="brand-sub">TRAVEL &amp; TOURISM</span></div>
    </a>
    <nav aria-label="Main">
      <button class="burger" aria-label="Menu" aria-expanded="false">&#9776;</button>
      <ul>
        <li><a href="/"${a("home")}>Home</a></li>
        <li class="has-sub"><a href="/flights"${a("services")}>Services</a>
          <ul class="sub">
${SERVICES.map(([f, n]) => `            <li><a href="/${f}">${n}</a></li>`).join("\n")}
          </ul>
        </li>
        <li><a href="/destinations"${a("destinations")}>Destinations</a></li>
        <li><a href="/about"${a("about")}>About Us</a></li>
        <li><a href="/faq"${a("faq")}>FAQ</a></li>
        <li><a href="/contact"${a("contact")}>Contact Us</a></li>
      </ul>
    </nav>
    <a href="/contact" class="btn head-btn">Enquire Now</a>
  </div>
</header>`;
}

function pageHead(p) {
  if (p.file === "index") return "";
  const style = p.hero ? ` style="background-image:linear-gradient(rgba(8,29,56,.6),rgba(8,29,56,.7)),url('/img/${p.hero}.jpg')"` : "";
  return `
<section class="page-banner${p.hero ? " has-img" : ""}"${style}>
  <div class="wrap">
    <ol class="crumbs"><li><a href="/">Home</a></li>${p.nav === "services" ? '<li><a href="/flights">Services</a></li>' : ""}<li>${p.crumb}</li></ol>
    <h1>${p.heading}</h1>
    ${p.sub ? `<p>${p.sub}</p>` : ""}
  </div>
</section>`;
}

const footer = `
<section class="cta-band">
  <div class="wrap">
    <div><h2>Planning a trip?</h2><p>Tell us where and when, and we'll send you options with prices in AED.</p></div>
    <div class="cta-actions"><a class="btn" href="/contact">Request a quote</a><a class="btn btn-light" href="${PHONE_LINK}">Call ${PHONE}</a></div>
  </div>
</section>
<footer>
  <div class="wrap foot">
    <div>
      <span class="brand-name">Fly<em>Dirham</em></span>
      <p style="margin-top:10px">Travel agency in Oud Metha, Dubai. Air tickets, hotels, holiday packages, visas and corporate travel for customers across the UAE.</p>
    </div>
    <div>
      <h4>Services</h4>
      <ul>
${SERVICES.map(([f, n]) => `        <li><a href="/${f}">${n}</a></li>`).join("\n")}
      </ul>
    </div>
    <div>
      <h4>Company</h4>
      <ul>
        <li><a href="/about">About Us</a></li>
        <li><a href="/destinations">Destinations</a></li>
        <li><a href="/faq">FAQ</a></li>
        <li><a href="/contact">Contact Us</a></li>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms &amp; Conditions</a></li>
      </ul>
    </div>
    <div>
      <h4>Visit Us</h4>
      <p>Office 612, Office Court Building<br>Near Oud Metha Metro Station<br>P.O. Box 124884, Dubai, UAE</p>
      <p style="margin-top:8px">Tel: <a href="${PHONE_LINK}">${PHONE}</a><br>Email: <a href="mailto:${EMAIL}">${EMAIL}</a><br>Mon to Sat, 9:00 am to 6:00 pm</p>
    </div>
  </div>
  <div class="bottom"><div class="wrap"><span>&copy; <span class="yr">2026</span> FlyDirham Travel &amp; Tourism. All rights reserved.</span><span><a href="/privacy">Privacy</a> &middot; <a href="/terms">Terms</a> &middot; <a href="/sitemap.xml">Sitemap</a></span></div></div>
</footer>
<script src="/main.js" defer></script>
</body>
</html>
`;

// {{sidebar:Enquiry type}} in a page is replaced with the service-page sidebar
function sidebar(current, enquiry) {
  return `<aside class="side">
  <div class="side-box dark">
    <h3>Talk to us</h3>
    <p>Call or email and we'll put together options for you.</p>
    <p><a href="${PHONE_LINK}" class="side-phone">${PHONE}</a></p>
    <p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
    <a class="btn btn-block" href="/contact?service=${encodeURIComponent(enquiry)}">Send an enquiry</a>
  </div>
  <div class="side-box">
    <h3>Our services</h3>
    <ul class="side-links">
${SERVICES.map(([f, n]) => `      <li><a href="/${f}"${f === current ? ' class="active"' : ""}>${n}</a></li>`).join("\n")}
    </ul>
  </div>
  <div class="side-box">
    <h3>Office</h3>
    <p>Office 612, Office Court Building, near Oud Metha Metro Station, Dubai</p>
    <p>Mon to Sat, 9:00 am to 6:00 pm</p>
  </div>
</aside>`;
}

for (const p of PAGES_LIST) {
  const body = fs
    .readFileSync(path.join(PAGES, p.file + ".html"), "utf8")
    .replace(/\{\{sidebar:([^}]+)\}\}/g, (_m, enquiry) => sidebar(p.file, enquiry));
  const html = head(p) + header(p.nav) + pageHead(p) + "\n" + body.trim() + "\n" + footer;
  fs.writeFileSync(path.join(ROOT, p.file + ".html"), html);
}

const urls = PAGES_LIST.filter((p) => p.desc).map((p) => `  <url><loc>${p.file === "index" ? SITE + "/" : SITE + "/" + p.file}</loc></url>`);
fs.writeFileSync(
  path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`
);
console.log(`Built ${PAGES_LIST.length} pages`);
