// JCI Cebu Pubmat Maker: draws a 1080x1350 pubmat on a canvas from the form.
'use strict';
const W = 1080, H = 1350, COL_X = 650, CONTENT_BOTTOM = 1064, BAND_H = 90, FOOT_Y = 1154;
const $ = s => document.querySelector(s);
const cv = $('#cv'), ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
const form = $('#f');

const THEMES = {
  sky:   { name: 'Light + Blue', dark: false, bg: '#f7fafc', col: ['#0aa3e2', '#0097D7', '#0a86c4'], ink: '#130F2D', accent: '#0097D7', muted: '#4b5a75', label: '#6b7891',
           chipBg: '#130F2D', chipInk: '#fff', chipDot: '#57BCBC', rule: '#0097D7', strip: 'navy', dot: 'rgba(31,71,137,.09)', divider: '#cfdae6',
           band: '#130F2D', bandAccent: '#57BCBC', bandSub: '#b9c7dc', tag: '#EFC40F', tagInk: '#130F2D' },
  teal:  { name: 'Light + Teal', dark: false, bg: '#f5fbfb', col: ['#6ccaca', '#57BCBC', '#43a5a5'], ink: '#130F2D', accent: '#1F4789', muted: '#4b5a75', label: '#6b7891',
           chipBg: '#1F4789', chipInk: '#fff', chipDot: '#57BCBC', rule: '#57BCBC', strip: 'navy', dot: 'rgba(31,71,137,.08)', divider: '#cfdae6',
           band: '#1F4789', bandAccent: '#EFC40F', bandSub: '#c9d6e8', tag: '#fff', tagInk: '#1F4789' },
  navy:  { name: 'Navy + Teal', dark: true, bg: '#1F4789', bg2: '#132f63', col: ['#5fc2c2', '#57BCBC', '#3f9a9a'], ink: '#fff', accent: '#57BCBC', muted: '#c9d6e8', label: '#9fb4d0',
           chipBg: '#fff', chipInk: '#1F4789', chipDot: '#57BCBC', rule: '#57BCBC', strip: 'white', dot: 'rgba(255,255,255,.07)', divider: '#d6dee8',
           band: '#130F2D', bandAccent: '#57BCBC', bandSub: '#b9c7dc', tag: '#fff', tagInk: '#1F4789' },
  black: { name: 'Black + Blue', dark: true, bg: '#130F2D', bg2: '#0b0820', col: ['#0aa3e2', '#0097D7', '#0a86c4'], ink: '#fff', accent: '#0097D7', muted: '#c3c9d9', label: '#8f97b3',
           chipBg: '#0097D7', chipInk: '#fff', chipDot: '#fff', rule: '#0097D7', strip: 'white', dot: 'rgba(255,255,255,.06)', divider: '#d6dee8',
           band: '#1F4789', bandAccent: '#57BCBC', bandSub: '#c9d6e8', tag: '#fff', tagInk: '#130F2D' },
};

const STATS0 = { s1n: '', s1l: '', s2n: '', s2l: '', s3n: '', s3l: '' };
const EXAMPLE = {
  mode: 'announce', ...STATS0,
  chip: 'Impact Immersion', kicker: 'JCI Cebu community project', h1: 'Medical', h2: 'Mission', theme: 'sky',
  date: '2026-11-22', t1: '07:30', t2: '12:30', venue: 'Tabunok Central Elementary School', area: 'Tabunok, Talisay City', meet: '', outfit: 'White Community Shirt',
  partners: 'My Mountain Mover and its Greater Heights Foundation', pLabel: 'In partnership with',
  hz: 100, hx: 50, hy: 35, tag: 'Gratitude in motion',
  recOn: true, ry: 30, rLabel: 'On the record', rTitle: 'From San Remigio\nto Tabunok.', rBody: 'Our Impact Immersion went north in May 2025. This Sunday, it comes to Talisay City.',
  band: 'See you in', bandHi: 'Tabunok!', hashtag: 'ImpactImmersion',
};
const BLANK = {
  mode: 'announce', ...STATS0,
  chip: 'Community project', kicker: 'JCI Cebu', h1: 'Project', h2: 'Title', theme: 'sky',
  date: '', t1: '', t2: '', venue: '', area: '', meet: '', outfit: '', partners: '', pLabel: 'In partnership with',
  hz: 100, hx: 50, hy: 40, tag: 'Gratitude in motion', recOn: false, ry: 40, rLabel: 'On the record', rTitle: '', rBody: '',
  band: 'See you', bandHi: 'there!', hashtag: 'JCICebu', pname: '', pill: '',
};

// Post-op example: the San Remigio Impact Immersion group photo (May 2025). No numbers: only real counts go on.
const RECAP_EXAMPLE = {
  ...BLANK, mode: 'recap', chip: 'Impact Immersion', kicker: 'Successfully implemented', h1: 'Impact', h2: 'Immersion', theme: 'sky',
  date: '', venue: 'San Remigio', area: 'Cebu', partners: '', pLabel: 'Thank you to our partners', tag: 'Gratitude in motion',
  hz: 100, hx: 50, hy: 45, band: 'SALAMAT to everyone', bandHi: 'who made it happen!', hashtag: 'ImpactImmersion',
};
const MODE_DEFAULTS = {
  announce: { kicker: 'JCI Cebu community project', band: 'See you', bandHi: 'there!', pLabel: 'In partnership with' },
  recap: { kicker: 'Successfully implemented', band: 'SALAMAT to everyone', bandHi: 'who made it happen!', pLabel: 'Thank you to our partners' },
  photos: { kicker: 'Successfully implemented', band: 'SALAMAT to everyone', bandHi: 'who made it happen!', pLabel: 'Thank you to our partners' },
};
// Confirmed 2027 partners (same roster as the footer), so nobody has to hunt for a logo file.
const PARTNER_LOGOS = [
  ['aznar.png', 'Aznar Shipping'], ['levelup.jpg', 'Level Up Talent Solutions'], ['travelbee.png', 'Travelbee'], ['bighotel.png', 'BIG Hotel'],
  ['pillows.jpg', 'Pillows Hotel'], ['mangtinapay.jpg', 'Mang Tinapay'], ['darmas.png', "Darma's Giftdash"], ['cebuexpress.png', 'Cebu Air Mail Express'],
  ['morningmart.jpg', 'Morning Mart Philippines'], ['java.jpg', 'Java Photography & Film'], ['vans.jpg', 'Vanstravel Tourism'], ['openmic.jpg', 'Open Mic Acoustic Lounge'],
  ['vensu.jpg', 'Vensu PH'], ['jcijapan.png', 'JCI Japan'], ['ganaeat.png', 'Gana Eat'], ['sdh.png', 'Static Data Hosting'],
  ['sante.jpg', 'Santé Barley'], ['ara.jpg', 'ARA Digital Printing Services'], ['legalize.png', 'LegalizePH'], ['neri.jpg', 'Neri Audio'],
  ['sandoni.png', 'Sandoni'], ['djryss.png', 'DJ Ryss'], ['dgx.png', 'DGX Embroidery King'],
];
let state = { ...EXAMPLE };
const images = { hero: null, rec: null, logos: [], photos: [], set: [] }; // set: the project-done photo set [{img, fy, z}]
let sel = 0; // which photo of the set is in the preview // logos: [{src, draw}], photos: [{src, img}]
const assets = {};
let captionEdited = false;

/* ---------- helpers ---------- */
const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
const fileImg = file => loadImg(URL.createObjectURL(file));
// Shrink big phone photos so six of them stay light on a phone.
function shrink(img, max = 1600) {
  const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height, k = Math.min(1, max / Math.max(w, h));
  if (k === 1) return img;
  const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
  const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, c.width, c.height); return c;
}
const F = (w, s) => { ctx.font = `${w} ${s}px "Plus Jakarta Sans", system-ui, sans-serif`; };
const hasLS = 'letterSpacing' in ctx;
const len = t => [...t].length;
const tw = (t, tr = 0) => ctx.measureText(t).width + tr * Math.max(0, len(t) - 1);
function txt(t, x, y, tr = 0) {
  if (!tr) return ctx.fillText(t, x, y);
  if (hasLS) { ctx.letterSpacing = tr + 'px'; ctx.fillText(t, x, y); ctx.letterSpacing = '0px'; return; }
  let cx = x; for (const ch of t) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + tr; }
}
function wrap(t, maxW, tr = 0) {
  const words = String(t).split(/\s+/).filter(Boolean), out = []; let cur = '';
  for (const w of words) { const n = cur ? cur + ' ' + w : w; if (!cur || tw(n, tr) <= maxW) cur = n; else { out.push(cur); cur = w; } }
  if (cur) out.push(cur); return out;
}
function rr(x, y, w, h, r) {
  const [a, b, c, d] = typeof r === 'number' ? [r, r, r, r] : r;
  ctx.beginPath(); ctx.moveTo(x + a, y); ctx.lineTo(x + w - b, y); ctx.quadraticCurveTo(x + w, y, x + w, y + b);
  ctx.lineTo(x + w, y + h - c); ctx.quadraticCurveTo(x + w, y + h, x + w - c, y + h); ctx.lineTo(x + d, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - d); ctx.lineTo(x, y + a); ctx.quadraticCurveTo(x, y, x + a, y); ctx.closePath();
}
function cover(img, x, y, w, h, fx = .5, fy = .5, z = 1) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const s = Math.max(w / iw, h / ih) * z, dw = iw * s, dh = ih * s;
  ctx.drawImage(img, x + (w - dw) * fx, y + (h - dh) * fy, dw, dh);
}
function placeholder(x, y, w, h, label) {
  ctx.fillStyle = '#dfe8f1'; ctx.fillRect(x, y, w, h);
  F(700, 24); ctx.fillStyle = '#6b7891'; ctx.textAlign = 'center'; ctx.fillText(label, x + w / 2, y + h / 2 + 8); ctx.textAlign = 'left';
}
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function fmtDate(v) {
  if (!v) return ''; const [y, m, d] = v.split('-').map(Number); const dt = new Date(y, m - 1, d);
  return `${DAYS[dt.getDay()]}, ${d} ${MONTHS[m - 1]} ${y}`;
}
function fmtT(v) { if (!v) return ''; let [h, m] = v.split(':').map(Number); const ap = h < 12 ? 'AM' : 'PM'; h = h % 12 || 12; return `${h}:${String(m).padStart(2, '0')} ${ap}`; }
const fmtTime = (a, b) => [fmtT(a), fmtT(b)].filter(Boolean).join(' – ');

