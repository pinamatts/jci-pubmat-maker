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
  band: 'See you', bandHi: 'there!', hashtag: 'JCICebu',
};

const RECAP_EXAMPLE = {
  ...BLANK, mode: 'recap', chip: 'Impact Immersion', kicker: 'Mission accomplished', h1: 'Project', h2: 'Title', theme: 'sky',
  date: '', venue: 'Venue', area: 'City', pLabel: 'Thank you to our partners', tag: 'Gratitude in motion',
  band: 'SALAMAT to everyone', bandHi: 'who joined!', hashtag: 'ImpactImmersion',
  s1n: '000', s1l: 'residents served', s2n: '00', s2l: 'volunteers', s3n: '0', s3l: 'partners',
};
const MODE_DEFAULTS = {
  announce: { kicker: 'JCI Cebu community project', band: 'See you', bandHi: 'there!', pLabel: 'In partnership with' },
  recap: { kicker: 'Mission accomplished', band: 'SALAMAT to everyone', bandHi: 'who joined!', pLabel: 'Thank you to our partners' },
};
let state = { ...EXAMPLE };
const images = { hero: null, rec: null, logos: [], photos: [] }; // logos: [{src, draw}], photos: [{src, img}]
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

/* ----- "Project done" recap: title, numbers, and a grid of up to 6 action photos ----- */
const GRIDS = {
  1: [[0, 0, 1, 1]],
  2: [[0, 0, .5, 1], [.5, 0, .5, 1]],
  3: [[0, 0, .6, 1], [.6, 0, .4, .5], [.6, .5, .4, .5]],
  4: [[0, 0, .5, .5], [.5, 0, .5, .5], [0, .5, .5, .5], [.5, .5, .5, .5]],
  5: [[0, 0, .5, 1], [.5, 0, .25, .5], [.75, 0, .25, .5], [.5, .5, .25, .5], [.75, .5, .25, .5]],
  6: [[0, 0, 1 / 3, .5], [1 / 3, 0, 1 / 3, .5], [2 / 3, 0, 1 / 3, .5], [0, .5, 1 / 3, .5], [1 / 3, .5, 1 / 3, .5], [2 / 3, .5, 1 / 3, .5]],
};
const statsList = () => [[state.s1n, state.s1l], [state.s2n, state.s2l], [state.s3n, state.s3l]].map(([n, l]) => [(n || '').trim(), (l || '').trim()]).filter(([n, l]) => n || l);

function drawRecapHead(T, fs, g, draw, maxW) {
  const x = 64; let y = 160;
  const chip = (state.chip || '').toUpperCase().trim();
  if (chip) {
    F(800, 17); const w = tw(chip, 3) + 36 + 19;
    if (draw) {
      ctx.fillStyle = T.chipBg; rr(x, y, w, 42, 21); ctx.fill();
      ctx.fillStyle = T.chipDot; ctx.beginPath(); ctx.arc(x + 22.5, y + 21, 4.5, 0, 7); ctx.fill();
      ctx.fillStyle = T.chipInk; txt(chip, x + 37, y + 27.5, 3);
    }
    y += 42 + 22 * g;
  }
  const k = (state.kicker || '').toUpperCase().trim();
  if (k) { F(700, 18); if (draw) { ctx.fillStyle = T.accent; txt('✓ ' + k, x, y + 15, 2.9); } y += 18 + 12 * g; }
  F(800, fs);
  [state.h1, state.h2].map(s => (s || '').trim()).filter(Boolean).forEach((l, i) => { if (draw) { ctx.fillStyle = i === 1 ? T.accent : T.ink; txt(l, x, y + fs * .8, -.035 * fs); } y += fs * .94; });
  const meta = [fmtDate(state.date), [state.venue, state.area].map(s => (s || '').trim()).filter(Boolean).join(', ')].filter(Boolean).join('  ·  ');
  if (meta) { y += 14 * g; F(600, 22); wrap(meta, maxW).slice(0, 2).forEach(l => { if (draw) { ctx.fillStyle = T.muted; txt(l, x, y + 21); } y += 30; }); }
  y = drawPartners(T, x, y, g * .8, draw, Math.min(maxW, 540));
  return y;
}

function drawStats(T, draw) {
  const st = statsList(); if (!st.length) return 0;
  const px = 700, pw = 316, py = 156, inner = pw - 56;
  F(600, 18); const blocks = st.map(([n, l]) => ({ n, lines: l ? wrap(l, inner).slice(0, 2) : [] }));
  const hgt = 30 + blocks.reduce((s, b) => s + (b.n ? 64 : 0) + b.lines.length * 24, 0) + (blocks.length - 1) * 30 + 30;
  if (draw) {
    ctx.save(); ctx.shadowColor = 'rgba(10,40,80,.25)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
    const cg = ctx.createLinearGradient(px, py, px + pw, py + hgt); T.col.forEach((c, i) => cg.addColorStop(i / (T.col.length - 1), c));
    ctx.fillStyle = cg; rr(px, py, pw, hgt, 26); ctx.fill(); ctx.restore();
    ctx.save(); rr(px, py, pw, hgt, 26); ctx.clip(); ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 3;
    for (const r of [70, 130, 190]) { ctx.beginPath(); ctx.arc(px + pw + 20, py + hgt + 20, r, 0, 7); ctx.stroke(); } ctx.restore();
    let y = py + 30;
    blocks.forEach((b, i) => {
      if (i) { ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(px + 28, y + 14, inner, 2); y += 30; }
      if (b.n) { let ns = 60; F(800, ns); while (tw(b.n, -1.5) > inner && ns > 30) { ns -= 4; F(800, ns); } ctx.fillStyle = '#fff'; txt(b.n, px + 28, y + 52, -1.5); y += 64; }
      F(600, 18); ctx.fillStyle = 'rgba(255,255,255,.94)'; b.lines.forEach(l => { txt(l, px + 28, y + 17); y += 24; });
    });
  }
  return py + hgt;
}

function renderRecap(T) {
  drawBase(T, W);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, CONTENT_BOTTOM); ctx.clip();
  ctx.strokeStyle = T.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,151,215,.10)'; ctx.lineWidth = 3;
  for (const r of [140, 230, 320, 410]) { ctx.beginPath(); ctx.arc(W + 40, -40, r, 0, 7); ctx.stroke(); }
  ctx.restore();
  drawStrip(T);

  const hasStats = statsList().length > 0, maxW = hasStats ? 600 : 952;
  const statsBottom = drawStats(T, false);
  F(800, 100);
  const widest = Math.max(1, ...[state.h1, state.h2].map(s => (s || '').trim()).filter(Boolean).map(l => tw(l, -3.5)));
  let fs = Math.min(hasStats ? 104 : 118, Math.floor(100 * (maxW - 15) / widest)), g = 1;
  const gridTop = () => Math.max(drawRecapHead(T, fs, g, false, maxW), statsBottom) + 30;
  while (CONTENT_BOTTOM - 24 - gridTop() < 430 && fs > 56) fs -= 4;
  while (CONTENT_BOTTOM - 24 - gridTop() < 430 && g > .3) g -= .1;
  drawRecapHead(T, fs, g, true, maxW);
  drawStats(T, true);

  const gx = 64, gw = 952, gy = gridTop(), gh = CONTENT_BOTTOM - 24 - gy, gap = 12;
  const ph = images.photos.slice(0, 6), cells = GRIDS[Math.max(1, ph.length)];
  cells.forEach(([fx, fy, fw, fh], i) => {
    const x = gx + fx * gw + (fx > 0 ? gap / 2 : 0), y = gy + fy * gh + (fy > 0 ? gap / 2 : 0);
    const w = fw * gw - (fx > 0 ? gap / 2 : 0) - (fx + fw < .999 ? gap / 2 : 0), h = fh * gh - (fy > 0 ? gap / 2 : 0) - (fy + fh < .999 ? gap / 2 : 0);
    ctx.save(); ctx.shadowColor = 'rgba(10,40,80,.22)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
    ctx.fillStyle = '#fff'; rr(x, y, w, h, 18); ctx.fill(); ctx.restore();
    ctx.save(); rr(x, y, w, h, 18); ctx.clip();
    if (ph[i]) cover(ph[i].img, x, y, w, h, .5, .4); else placeholder(x, y, w, h, 'Add your action photos');
    ctx.restore();
  });
  const [f0x, f0y, , f0h] = cells[0];
  drawTag(T, gx + 18, gy + f0y * gh + f0h * gh - (cells.length > 1 && f0y + f0h < .999 ? gap / 2 : 0) - 62);
  drawBandAndFooter(T);
}