// Trim empty edges off a logo, and turn an all-white logo navy so it shows on the white plate.
function prepLogo(img) {
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  let d; try { d = x.getImageData(0, 0, c.width, c.height); } catch { return img; }
  const p = d.data; let minX = c.width, minY = c.height, maxX = 0, maxY = 0, lum = 0, n = 0;
  for (let yy = 0; yy < c.height; yy++) for (let xx = 0; xx < c.width; xx++) {
    const i = (yy * c.width + xx) * 4; if (p[i + 3] > 20) {
      if (xx < minX) minX = xx; if (xx > maxX) maxX = xx; if (yy < minY) minY = yy; if (yy > maxY) maxY = yy;
      lum += .2126 * p[i] + .7152 * p[i + 1] + .0722 * p[i + 2]; n++;
    }
  }
  if (!n) return img;
  if (lum / n > 228) { for (let i = 0; i < p.length; i += 4) { p[i] = 24; p[i + 1] = 44; p[i + 2] = 92; } x.putImageData(d, 0, 0); }
  const o = document.createElement('canvas'); o.width = maxX - minX + 1; o.height = maxY - minY + 1;
  o.getContext('2d').drawImage(c, minX, minY, o.width, o.height, 0, 0, o.width, o.height);
  return o;
}

/* ---------- drawing ---------- */
const SHIRT = new Path2D('M8 3 4 5 2 9l3 2 1-1v11h12V10l1 1 3-2-2-4-4-2c-.5 1.6-2 2.5-4 2.5S8.5 4.6 8 3Z');

function drawPartners(T, x, y, g, draw, maxW0) {
  const logos = images.logos;
  if (logos.length) {
    y += 22 * g; F(800, 13);
    const lab = (state.pLabel || '').toUpperCase().trim();
    if (lab) { if (draw) { ctx.fillStyle = T.label; txt(lab, x, y + 11, 2.9); } y += 13 + 10; }
    let items = logos.map(l => { const im = l.draw, a = im.width / im.height, h = Math.min(70, 230 / a); return { im, w: h * a, h }; });
    const gap = 42, total = items.reduce((s, it) => s + it.w, 0) + gap * (items.length - 1), maxW = T.dark ? maxW0 - 28 : maxW0;
    if (total > maxW) { const k2 = maxW / total; items = items.map(it => ({ ...it, w: it.w * k2, h: it.h * k2 })); }
    const rowH = Math.max(...items.map(it => it.h)), rowW = Math.min(total, maxW), pad = T.dark ? 14 : 0;
    if (draw) {
      if (T.dark) { ctx.fillStyle = '#fff'; rr(x, y, rowW + pad * 2, rowH + pad * 2, 14); ctx.fill(); }
      let cx = x + pad;
      items.forEach((it, i) => {
        if (i) { ctx.fillStyle = T.divider; ctx.fillRect(cx + gap / 2 - 1, y + pad + rowH * .1, 2, rowH * .8); cx += gap; }
        ctx.drawImage(it.im, cx, y + pad + (rowH - it.h) / 2, it.w, it.h); cx += it.w;
      });
    }
    y += rowH + pad * 2;
  } else if ((state.partners || '').trim()) {
    y += 20 * g; F(700, 24);
    const lines = wrap('with ' + state.partners.trim(), maxW0);
    lines.forEach((l, i) => { if (draw) { ctx.fillStyle = T.accent; txt(l, x, y + 22); } y += 32; });
  }
  return y;
}

function drawLeft(T, fs, g, draw) {
  const x = 64; let y = 160;
  const chip = (state.chip || '').toUpperCase().trim();
  if (chip) {
    F(800, 17); const w = tw(chip, 3) + 36 + 19;
    if (draw) {
      ctx.fillStyle = T.chipBg; rr(x, y, w, 42, 21); ctx.fill();
      ctx.fillStyle = T.chipDot; ctx.beginPath(); ctx.arc(x + 22.5, y + 21, 4.5, 0, 7); ctx.fill();
      ctx.fillStyle = T.chipInk; txt(chip, x + 37, y + 27.5, 3);
    }
    y += 42 + 24 * g;
  }
  const k = (state.kicker || '').toUpperCase().trim();
  if (k) { F(700, 18); if (draw) { ctx.fillStyle = T.muted; txt(k, x, y + 15, 2.9); } y += 18 + 12 * g; }

  const L = [state.h1, state.h2].map(s => (s || '').trim()).filter(Boolean);
  F(800, fs);
  L.forEach((l, i) => { if (draw) { ctx.fillStyle = i === 1 ? T.accent : T.ink; txt(l, x, y + fs * .8, -.035 * fs); } y += fs * .94; });

  y = drawPartners(T, x, y, g, draw, 540);

  const d = fmtDate(state.date), t = fmtTime(state.t1, state.t2), v = (state.venue || '').trim(), a = (state.area || '').trim();
  if (d || t || v || a || (state.meet || '').trim()) {
    y += 26 * g; const y0 = y, bx = x + 28; y += 4;
    if (d) { F(800, 32); if (draw) { ctx.fillStyle = T.ink; txt(d, bx, y + 31, -.3); } y += 40; }
    if (t) { F(700, 26); if (draw) { ctx.fillStyle = T.accent; txt(t, bx, y + 25); } y += 34; }
    if (v) { y += 10; F(700, 22); for (const l of wrap(v, 500)) { if (draw) { ctx.fillStyle = T.ink; txt(l, bx, y + 21); } y += 30; } }
    if (a) { if (!v) y += 10; F(500, 22); for (const l of wrap(a, 500)) { if (draw) { ctx.fillStyle = T.muted; txt(l, bx, y + 21); } y += 30; } }
    const m = (state.meet || '').trim();
    if (m) {
      y += 10; F(800, 13); const lab = 'MEETING PLACE';
      if (draw) { ctx.fillStyle = T.accent; txt(lab, bx, y + 11, 2.6); } y += 13 + 8;
      F(600, 21); for (const l of wrap(m, 500)) { if (draw) { ctx.fillStyle = T.ink; txt(l, bx, y + 20); } y += 28; }
    }
    y += 4; if (draw) { ctx.fillStyle = T.rule; ctx.fillRect(x, y0, 6, y - y0); }
  }

  const o = (state.outfit || '').trim();
  if (o) {
    y += 20 * g; F(800, 22); const w = 12 + 48 + 16 + Math.max(tw(o), 90) + 22;
    if (draw) {
      ctx.save(); ctx.shadowColor = 'rgba(19,15,45,.10)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
      ctx.fillStyle = '#fff'; rr(x, y, w, 70, 18); ctx.fill(); ctx.restore();
      if (!T.dark) { ctx.strokeStyle = '#dce7f1'; ctx.lineWidth = 2; rr(x + 1, y + 1, w - 2, 68, 17); ctx.stroke(); }
      ctx.fillStyle = '#eaf6fc'; rr(x + 12, y + 11, 48, 48, 12); ctx.fill();
      ctx.save(); ctx.translate(x + 36 - 17, y + 35 - 17); ctx.scale(34 / 24, 34 / 24);
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#0097D7'; ctx.lineWidth = 1.6; ctx.lineJoin = 'round'; ctx.fill(SHIRT); ctx.stroke(SHIRT); ctx.restore();
      F(800, 13); ctx.fillStyle = '#6b7891'; txt('OUTFIT', x + 76, y + 29, 2.6);
      F(800, 22); ctx.fillStyle = '#130F2D'; txt(o, x + 76, y + 55);
    }
    y += 70;
  }
  return y;
}

function drawTag(T, x, y) {
  const tag = (state.tag || '').toUpperCase().trim(); if (!tag) return;
  F(800, 17); const w = tw(tag, 2.4) + 32;
  ctx.save(); ctx.translate(x, y + 20); ctx.rotate(-2 * Math.PI / 180);
  ctx.shadowColor = 'rgba(0,0,0,.18)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10;
  ctx.fillStyle = T.tag; rr(0, -20, w, 40, 8); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.fillStyle = T.tagInk; txt(tag, 16, 6.5, 2.4); ctx.restore();
}

function drawBandAndFooter(T) {
  ctx.fillStyle = T.band; ctx.fillRect(0, CONTENT_BOTTOM, W, BAND_H);
  const b1 = (state.band || '').trim(), b2 = (state.bandHi || '').trim(), mid = CONTENT_BOTTOM + BAND_H / 2 + 12;
  let bs = 36; F(800, bs);
  const bw = () => tw(b1 + (b1 && b2 ? ' ' : '')) + tw(b2);
  const sub = ['JCI Cebu · 79th year', state.hashtag ? '#' + state.hashtag.replace(/^#/, '').replace(/\s+/g, '') : ''].filter(Boolean).join(' · ');
  F(700, 20); const subW = tw(sub, 1.2);
  F(800, bs); while (bw() + subW + 40 > W - 128 && bs > 22) { bs -= 2; F(800, bs); }
  ctx.fillStyle = '#fff'; txt(b1 + (b1 && b2 ? ' ' : ''), 64, mid, -.3);
  ctx.fillStyle = T.bandAccent; txt(b2, 64 + tw(b1 + (b1 && b2 ? ' ' : '')), mid, -.3);
  F(700, 20); ctx.fillStyle = T.bandSub; txt(sub, W - 64 - subW, CONTENT_BOTTOM + BAND_H / 2 + 7, 1.2);
  // confirmed-partners footer (locked)
  if (assets.footer) ctx.drawImage(assets.footer, 0, FOOT_Y, W, H - FOOT_Y);
  else { ctx.fillStyle = '#fff'; ctx.fillRect(0, FOOT_Y, W, H - FOOT_Y); }
}

function drawBase(T, dotsW) {
  if (T.bg2) { const g = ctx.createLinearGradient(0, 0, 0, CONTENT_BOTTOM); g.addColorStop(0, T.bg); g.addColorStop(1, T.bg2); ctx.fillStyle = g; }
  else ctx.fillStyle = T.bg;
  ctx.fillRect(0, 0, W, CONTENT_BOTTOM);
  ctx.fillStyle = T.dot;
  for (let y = 13; y < CONTENT_BOTTOM * .6; y += 26) { ctx.globalAlpha = 1 - y / (CONTENT_BOTTOM * .6); for (let x = 13; x < dotsW; x += 26) { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 7); ctx.fill(); } }
  ctx.globalAlpha = 1;
}
const drawStrip = T => { const strip = T.strip === 'white' ? assets.stripWhite : assets.stripNavy; if (strip) ctx.drawImage(strip, 64, 56, strip.width * 48 / strip.height, 48); };

/* ----- "Project done": the post-operation post. One big group photo, "successfully implemented",
   title, date and venue, thank-you logos and optional real numbers. (VP feedback, 21 Nov 2026: the
   post-op is still an announcement that the project happened, built around one photo of everyone.) ----- */
const statsList = () => [[state.s1n, state.s1l], [state.s2n, state.s2l], [state.s3n, state.s3l]].map(([n, l]) => [(n || '').trim(), (l || '').trim()]).filter(([n, l]) => n || l);
const RIGHT_X = 664, RIGHT_W = 352;

function drawChip(T, x, y, chip, draw) {
  F(800, 17); const w = tw(chip, 3) + 36 + 19;
  if (draw) {
    ctx.fillStyle = T.chipBg; rr(x, y, w, 42, 21); ctx.fill();
    ctx.fillStyle = T.chipDot; ctx.beginPath(); ctx.arc(x + 22.5, y + 21, 4.5, 0, 7); ctx.fill();
    ctx.fillStyle = T.chipInk; txt(chip, x + 37, y + 27.5, 3);
  }
  return w;
}

// Thank-you logos (or partner names) and the optional numbers, in the right-hand column.
function drawRecapRight(T, top, draw) {
  const x = RIGHT_X, w = RIGHT_W; let y = top;
  const lab = (state.pLabel || '').toUpperCase().trim();
  if (images.logos.length) {
    if (lab) { F(800, 13); if (draw) { ctx.fillStyle = T.label; txt(lab, x, y + 11, 2.6); } y += 13 + 14; }
    let items = images.logos.map(l => { const im = l.draw, a = im.width / im.height, h = Math.min(88, 230 / a); return { im, w: h * a, h }; });
    const gap = 30, pad = T.dark ? 14 : 0, maxW = w - pad * 2;
    const total = items.reduce((s, it) => s + it.w, 0) + gap * (items.length - 1);
    if (total > maxW) { const k = maxW / total; items = items.map(it => ({ ...it, w: it.w * k, h: it.h * k })); }
    const rowH = Math.max(...items.map(it => it.h)), rowW = Math.min(total, maxW);
    if (draw) {
      if (T.dark) { ctx.fillStyle = '#fff'; rr(x, y, rowW + pad * 2, rowH + pad * 2, 14); ctx.fill(); }
      let cx = x + pad;
      items.forEach((it, i) => {
        if (i) { ctx.fillStyle = T.divider; ctx.fillRect(cx + gap / 2 - 1, y + pad + rowH * .1, 2, rowH * .8); cx += gap; }
        ctx.drawImage(it.im, cx, y + pad + (rowH - it.h) / 2, it.w, it.h); cx += it.w;
      });
    }
    y += rowH + pad * 2;
  } else if ((state.partners || '').trim()) {
    if (lab) { F(800, 13); if (draw) { ctx.fillStyle = T.label; txt(lab, x, y + 11, 2.6); } y += 13 + 12; }
    F(700, 22); wrap(state.partners.trim(), w).slice(0, 3).forEach(l => { if (draw) { ctx.fillStyle = T.accent; txt(l, x, y + 21); } y += 30; });
  }
  const st = statsList();
  if (st.length) {
    if (y > top) y += 22;
    const cw = w / st.length;
    let rowH = 0;
    st.forEach(([n, l], i) => {
      const cx = x + i * cw; let yy = y;
      if (n) { let ns = 44; F(800, ns); while (tw(n, -1) > cw - 14 && ns > 24) { ns -= 2; F(800, ns); } if (draw) { ctx.fillStyle = T.accent; txt(n, cx, yy + ns * .8, -1); } yy += ns * .95; }
      F(600, 15); wrap(l, cw - 14).slice(0, 2).forEach(t => { if (draw) { ctx.fillStyle = T.muted; txt(t, cx, yy + 15); } yy += 20; });
      rowH = Math.max(rowH, yy - y);
    });
    y += rowH;
  }
  return y;
}

function drawRecapText(T, top, fs, g, draw) {
  const x = 64, hasRight = images.logos.length || (state.partners || '').trim() || statsList().length;
  const maxW = hasRight ? RIGHT_X - x - 40 : 952;
  let y = top;
  const chip = (state.chip || '').toUpperCase().trim(), k = (state.kicker || '').toUpperCase().trim();
  if (chip || k) {
    let kx = x;
    if (chip) kx += drawChip(T, x, y, chip, draw) + 16;
    if (k) {
      F(800, 17); const kt = '✓  ' + k, kw = tw(kt, 2.4) + 32;
      if (chip && kx + kw > x + maxW) { y += 42 + 12; kx = x; }
      if (draw) { ctx.fillStyle = T.accent; rr(kx, y, kw, 42, 21); ctx.fill(); ctx.fillStyle = '#fff'; txt(kt, kx + 16, y + 27.5, 2.4); }
    }
    y += 42 + 18 * g;
  }
  const L = [state.h1, state.h2].map(s => (s || '').trim()).filter(Boolean);
  F(800, fs);
  if (L.length === 2 && tw(L[0] + ' ' + L[1], -.035 * fs) <= maxW) {
    if (draw) { ctx.fillStyle = T.ink; txt(L[0] + ' ', x, y + fs * .8, -.035 * fs); ctx.fillStyle = T.accent; txt(L[1], x + tw(L[0] + ' ', -.035 * fs), y + fs * .8, -.035 * fs); }
    y += fs * .96;
  } else L.forEach((l, i) => { if (draw) { ctx.fillStyle = i === 1 ? T.accent : T.ink; txt(l, x, y + fs * .8, -.035 * fs); } y += fs * .94; });
  const d = fmtDate(state.date), place = [state.venue, state.area].map(s => (s || '').trim()).filter(Boolean).join(', ');
  if (d || place) {
    y += 14 * g; const y0 = y, bx = x + 26;
    if (d) { F(800, 24); if (draw) { ctx.fillStyle = T.ink; txt(d, bx, y + 23); } y += 32; }
    if (place) { F(600, 21); wrap(place, maxW - 26).slice(0, 2).forEach(l => { if (draw) { ctx.fillStyle = T.muted; txt(l, bx, y + 20); } y += 28; }); }
    if (draw) { ctx.fillStyle = T.rule; ctx.fillRect(x, y0 + 2, 6, y - y0 - 4); }
  }
  return y;
}

function renderRecap(T) {
  drawBase(T, W);
  drawStrip(T);
  const PT = 124, GAP_TXT = 34, BOTTOM = CONTENT_BOTTOM - 30, px = 40, pw = W - 80;
  // a group photo must show everyone, so the frame follows the photo's own shape instead of cropping the ends off
  const im = images.hero, ratio = im ? (im.naturalWidth || im.width) / (im.naturalHeight || im.height) : 1.5;
  const want = Math.round(pw / Math.min(Math.max(ratio, 1), 2.4));
  let fs = 110, g = 1.4;
  const blockH = () => Math.max(drawRecapText(T, 0, fs, g, false), drawRecapRight(T, 0, false));
  const room = () => BOTTOM - PT - GAP_TXT - blockH();
  while (room() < Math.min(want, 560) && fs > 50) fs -= 4;
  while (room() < Math.min(want, 560) && g > .3) g -= .1;
  const phH = Math.max(380, Math.min(want, room()));
  // whatever room the photo doesn't need goes above and below the text
  const spare = room() - phH, top = PT + phH + GAP_TXT + Math.round(spare * .35);

  ctx.save(); ctx.shadowColor = 'rgba(10,40,80,.28)'; ctx.shadowBlur = 44; ctx.shadowOffsetY = 18;
  ctx.fillStyle = '#fff'; rr(px, PT, pw, phH, 26); ctx.fill(); ctx.restore();
  ctx.save(); rr(px, PT, pw, phH, 26); ctx.clip();
  if (im) cover(im, px, PT, pw, phH, state.hx / 100, state.hy / 100, state.hz / 100);
  else placeholder(px, PT, pw, phH, 'Add the group photo');
  ctx.restore();
  drawTag(T, px + 24, PT + phH - 64);

  drawRecapText(T, top, fs, g, true);
  drawRecapRight(T, top + 4, true);
  drawBandAndFooter(T);
}

/* ----- BOD meeting attendance: tick who is coming, the pubmat sorts them into two groups ----- */
const BOARD_2027 = [
  ['matt-malagar', 'Matt Erikson Malagar', 'Pres. Matt Malagar', 'LO President'],
  ['daryl-jabil', 'Daryl Niño Jabil', 'IPP Daryl Jabil', 'Immediate Past President'],
  ['amiesteven-lao', 'Atty. Amiesteven Lao', 'Atty. Steve Lao', 'Executive Vice President, Internal'],
  ['johnel-luceno', 'Johnel Luceño', 'Nel Luceño', 'Executive Vice President, External'],
  ['ren-oliva', 'Ren Oliva', 'Ren Oliva', 'Executive Secretary'],
  ['pedro-fernan', 'Pedro Fernan III', 'Pidot Fernan', 'Executive Treasurer'],
  ['mark-veloso', 'Atty. Mark Jason Veloso', 'Atty. Mark Veloso', 'General Legal Counsel'],
  ['adrian-tan', 'Adrian Tan', 'Adrian Tan', 'Auditor'],
  ['gian-batiller', 'Gian Martin Batiller', 'Gian Batiller', 'VP, Organizational Development'],
  ['joshua-toledo', 'Joshua Toledo', 'Joshua Toledo', 'VP, Training'],
  ['martin-manalili', 'Martin Manalili', 'Martin Manalili', 'VP, Business Development'],
  ['jynx-chanjueco', 'Jynx King Chanjueco', 'Jynx Chanjueco', 'VP, Community Development'],
  ['jay-alegarbes', 'Jay Emanuel Alegarbes', 'Jay Alegarbes', 'VP, Linkages'],
  ['nino-miole', 'Niño Jan Miole', 'Niño Miole', 'VP, Communications'],
  ['juv-rivera', 'John Juv Rivera', 'Juv Rivera', 'Director for Recruitment & Engagements'],
  ['kim-mozo', 'Kim Ralph Mozo', 'Kim Mozo', 'Local Skills Development Director'],
  ['sukho-cho', 'Sukho Cho', 'Sukho Cho', 'Director for Business & Partnerships'],
  ['charles-ausejo', 'Charles Ausejo Jr.', 'Charles Ausejo', 'Director for Special Projects'],
  ['andreu-padernal', 'Andreu Padernal', 'Andreu Padernal', 'Director for International Relations'],
  ['glenn-java', 'Glenn Java', 'Glenn Java', 'Director for National Relations'],
].map(([id, name, short, role]) => ({ id, name, short, role, photo: `assets/bod/${id}.jpg`, on: false }));
const SOFT_PHOTOS = new Set(['martin-manalili', 'juv-rivera', 'sukho-cho', 'jynx-chanjueco', 'charles-ausejo']);
const BODM_DEFAULTS = {
  mode: 'bodm', mNo: '1st', mYear: '2027 JCI Cebu', mTitle: "Board of Directors' Meeting", theme: 'sky',
  date: '', t1: '18:30', t2: '', venue: 'JCI Annex Bldg.', area: 'Pelaez St., Kamagayan, Cebu City', showNames: true,
  band: 'Kindly confirm your', bandHi: 'attendance!', hashtag: 'JCICebu', tag: '',
};
const LS_ROSTER = 'jcpm-bodm-roster-v1', LS_MEET = 'jcpm-bodm-meeting-v1';
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
};
let roster = (store.get(LS_ROSTER) || BOARD_2027).map(m => ({ ...m }));
const faces = {}; // id -> loaded image
async function loadFace(m) {
  if (!m.photo) { faces[m.id] = null; return; }
  if (faces[m.id] && faces[m.id].src === new URL(m.photo, location.href).href) return;
  try { faces[m.id] = await loadImg(m.photo); } catch { faces[m.id] = null; }
}
const saveRoster = () => { if (!store.set(LS_ROSTER, roster)) toast('Could not save on this phone'); };
const saveMeeting = () => { const o = {}; for (const k of Object.keys(BODM_DEFAULTS)) o[k] = state[k]; store.set(LS_MEET, o); };
const loadMeeting = () => ({ ...STATS0, ...BLANK, ...BODM_DEFAULTS, ...(store.get(LS_MEET) || {}), mode: 'bodm' });