function render() {
  const T = THEMES[state.theme] || THEMES.sky, recOn = !!state.recOn;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingQuality = 'high'; ctx.clearRect(0, 0, W, H); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  if (state.mode === 'recap') { renderRecap(T); if (!captionEdited) $('#cap').value = caption(); return; }

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
  const lines = [(chip ? `${chip}: ${title}` : title) + ' ✅', ''];
  lines.push(`JCI Cebu${partners ? ', together with ' + partners + ',' : ''} held ${title || 'this project'}${place ? ' at ' + place : ''}${d ? ' on ' + d : ''}.`);
  const st = statsList();
  if (st.length) { lines.push(''); st.forEach(([n, l]) => lines.push('• ' + [n, l].filter(Boolean).join(' '))); }
  const close = [state.band, state.bandHi].map(s => (s || '').trim()).filter(Boolean).join(' ');
  if (close) lines.push('', close);
  lines.push('', 'SALAMAT. Gratitude in Motion. 💙');
  const tags = ['#JCICebu', state.hashtag ? '#' + state.hashtag.replace(/^#/, '').replace(/\s+/g, '') : '', '#SALAMAT79', '#GratitudeInMotion', '#ChampionGenuineImpact'];
  lines.push('', [...new Set(tags.filter(Boolean))].join(' '));
  return lines.join('\n');
}
function caption() {
  if (state.mode === 'recap') return recapCaption();
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
  schedule();
});
$('#cap').addEventListener('input', () => { captionEdited = true; });

/* ---------- announcement vs project done ---------- */
function applyMode() {
  document.querySelectorAll('[data-only]').forEach(el => { el.hidden = el.dataset.only !== state.mode; });
  document.querySelectorAll('input[name=mode]').forEach(r => { r.checked = r.value === state.mode; });
}
function setMode(m) {
  if (m === state.mode) return;
  const from = MODE_DEFAULTS[state.mode], to = MODE_DEFAULTS[m];
  for (const k of Object.keys(to)) if (!(state[k] || '').trim() || state[k] === from[k]) state[k] = to[k];
  // an invitation closing line ("See you in Tabunok!") never fits a recap
  if (m === 'recap' && /^see you/i.test(state.band || '')) { state.band = to.band; state.bandHi = to.bandHi; }
  state.mode = m;
  if (m === 'recap' && !images.photos.length) images.photos = [images.hero, images.rec].filter(Boolean).map(img => ({ src: img.src, img }));
  captionEdited = false; fillForm(); applyMode(); drawPhotoList(); schedule();
}
document.querySelectorAll('input[name=mode]').forEach(r => r.addEventListener('change', () => setMode(r.value)));

$('#photosIn').addEventListener('change', async e => {
  for (const f of [...e.target.files]) {
    if (images.photos.length >= 6) { toast('Up to 6 photos'); break; }
    const im = await fileImg(f); images.photos.push({ src: im.src, img: shrink(im) });
  }
  e.target.value = ''; drawPhotoList(); schedule();
});
function drawPhotoList() {
  const box = $('#photoList'); box.replaceChildren();
  images.photos.forEach((p, i) => {
    const fig = document.createElement('figure'), img = document.createElement('img'), tools = document.createElement('div');
    img.src = p.src; img.alt = `Photo ${i + 1}`;
    if (i === 0) { const tag = document.createElement('span'); tag.className = 'big'; tag.textContent = 'Big photo'; tools.append(tag); }
    else { const up = document.createElement('button'); up.type = 'button'; up.textContent = 'Make big'; up.onclick = () => { images.photos.unshift(...images.photos.splice(i, 1)); drawPhotoList(); schedule(); }; tools.append(up); }
    const rm = document.createElement('button'); rm.type = 'button'; rm.textContent = 'Remove';
    rm.onclick = () => { images.photos.splice(i, 1); drawPhotoList(); schedule(); };
    tools.append(rm); fig.append(img, tools); box.append(fig);
  });
  $('#photoCount').textContent = images.photos.length ? `${images.photos.length} of 6` : 'none yet';
}

const themesBox = $('#themes');
for (const [key, t] of Object.entries(THEMES)) {
  const l = document.createElement('label');
  l.innerHTML = `<input type="radio" name="theme" value="${key}"><span><i style="background:linear-gradient(90deg,${t.bg} 0 58%,${t.col[1]} 58%)"></i>${t.name}</span>`;
  themesBox.append(l);
}

$('#heroIn').addEventListener('change', async e => { const f = e.target.files[0]; if (f) { images.hero = await fileImg(f); state.hz = 100; state.hx = 50; state.hy = 40; fillForm(); schedule(); } });
$('#recIn').addEventListener('change', async e => { const f = e.target.files[0]; if (f) { images.rec = await fileImg(f); state.recOn = true; fillForm(); schedule(); } });
$('#logoIn').addEventListener('change', async e => {
  for (const f of [...e.target.files]) { if (images.logos.length >= 3) { toast('Up to 3 logos'); break; } const im = await fileImg(f); images.logos.push({ src: im.src, draw: prepLogo(im) }); }
  e.target.value = ''; drawLogoList(); schedule();
});
function drawLogoList() {
  const box = $('#logoList'); box.replaceChildren();
  images.logos.forEach((l, i) => {
    const fig = document.createElement('figure'), img = document.createElement('img'), b = document.createElement('button');
    img.src = l.src; img.alt = `Partner logo ${i + 1}`; b.type = 'button'; b.textContent = 'Remove';
    b.onclick = () => { images.logos.splice(i, 1); drawLogoList(); schedule(); };
    fig.append(img, b); box.append(fig);
  });
}

async function loadExample() {
  if (state.mode === 'recap') {
    state = { ...RECAP_EXAMPLE }; captionEdited = false;
    const ims = await Promise.all(['samples/medical.jpg', 'samples/hydrate-cebu.jpg', 'samples/san-remigio.jpg', 'samples/kaagapay.jpg'].map(loadImg));
    images.photos = ims.map(im => ({ src: im.src, img: im })); images.logos = [];
    fillForm(); applyMode(); drawLogoList(); drawPhotoList(); render(); return;
  }
  state = { ...EXAMPLE }; captionEdited = false;
  const [h, r, l1, l2] = await Promise.all(['samples/medical.jpg', 'samples/san-remigio.jpg', 'samples/my-mountain-mover.png', 'samples/greater-heights.png'].map(loadImg));
  images.hero = h; images.rec = r; images.logos = [l1, l2].map(im => ({ src: im.src, draw: prepLogo(im) }));
  fillForm(); applyMode(); drawLogoList(); render();
}
$('#example').onclick = loadExample;
$('#blank').onclick = () => {
  const m = state.mode;
  state = { ...BLANK, ...MODE_DEFAULTS[m], mode: m }; images.hero = null; images.rec = null; images.logos = []; images.photos = []; captionEdited = false;
  fillForm(); applyMode(); drawLogoList(); drawPhotoList(); render(); window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ---------- export ---------- */
const fileName = () => (state.mode === 'recap' ? 'recap-' : 'pubmat-') + ([state.h1, state.h2].join(' ').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'jci-cebu') + '.jpg';
const blob = () => new Promise(res => cv.toBlob(res, 'image/jpeg', .93));
$('#dl').onclick = async () => {
  render(); const b = await blob(), a = document.createElement('a');
  a.href = URL.createObjectURL(b); a.download = fileName(); document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('Downloaded');
};
if (navigator.canShare) {
  const s = $('#share'); s.hidden = false;
  s.onclick = async () => {
    render(); const f = new File([await blob()], fileName(), { type: 'image/jpeg' });
    if (navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], text: $('#cap').value }); } catch {} }
    else toast('Sharing files is not supported here. Use Download.');
  };
}
$('#copy').onclick = async () => {
  try { await navigator.clipboard.writeText($('#cap').value); toast('Caption copied'); }
  catch { $('#cap').select(); toast('Select and copy the caption'); }
};
let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 1800); }

/* ---------- start ---------- */
(async () => {
  try { await Promise.all([500, 700, 800, 400].map(w => document.fonts.load(`${w} 40px "Plus Jakarta Sans"`))); } catch {}
  [assets.stripNavy, assets.stripWhite, assets.footer] = await Promise.all(
    ['assets/logo-lineup-2027-navy.png', 'assets/logo-lineup-2027-white.png', 'assets/partner-footer.png'].map(s => loadImg(s).catch(() => null)));
  // ?type=done opens straight on the "Project done" recap
  if (/[?&]type=(done|recap)/.test(location.search)) state.mode = 'recap';
  fillForm(); applyMode();
  await loadExample();
})();