// Try every column count and keep the one that gives the biggest faces.
function bodmLayout(n1, n2, avail, showNames) {
  let best = { cols: 10, colW: 95.2, D: 56, nameH: 0, rowH: 70 };
  for (const cols of [5, 6, 7, 8, 9, 10]) {
    const colW = 952 / cols;
    for (let D = Math.min(150, colW - 16); D >= 56; D -= 2) {
      const nameH = showNames ? Math.max(14, Math.round(D * .15)) * 2 + 14 : 0;
      const rowH = D + nameH + 14, rows = Math.ceil(n1 / cols) + Math.ceil(n2 / cols);
      const heads = 60 + (n2 ? 60 + 18 : 0) + (n1 ? 0 : 40);
      if (heads + rows * rowH <= avail) { if (D > best.D) best = { cols, colW, D, nameH, rowH }; break; }
    }
  }
  return best;
}

function drawFace(m, cx, cy, D, ring, T) {
  ctx.save(); ctx.shadowColor = 'rgba(10,40,80,.18)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  ctx.fillStyle = ring; ctx.beginPath(); ctx.arc(cx, cy, D / 2, 0, 7); ctx.fill(); ctx.restore();
  const r = D / 2 - Math.max(3, D * .045);
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip();
  const im = faces[m.id];
  if (im) cover(im, cx - r, cy - r, r * 2, r * 2, .5, .25);
  else {
    ctx.fillStyle = '#dfe8f1'; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    const ini = m.name.replace(/^(Atty\.|Pres\.|Hon\.)\s*/i, '').split(/\s+/).filter(Boolean).map(s => s[0]).slice(0, 2).join('').toUpperCase();
    F(800, r * .8); ctx.fillStyle = '#6b7891'; ctx.textAlign = 'center'; ctx.fillText(ini, cx, cy + r * .28); ctx.textAlign = 'left';
  }
  ctx.restore();
}

function drawGroupHead(T, x, y, kind, label, count) {
  const cx = x + 22, cy = y + 22;
  if (kind === 'yes') {
    ctx.fillStyle = T.accent; ctx.beginPath(); ctx.arc(cx, cy, 20, 0, 7); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(cx - 9, cy + 1); ctx.lineTo(cx - 2.5, cy + 8); ctx.lineTo(cx + 10, cy - 7); ctx.stroke();
  } else {
    ctx.strokeStyle = T.ink; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(cx, cy, 18.5, 0, 7); ctx.stroke();
    F(800, 24); ctx.fillStyle = T.ink; ctx.textAlign = 'center'; ctx.fillText('?', cx, cy + 9); ctx.textAlign = 'left';
  }
  F(800, 32); ctx.fillStyle = T.ink; txt(label, x + 58, y + 34, -.4);
  const lw = tw(label, -.4); F(800, 18); const ct = String(count), pw = Math.max(40, tw(ct) + 24);
  ctx.fillStyle = kind === 'yes' ? T.accent : (T.dark ? 'rgba(255,255,255,.16)' : '#e3e9f2');
  rr(x + 58 + lw + 14, y + 9, pw, 30, 15); ctx.fill();
  ctx.fillStyle = kind === 'yes' ? '#fff' : T.ink; ctx.textAlign = 'center'; ctx.fillText(ct, x + 58 + lw + 14 + pw / 2, y + 30); ctx.textAlign = 'left';
}

function renderBodm(T) {
  drawBase(T, W);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, CONTENT_BOTTOM); ctx.clip();
  ctx.strokeStyle = T.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,151,215,.10)'; ctx.lineWidth = 3;
  for (const r of [140, 230, 320]) { ctx.beginPath(); ctx.arc(W + 40, -40, r, 0, 7); ctx.stroke(); }
  ctx.restore();
  drawStrip(T);
  const x = 64; let y = 142;
  // title: "1ST 2027 JCI CEBU" over "BOARD OF DIRECTORS' MEETING"
  const l1 = [state.mNo, state.mYear].map(s => (s || '').trim()).filter(Boolean).join(' ').toUpperCase();
  const l2 = (state.mTitle || '').trim().toUpperCase();
  let f1 = 62; F(800, f1); while (tw(l1, -1.5) > 952 && f1 > 30) { f1 -= 2; F(800, f1); }
  if (l1) { ctx.fillStyle = T.ink; txt(l1, x, y + f1 * .8, -1.5); y += f1 * .98; }
  let f2 = 50; F(800, f2); while (tw(l2, -1) > 952 && f2 > 26) { f2 -= 2; F(800, f2); }
  if (l2) { ctx.fillStyle = T.accent; txt(l2, x, y + f2 * .8, -1); y += f2 * .98; }
  const d = fmtDate(state.date), t = fmtTime(state.t1, state.t2), place = [state.venue, state.area].map(s => (s || '').trim()).filter(Boolean).join(', ');
  const when = [d, t].filter(Boolean).join('  ·  ');
  if (when || place) {
    y += 14; const y0 = y, bx = x + 26;
    if (when) { F(800, 25); if (draw1(when, bx, y + 24, T.ink)) y += 34; }
    if (place) { F(600, 22); wrap(place, 952 - 26).slice(0, 2).forEach(l => { ctx.fillStyle = T.muted; txt(l, bx, y + 21); y += 30; }); }
    ctx.fillStyle = T.rule; ctx.fillRect(x, y0 + 2, 6, y - y0 - 4);
  }
  y += 30;

  const yes = roster.filter(m => m.on), wait = roster.filter(m => !m.on);
  const avail = CONTENT_BOTTOM - 26 - y, L = bodmLayout(yes.length, wait.length, avail, !!state.showNames);
  // spread any spare room so the faces don't bunch at the top
  const used = 60 + (wait.length ? 78 : 0) + (yes.length ? 0 : 40) + (Math.ceil(yes.length / L.cols) + Math.ceil(wait.length / L.cols)) * L.rowH;
  const spare = Math.max(0, avail - used); y += Math.min(40, spare * .3);
  const drawGroup = (list, kind, label) => {
    drawGroupHead(T, x, y, kind, label, list.length); y += 60;
    if (!list.length) { F(600, 20); ctx.fillStyle = T.muted; txt('No confirmations yet.', x + 58, y + 14); y += 40; return; }
    list.forEach((m, i) => {
      const c = i % L.cols, r = Math.floor(i / L.cols), cx = x + c * L.colW + L.colW / 2, top = y + r * L.rowH;
      drawFace(m, cx, top + L.D / 2, L.D, kind === 'yes' ? T.accent : (T.dark ? 'rgba(255,255,255,.35)' : '#c7d1de'), T);
      if (L.nameH) {
        const fsN = Math.max(14, Math.round(L.D * .15)); F(700, fsN); ctx.textAlign = 'center'; ctx.fillStyle = T.ink;
        wrap(m.short || m.name, L.colW - 6).slice(0, 2).forEach((l, k) => ctx.fillText(l, cx, top + L.D + 8 + fsN + k * (fsN + 3)));
        ctx.textAlign = 'left';
      }
    });
    y += Math.ceil(list.length / L.cols) * L.rowH;
  };
  drawGroup(yes, 'yes', 'Attending');
  if (wait.length) { y += 18 + Math.min(60, spare * .45); drawGroup(wait, 'wait', 'Waiting for confirmation'); }
  drawBandAndFooter(T);
}
/* ---------- Project done: the photo set ----------
   Like the chapter's own post-op posts (Biz D.A.K. Exchange, Nov 2026): every photo of the
   project gets the same frame, and they go up together as one album post. The frame: the
   2027 line-up split in two (JCIP + JCI Cebu top-left, Champion Genuine Impact | El Vinta +
   SALAMAT bottom-right), a JCI-blue glow down the left edge, the area pill bottom-left, and
   the confirmed-partners footer under the photo. */
function renderPhoto(i) {
  const ph = images.set[i], PH = FOOT_Y;
  ctx.fillStyle = '#0b1a3a'; ctx.fillRect(0, 0, W, PH);
  if (ph) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, PH); ctx.clip(); cover(ph.img, 0, 0, W, PH, .5, ph.fy / 100, ph.z / 100); ctx.restore(); }
  else placeholder(0, 0, W, PH, 'Add your project photos');
  // JCI-blue glow down the left edge, a soft top for the logos, a soft bottom for the pill
  let g = ctx.createLinearGradient(0, 0, 360, 0);
  g.addColorStop(0, 'rgba(0,110,230,.88)'); g.addColorStop(.3, 'rgba(0,140,225,.45)'); g.addColorStop(1, 'rgba(0,151,215,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 360, PH);
  g = ctx.createRadialGradient(0, 0, 0, 0, 0, 520);
  g.addColorStop(0, 'rgba(0,90,200,.55)'); g.addColorStop(1, 'rgba(0,90,200,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 620, 520);
  g = ctx.createLinearGradient(0, PH - 260, 0, PH);
  g.addColorStop(0, 'rgba(6,18,46,0)'); g.addColorStop(1, 'rgba(6,18,46,.6)');
  ctx.fillStyle = g; ctx.fillRect(0, PH - 260, W, 260);
  // logos
  if (assets.frameTop) { const h = 92; ctx.drawImage(assets.frameTop, 52, 50, assets.frameTop.width * h / assets.frameTop.height, h); }
  const bh = 78, bw = assets.frameBot ? assets.frameBot.width * bh / assets.frameBot.height : 0;
  if (assets.frameBot) ctx.drawImage(assets.frameBot, W - 52 - bw, PH - 46 - bh, bw, bh);
  // area pill
  const pill = (state.pill || '').trim();
  if (pill) {
    F(600, 27); const maxW = W - 52 - bw - 40 - 52; let t = pill;
    while (tw(t) + 64 > maxW && t.length > 3) t = t.slice(0, -2) + '…';
    const pw = tw(t) + 64, ph2 = 62, px = 52, py = PH - 46 - ph2 - (bh - ph2) / 2;
    ctx.fillStyle = 'rgba(8,24,60,.28)'; rr(px, py, pw, ph2, ph2 / 2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; rr(px, py, pw, ph2, ph2 / 2); ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; txt(t, px + 32, py + ph2 / 2 + 1); ctx.textBaseline = 'alphabetic';
  }
  // confirmed-partners footer (locked)
  if (assets.footer) ctx.drawImage(assets.footer, 0, FOOT_Y, W, H - FOOT_Y);
}
function drawSetList() {
  const box = $('#setList'); if (!box) return; box.replaceChildren();
  images.set.forEach((p, i) => {
    const fig = document.createElement('figure'), img = document.createElement('img'), d = document.createElement('div');
    img.src = p.thumb; img.alt = `Photo ${i + 1}`; if (i === sel) fig.style.outline = '3px solid var(--yellow)';
    img.onclick = () => selectPhoto(i);
    const mk = (t, f, lab) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.setAttribute('aria-label', lab); b.onclick = f; d.append(b); return b; };
    mk('Show', () => selectPhoto(i), `Show photo ${i + 1}`);
    mk('◀', () => { if (i > 0) { images.set.splice(i - 1, 0, images.set.splice(i, 1)[0]); sel = i - 1; drawSetList(); schedule(); } }, `Move photo ${i + 1} earlier`).disabled = i === 0;
    mk('▶', () => { if (i < images.set.length - 1) { images.set.splice(i + 1, 0, images.set.splice(i, 1)[0]); sel = i + 1; drawSetList(); schedule(); } }, `Move photo ${i + 1} later`).disabled = i === images.set.length - 1;
    mk('✕', () => { images.set.splice(i, 1); sel = Math.max(0, Math.min(sel, images.set.length - 1)); drawSetList(); syncSetSliders(); schedule(); }, `Remove photo ${i + 1}`);
    fig.append(img, d); box.append(fig);
  });
  const n = images.set.length;
  $('#setCount').textContent = n ? `Photo ${sel + 1} of ${n} in the preview` : 'No photos yet';
  $('#dl').textContent = state.mode === 'photos' && n > 1 ? `⬇ Download all ${n} photos` : '⬇ Download pubmat';
}
function syncSetSliders() { const p = images.set[sel]; $('#setFy').value = p ? p.fy : 40; $('#setZ').value = p ? p.z : 100; }
function selectPhoto(i) { sel = i; drawSetList(); syncSetSliders(); schedule(); $('.preview').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function thumbOf(img) { const c = document.createElement('canvas'), w = img.width, h = img.height, k = 240 / Math.max(w, h); c.width = Math.round(w * k); c.height = Math.round(h * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); return c.toDataURL('image/jpeg', .8); }
function photosCaption() {
  const name = (state.pname || '').trim() || 'our project', pill = (state.pill || '').trim(), partners = (state.partners || '').trim();
  const d = fmtDate(state.date), place = [state.venue, state.area].map(s => (s || '').trim()).filter(Boolean).join(', ');
  const lines = [name + (pill ? ` | ${pill}` : ''), ''];
  lines.push(`${d ? 'On ' + d + ', ' : ''}JCI Cebu${partners ? ', together with ' + partners + ',' : ''} successfully implemented ${name}${place ? ' at ' + place : ''}.`);
  const close = [state.band, state.bandHi].map(s => (s || '').trim()).filter(Boolean).join(' ');
  if (close) lines.push('', close + (partners ? ` Thank you, ${partners}.` : ''));
  lines.push('', 'SALAMAT. Gratitude in Motion. 💙');
  const tags = ['#JCICebu', state.hashtag ? '#' + state.hashtag.replace(/^#/, '').replace(/\s+/g, '') : '', '#SALAMAT79', '#GratitudeInMotion', '#ChampionGenuineImpact'];
  lines.push('', [...new Set(tags.filter(Boolean))].join(' '));
  return lines.join('\n');
}
function draw1(t, x, y, col) { ctx.fillStyle = col; txt(t, x, y); return true; }

function render() {
  const T = THEMES[state.theme] || THEMES.sky, recOn = !!state.recOn;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingQuality = 'high'; ctx.clearRect(0, 0, W, H); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  if (state.mode === 'photos') { renderPhoto(sel); if (!captionEdited) $('#cap').value = caption(); return; }
  if (state.mode === 'recap' || state.mode === 'bodm') {
    state.mode === 'recap' ? renderRecap(T) : renderBodm(T);
    if (!captionEdited) $('#cap').value = caption(); return;
  }

  // background, dots and the colour column
  if (T.bg2) { const g = ctx.createLinearGradient(0, 0, 0, CONTENT_BOTTOM); g.addColorStop(0, T.bg); g.addColorStop(1, T.bg2); ctx.fillStyle = g; }
  else ctx.fillStyle = T.bg;
  ctx.fillRect(0, 0, W, CONTENT_BOTTOM);
  ctx.fillStyle = T.dot;
  for (let y = 13; y < CONTENT_BOTTOM * .6; y += 26) { ctx.globalAlpha = 1 - y / (CONTENT_BOTTOM * .6); for (let x = 13; x < COL_X; x += 26) { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 7); ctx.fill(); } }
  ctx.globalAlpha = 1;
  const cg = ctx.createLinearGradient(0, 0, 0, CONTENT_BOTTOM); T.col.forEach((c, i) => cg.addColorStop(i / (T.col.length - 1), c));
  ctx.fillStyle = cg; ctx.fillRect(COL_X, 0, W - COL_X, CONTENT_BOTTOM);
  ctx.save(); ctx.beginPath(); ctx.rect(COL_X, 0, W - COL_X, CONTENT_BOTTOM); ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.lineWidth = 3;
  for (const r of [120, 200, 280, 360, 440]) { ctx.beginPath(); ctx.arc(W + 60, CONTENT_BOTTOM + 60, r, 0, 7); ctx.stroke(); }
  ctx.restore();

  // 2027 logo line-up (locked)
  const strip = T.strip === 'white' ? assets.stripWhite : assets.stripNavy;
  if (strip) ctx.drawImage(strip, 64, 56, strip.width * 48 / strip.height, 48);

  // left column, shrinking the title until everything fits
  const limit = recOn ? 830 : 1040;
  F(800, 100);
  const widest = Math.max(1, ...[state.h1, state.h2].map(s => (s || '').trim()).filter(Boolean).map(l => tw(l, -3.5)));
  let fs = Math.min(104, Math.floor(100 * 525 / widest)), g = 1;
  while (drawLeft(T, fs, g, false) > limit && fs > 60) fs -= 4;
  while (drawLeft(T, fs, g, false) > limit && g > .3) g -= .1;
  while (g < 2.2 && drawLeft(T, fs, g + .1, false) <= limit) g += .1;
  drawLeft(T, fs, g, true);

  // main photo, tilted, with a white border
  const hh = recOn ? 560 : 790, ow = 440, oh = hh + 20, cx = 612 + ow / 2, cy = 150 + oh / 2;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(2.2 * Math.PI / 180);
  ctx.shadowColor = 'rgba(10,40,80,.35)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 30;
  ctx.fillStyle = '#fff'; rr(-ow / 2, -oh / 2, ow, oh, 6); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.beginPath(); ctx.rect(-210, -hh / 2, 420, hh); ctx.clip();
  if (images.hero) cover(images.hero, -210, -hh / 2, 420, hh, state.hx / 100, state.hy / 100, state.hz / 100);
  else placeholder(-210, -hh / 2, 420, hh, 'Add your photo');
  ctx.restore();

  const tag = (state.tag || '').toUpperCase().trim();
  if (tag) {
    F(800, 17); const w = tw(tag, 2.4) + 32, ty = 150 + oh - 32;
    ctx.save(); ctx.translate(622, ty + 20); ctx.rotate(-2 * Math.PI / 180);
    ctx.shadowColor = 'rgba(0,0,0,.18)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10;
    ctx.fillStyle = T.tag; rr(0, -20, w, 40, 8); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.fillStyle = T.tagInk; txt(tag, 16, 6.5, 2.4); ctx.restore();
  }

  // second photo panel
  if (recOn) {
    const rx = 64, ry = 850, rw = 952, rh = 194, pw = 372;
    ctx.save(); ctx.shadowColor = 'rgba(10,40,80,.18)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 24;
    ctx.fillStyle = '#fff'; rr(rx, ry, rw, rh, 22); ctx.fill(); ctx.restore();
    ctx.save(); rr(rx, ry, rw, rh, 22); ctx.clip();
    if (images.rec) cover(images.rec, rx, ry, pw, rh, .5, state.ry / 100); else placeholder(rx, ry, pw, rh, 'Second photo');
    ctx.restore();
    const tx = rx + pw + 34, tmax = rw - pw - 68;
    const lab = (state.rLabel || '').toUpperCase().trim();
    F(800, 30); const tl = String(state.rTitle || '').split('\n').flatMap(s => wrap(s, tmax)).slice(0, 2);
    F(400, 20); const bl = wrap(state.rBody || '', tmax).slice(0, 3);
    const hgt = (lab ? 24 : 0) + tl.length * 34 + (bl.length ? 10 + bl.length * 28 : 0);
    let y = ry + (rh - hgt) / 2;
    if (lab) { F(800, 14); ctx.fillStyle = '#3aa7a7'; txt(lab, tx, y + 12, 3.1); y += 24; }
    F(800, 30); ctx.fillStyle = '#130F2D'; tl.forEach(l => { txt(l, tx, y + 27, -.4); y += 34; });
    if (bl.length) { y += 10; F(400, 20); ctx.fillStyle = '#4b5a75'; bl.forEach(l => { txt(l, tx, y + 20); y += 28; }); }
  }

  // closing band
  ctx.fillStyle = T.band; ctx.fillRect(0, CONTENT_BOTTOM, W, BAND_H);
  const b1 = (state.band || '').trim(), b2 = (state.bandHi || '').trim(), mid = CONTENT_BOTTOM + BAND_H / 2 + 12;
  let bs = 36; F(800, bs);
  const bw = () => tw(b1 + (b1 && b2 ? ' ' : '')) + tw(b2);
  const sub = ['JCI Cebu · 79th year', state.hashtag ? '#' + state.hashtag.replace(/^#/, '').replace(/\s+/g, '') : ''].filter(Boolean).join(' · ');
  F(700, 20); let subW = tw(sub, 1.2);
  F(800, bs); while (bw() + subW + 40 > W - 128 && bs > 22) { bs -= 2; F(800, bs); }
  ctx.fillStyle = '#fff'; txt(b1 + (b1 && b2 ? ' ' : ''), 64, mid, -.3);
  ctx.fillStyle = T.bandAccent; txt(b2, 64 + tw(b1 + (b1 && b2 ? ' ' : '')), mid, -.3);
  F(700, 20); ctx.fillStyle = T.bandSub; txt(sub, W - 64 - subW, CONTENT_BOTTOM + BAND_H / 2 + 7, 1.2);

  // confirmed-partners footer (locked)
  if (assets.footer) ctx.drawImage(assets.footer, 0, FOOT_Y, W, H - FOOT_Y);
  else { ctx.fillStyle = '#fff'; ctx.fillRect(0, FOOT_Y, W, H - FOOT_Y); }

  if (!captionEdited) $('#cap').value = caption();
}

/* ---------- caption ---------- */
function recapCaption() {
  const title = [state.h1, state.h2].map(s => (s || '').trim()).filter(Boolean).join(' ');
  const chip = (state.chip || '').trim(), partners = (state.partners || '').trim();
  const d = fmtDate(state.date), place = [state.venue, state.area].map(s => (s || '').trim()).filter(Boolean).join(', ');
  const lines = [`✅ ${chip && chip.toLowerCase() !== title.toLowerCase() ? chip + ': ' : ''}${title || 'Project'}, successfully implemented!`, ''];
  lines.push(`${d ? 'On ' + d + ', ' : ''}JCI Cebu${partners ? ', together with ' + partners + ',' : ''} successfully implemented ${title || 'this project'}${place ? ' in ' + place : ''}.`);
  const st = statsList();
  if (st.length) { lines.push(''); st.forEach(([n, l]) => lines.push('• ' + [n, l].filter(Boolean).join(' '))); }
  const close = [state.band, state.bandHi].map(s => (s || '').trim()).filter(Boolean).join(' ');
  if (close) lines.push('', close + (partners ? ` Thank you, ${partners}.` : ''));
  lines.push('', '📸 More photos in the album.');
  lines.push('', 'SALAMAT. Gratitude in Motion. 💙');
  const tags = ['#JCICebu', state.hashtag ? '#' + state.hashtag.replace(/^#/, '').replace(/\s+/g, '') : '', '#SALAMAT79', '#GratitudeInMotion', '#ChampionGenuineImpact'];
  lines.push('', [...new Set(tags.filter(Boolean))].join(' '));
  return lines.join('\n');
}
// The BODM caption doubles as the GC message: who is in, who still needs to reply.
function bodmCaption() {
  const head = [state.mNo, state.mYear, state.mTitle].map(s => (s || '').trim()).filter(Boolean).join(' ');
  const d = fmtDate(state.date), t = fmtTime(state.t1, state.t2), place = [state.venue, state.area].map(s => (s || '').trim()).filter(Boolean).join(', ');
  const yes = roster.filter(m => m.on), wait = roster.filter(m => !m.on);
  const lines = ['📌 ' + head, ''];
  if (d) lines.push('📅 ' + d); if (t) lines.push('🕢 ' + t); if (place) lines.push('📍 ' + place);
  lines.push('', `✅ Attending (${yes.length}):`); (yes.length ? yes : [{ name: 'none yet' }]).forEach(m => lines.push('• ' + m.name));
  if (wait.length) { lines.push('', `⏳ Waiting for confirmation (${wait.length}):`); wait.forEach(m => lines.push('• ' + m.name)); }
  const close = [state.band, state.bandHi].map(s => (s || '').trim()).filter(Boolean).join(' ');
  if (close) lines.push('', close);
  lines.push('', 'SALAMAT. Gratitude in Motion. 💙');
  return lines.join('\n');
}
function caption() {
  if (state.mode === 'recap') return recapCaption();
  if (state.mode === 'photos') return photosCaption();
  if (state.mode === 'bodm') return bodmCaption();
  const title = [state.h1, state.h2].map(s => (s || '').trim()).filter(Boolean).join(' ');
  const chip = (state.chip || '').trim();
  const lines = [];
  lines.push(chip ? `${chip}: ${title}` : title);
  if ((state.partners || '').trim()) lines.push('', `JCI Cebu, together with ${state.partners.trim()}, invites you to join us.`);
  lines.push('');
  const d = fmtDate(state.date), t = fmtTime(state.t1, state.t2), place = [state.venue, state.area].map(s => (s || '').trim()).filter(Boolean).join(', ');
  if (d) lines.push('📅 ' + d);
  if (t) lines.push('🕢 ' + t);
  if (place) lines.push('📍 ' + place);
  if ((state.meet || '').trim()) lines.push('🤝 Meeting place: ' + state.meet.trim());
  if ((state.outfit || '').trim()) lines.push('👕 Outfit: ' + state.outfit.trim());
  const close = [state.band, state.bandHi].map(s => (s || '').trim()).filter(Boolean).join(' ');
  if (close) lines.push('', close);
  lines.push('', 'SALAMAT. Gratitude in Motion. 💙');
  const tags = ['#JCICebu', state.hashtag ? '#' + state.hashtag.replace(/^#/, '').replace(/\s+/g, '') : '', '#SALAMAT79', '#GratitudeInMotion', '#ChampionGenuineImpact'];
  lines.push('', [...new Set(tags.filter(Boolean))].join(' '));
  return lines.join('\n');
}

/* ---------- form wiring ---------- */
function fillForm() {
  for (const el of form.elements) {
    if (!el.name || !(el.name in state)) continue;
    if (el.type === 'checkbox') el.checked = !!state[el.name];
    else if (el.type === 'radio') el.checked = el.value === state[el.name];
    else el.value = state[el.name];
  }
}
let raf = 0;
const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); };
form.addEventListener('input', e => {
  const el = e.target; if (!el.name || el.name === 'mode' || !(el.name in state)) return;
  state[el.name] = el.type === 'checkbox' ? el.checked : el.type === 'range' ? Number(el.value) : el.value;
  if (state.mode === 'bodm') saveMeeting();
  schedule();
});
$('#cap').addEventListener('input', () => { captionEdited = true; });

/* ---------- three kinds: announcement, project done, BOD meeting ---------- */
let projStash = null; // the project form, kept while the secretary is on the BODM tab
function applyMode() {
  document.querySelectorAll('[data-only]').forEach(el => { el.hidden = !el.dataset.only.split(' ').includes(state.mode); });
  document.querySelectorAll('input[name=mode]').forEach(r => { r.checked = r.value === state.mode; });
  const u = new URL(location.href); u.searchParams.set('type', { announce: 'announce', photos: 'done', recap: 'recap', bodm: 'bodm' }[state.mode]);
  history.replaceState(null, '', u);
}
function setMode(m) {
  if (m === state.mode) return;
  if (m === 'bodm') { projStash = { state: { ...state }, hero: images.hero }; state = loadMeeting(); }
  else {
    if (state.mode === 'bodm') { saveMeeting(); state = projStash ? { ...projStash.state } : { ...EXAMPLE }; }
    if (state.mode !== m) {
      const from = MODE_DEFAULTS[state.mode], to = MODE_DEFAULTS[m];
      for (const k of Object.keys(to)) if (!(state[k] || '').trim() || state[k] === from[k]) state[k] = to[k];
      // an invitation closing line ("See you in Tabunok!") never fits a post-op
      if ((m === 'recap' || m === 'photos') && /^see you/i.test(state.band || '')) { state.band = to.band; state.bandHi = to.bandHi; }
      state.mode = m;
    }
  }
  captionEdited = false; fillForm(); applyMode(); drawRoster(); drawSetList(); schedule();
}
document.querySelectorAll('input[name=mode]').forEach(r => r.addEventListener('change', () => setMode(r.value)));

const themesBox = $('#themes');
for (const [key, t] of Object.entries(THEMES)) {
  const l = document.createElement('label');
  l.innerHTML = `<input type="radio" name="theme" value="${key}"><span><i style="background:linear-gradient(90deg,${t.bg} 0 58%,${t.col[1]} 58%)"></i>${t.name}</span>`;
  themesBox.append(l);
}

$('#setIn').addEventListener('change', async e => {
  const files = [...e.target.files]; if (!files.length) return;
  toast(`Adding ${files.length} photo${files.length > 1 ? 's' : ''}…`);
  for (const f of files) { if (images.set.length >= 20) { toast('Up to 20 photos per set'); break; } const img = shrink(await fileImg(f), 2200); images.set.push({ img, thumb: thumbOf(img), fy: 40, z: 100 }); }
  e.target.value = ''; sel = Math.min(sel, images.set.length - 1); if (sel < 0) sel = 0; drawSetList(); syncSetSliders(); schedule();
});
$('#setFy').addEventListener('input', e => { const p = images.set[sel]; if (p) { p.fy = Number(e.target.value); schedule(); } });
$('#setZ').addEventListener('input', e => { const p = images.set[sel]; if (p) { p.z = Number(e.target.value); schedule(); } });
$('#prevP').onclick = () => { if (images.set.length) selectPhoto((sel - 1 + images.set.length) % images.set.length); };
$('#nextP').onclick = () => { if (images.set.length) selectPhoto((sel + 1) % images.set.length); };
$('#heroIn').addEventListener('change', async e => { const f = e.target.files[0]; if (f) { images.hero = shrink(await fileImg(f), 2200); state.hz = 100; state.hx = 50; state.hy = 40; fillForm(); schedule(); } });
$('#recIn').addEventListener('change', async e => { const f = e.target.files[0]; if (f) { images.rec = await fileImg(f); state.recOn = true; fillForm(); schedule(); } });
$('#logoIn').addEventListener('change', async e => {
  for (const f of [...e.target.files]) { if (images.logos.length >= 3) { toast('Up to 3 logos'); break; } const im = await fileImg(f); images.logos.push({ src: im.src, draw: prepLogo(im) }); }
  e.target.value = ''; drawLogoList(); schedule();
});
function drawLogoList() {
  const box = $('#logoList'); box.replaceChildren();
  images.logos.forEach((l, i) => {
    const fig = document.createElement('figure'), img = document.createElement('img'), b = document.createElement('button');
    img.src = l.src; img.alt = l.name || `Partner logo ${i + 1}`; b.type = 'button'; b.textContent = 'Remove';
    b.onclick = () => { images.logos.splice(i, 1); drawLogoList(); schedule(); };
    fig.append(img, b); box.append(fig);
  });
  document.querySelectorAll('#partnerPick button').forEach(b => b.setAttribute('aria-pressed', images.logos.some(l => l.key === b.dataset.key)));
}

// tap a confirmed partner to put its logo on; its name goes into the caption too
const pick = $('#partnerPick');
PARTNER_LOGOS.forEach(([file, name]) => {
  const b = document.createElement('button'); b.type = 'button'; b.dataset.key = file; b.title = name; b.setAttribute('aria-pressed', 'false');
  b.innerHTML = `<img src="assets/partners/${file}" alt="" loading="lazy"><span>${name}</span>`;
  b.onclick = async () => {
    const i = images.logos.findIndex(l => l.key === file);
    if (i >= 0) { images.logos.splice(i, 1); drawLogoList(); schedule(); return; }
    if (images.logos.length >= 3) { toast('Up to 3 logos. Remove one first.'); return; }
    const im = await loadImg(`assets/partners/${file}`);
    images.logos.push({ key: file, name, src: im.src, draw: prepLogo(im) });
    const p = (state.partners || '').trim();
    if (!p.toLowerCase().includes(name.toLowerCase())) { state.partners = p ? `${p} and ${name}`.replace(/ and (.*) and /, ', $1 and ') : name; fillForm(); }
    drawLogoList(); schedule();
  };
  pick.append(b);
});

/* ---------- BOD meeting roster ---------- */
function drawRoster() {
  const box = $('#roster'); if (!box) return; box.replaceChildren();
  roster.forEach((m, i) => {
    const li = document.createElement('li'); li.className = m.on ? 'on' : '';
    const lab = document.createElement('label'), cb = document.createElement('input'), img = document.createElement('img'), txtBox = document.createElement('span');
    cb.type = 'checkbox'; cb.checked = m.on; cb.setAttribute('aria-label', `${m.name} is attending`);
    cb.onchange = () => { m.on = cb.checked; li.className = m.on ? 'on' : ''; saveRoster(); countRoster(); captionEdited = false; schedule(); };
    img.src = m.photo || 'data:image/gif;base64,R0lGODlhAQABAAAAACw='; img.alt = '';
    const nm = document.createElement('b'), rl = document.createElement('small');
    nm.textContent = m.name; rl.textContent = m.role + (SOFT_PHOTOS.has(m.id) && m.photo === `assets/bod/${m.id}.jpg` ? ' · 📷 better photo needed' : '');
    txtBox.append(nm, rl); lab.append(cb, img, txtBox);
    const tools = document.createElement('div');
    const ph = document.createElement('button'); ph.type = 'button'; ph.textContent = '📷'; ph.setAttribute('aria-label', `Change ${m.name}'s photo`); ph.title = 'Change photo';
    ph.onclick = () => pickPhoto(async url => { m.photo = url; await loadFace(m); saveRoster(); drawRoster(); schedule(); });
    const rm = document.createElement('button'); rm.type = 'button'; rm.textContent = '✕'; rm.setAttribute('aria-label', `Remove ${m.name}`);
    rm.onclick = () => { if (confirm(`Remove ${m.name} from the list?`)) { roster.splice(i, 1); saveRoster(); drawRoster(); schedule(); } };
    tools.append(ph, rm); li.append(lab, tools); box.append(li);
  });
  countRoster();
}
function countRoster() { const n = roster.filter(m => m.on).length; $('#rosterCount').textContent = `${n} of ${roster.length} attending`; }
// photos picked here are shrunk and kept on this phone
function pickPhoto(done) {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
  inp.onchange = async () => {
    const f = inp.files[0]; if (!f) return;
    const im = await fileImg(f), s = Math.min(im.naturalWidth, im.naturalHeight), c = document.createElement('canvas'); c.width = c.height = 320;
    const x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
    x.drawImage(im, (im.naturalWidth - s) / 2, Math.max(0, (im.naturalHeight - s) * .2), s, s, 0, 0, 320, 320);
    done(c.toDataURL('image/jpeg', .85));
  };
  inp.click();
}
$('#toPreview').onclick = () => $('.preview').scrollIntoView({ behavior: 'smooth' });
$('#allOn').onclick = () => { roster.forEach(m => { m.on = true; }); saveRoster(); drawRoster(); captionEdited = false; schedule(); };
$('#allOff').onclick = () => { roster.forEach(m => { m.on = false; }); saveRoster(); drawRoster(); captionEdited = false; schedule(); };
let newPhoto = null;
$('#addPhoto').onclick = () => pickPhoto(url => { newPhoto = url; $('#addPhotoName').textContent = 'Photo added ✓'; });
$('#addMember').onclick = async () => {
  const name = $('#addName').value.trim(); if (!name) { toast('Type a name first'); $('#addName').focus(); return; }
  const m = { id: 'x' + Date.now(), name, short: $('#addShort').value.trim() || name, role: $('#addRole').value.trim() || 'Guest', photo: newPhoto, on: true };
  roster.push(m); await loadFace(m); saveRoster(); drawRoster(); schedule();
  $('#addName').value = $('#addShort').value = $('#addRole').value = ''; newPhoto = null; $('#addPhotoName').textContent = ''; toast(`${name} added`);
};
$('#resetRoster').onclick = async () => {
  if (!confirm('Go back to the 2027 board list? Added names and changed photos will be cleared.')) return;
  roster = BOARD_2027.map(m => ({ ...m })); await Promise.all(roster.map(loadFace)); saveRoster(); drawRoster(); schedule();
};

async function loadExample() {
  captionEdited = false;
  if (state.mode === 'bodm') {
    state = { ...loadMeeting(), mNo: '1st', date: '', t1: '18:30', venue: 'JCI Annex Bldg.', area: 'Pelaez St., Kamagayan, Cebu City' };
    saveMeeting(); fillForm(); applyMode(); drawRoster(); render(); return;
  }
  if (state.mode === 'photos') {
    state = { ...RECAP_EXAMPLE, mode: 'photos', pname: 'Impact Immersion', pill: 'Community Development', venue: '', area: '' };
    const ims = await Promise.all(['samples/san-remigio.jpg', 'samples/medical.jpg'].map(loadImg));
    images.set = ims.map(img => ({ img, thumb: thumbOf(img), fy: 40, z: 100 })); sel = 0;
    fillForm(); applyMode(); drawSetList(); syncSetSliders(); render(); return;
  }
  if (state.mode === 'recap') {
    state = { ...RECAP_EXAMPLE };
    images.hero = await loadImg('samples/san-remigio.jpg'); images.logos = [];
    fillForm(); applyMode(); drawLogoList(); render(); return;
  }
  state = { ...EXAMPLE };
  const [h, r, l1, l2] = await Promise.all(['samples/medical.jpg', 'samples/san-remigio.jpg', 'samples/my-mountain-mover.png', 'samples/greater-heights.png'].map(loadImg));
  images.hero = h; images.rec = r; images.logos = [l1, l2].map(im => ({ src: im.src, draw: prepLogo(im) }));
  fillForm(); applyMode(); drawLogoList(); render();
}
$('#example').onclick = loadExample;
$('#blank').onclick = () => {
  const m = state.mode; captionEdited = false;
  if (m === 'bodm') {
    state = { ...loadMeeting(), date: '', mNo: '' }; roster.forEach(r => { r.on = false; }); saveRoster(); saveMeeting();
    fillForm(); applyMode(); drawRoster(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return;
  }
  state = { ...BLANK, ...MODE_DEFAULTS[m], mode: m, pname: '', pill: m === 'photos' ? '' : state.pill }; images.hero = null; images.rec = null; images.logos = [];
  if (m === 'photos') { images.set = []; sel = 0; }
  fillForm(); applyMode(); drawLogoList(); drawSetList(); render(); window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ---------- export ---------- */
const slug = s => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fileName = (i = sel) => state.mode === 'photos'
  ? `done-${slug(state.pname || '') || 'jci-cebu'}-${String(i + 1).padStart(2, '0')}.jpg`
  : state.mode === 'bodm'
  ? `bodm-attendance-${slug([state.mNo, state.date].join(' ')) || 'jci-cebu'}.jpg`
  : (state.mode === 'recap' ? 'done-' : 'pubmat-') + (slug([state.h1, state.h2].join(' ')) || 'jci-cebu') + '.jpg';
const blob = (type = 'image/jpeg') => new Promise(res => cv.toBlob(res, type, .93));
const saveBlob = (b, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); };
async function setFiles() {
  const out = [], keep = sel;
  for (let i = 0; i < images.set.length; i++) { sel = i; render(); out.push(new File([await blob()], fileName(i), { type: 'image/jpeg' })); }
  sel = keep; render(); return out;
}
$('#dl').onclick = async () => {
  if (state.mode === 'photos' && images.set.length > 1) {
    const files = await setFiles();
    for (const f of files) { saveBlob(f, f.name); await new Promise(r => setTimeout(r, 450)); }
    toast(`Downloaded ${files.length} photos`); return;
  }
  render(); const b = await blob(), a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = fileName(); document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('Downloaded');
};
if (navigator.canShare) {
  const s = $('#share'); s.hidden = false;
  s.onclick = async () => {
    let files;
    if (state.mode === 'photos' && images.set.length > 1) files = await setFiles();
    else { render(); files = [new File([await blob()], fileName(), { type: 'image/jpeg' })]; }
    if (navigator.canShare({ files })) { try { await navigator.share({ files, text: $('#cap').value }); } catch {} }
    else toast('Sharing files is not supported here. Use Download.');
  };
}
// copy the pubmat itself, to paste straight into Messenger on a laptop
if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
  const c = $('#copyImg'); c.hidden = false;
  c.onclick = async () => {
    render();
    try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob('image/png') })]); toast('Pubmat copied. Paste it in the chat.'); }
    catch { toast('Copying images is not supported here. Use Download or Share.'); }
  };
}
$('#copy').onclick = async () => {
  try { await navigator.clipboard.writeText($('#cap').value); toast(state.mode === 'bodm' ? 'Attendance list copied' : 'Caption copied'); }
  catch { $('#cap').select(); toast('Select and copy the text'); }
};
let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2200); }

/* ---------- start ---------- */
(async () => {
  try { await Promise.all([500, 600, 700, 800, 400].map(w => document.fonts.load(`${w} 40px "Plus Jakarta Sans"`))); } catch {}
  [assets.stripNavy, assets.stripWhite, assets.footer, assets.frameTop, assets.frameBot] = await Promise.all(
    ['assets/logo-lineup-2027-navy.png', 'assets/logo-lineup-2027-white.png', 'assets/partner-footer.png?v=aa84f93f', 'assets/frame-top-white.png', 'assets/frame-bottom-white.png'].map(s => loadImg(s).catch(() => null)));
  await Promise.all(roster.map(loadFace));
  drawRoster();
  // ?type=done opens on "Project done" (the photo set), ?type=recap on the single recap card, ?type=bodm on the BOD meeting attendance
  const t = (location.search.match(/[?&]type=(\w+)/) || [])[1];
  if (t === 'bodm') { projStash = { state: { ...EXAMPLE }, hero: null }; state = loadMeeting(); fillForm(); applyMode(); drawRoster(); render(); return; }
  if (t === 'done') state.mode = 'photos';
  if (t === 'recap') state.mode = 'recap';
  fillForm(); applyMode();
  await loadExample();
})();
