/* 79th Induction Pubmat Maker. For induction posts only.
   The look follows the induction team's Canva file "79TH INDUCTION AND TURNOVER CEREMONIES":
   navy night, the gold 79 lockup on top, white glowing title, and the logos + date + venue at the bottom.
   Everything is drawn 1080 units wide and scaled to the chosen size. */
'use strict';
const $ = s => document.querySelector(s);
const cv = $('#cv'); let ctx = cv.getContext('2d'); // ctx is swapped for a spare canvas while a background is drawn
const form = $('#f');
const W = 1080, CX = 540;
const SIZES = {
  poster: { w: 1448, h: 2048, note: 'Poster · 1448 × 2048 px, the same size as the Canva file.' },
  feed: { w: 1080, h: 1350, note: 'Feed · 1080 × 1350 px (4:5).' },
  story: { w: 1080, h: 1920, note: 'Story · 1080 × 1920 px. The top and bottom are kept clear for the story buttons.' },
};
const EVENT = { date: '12 DECEMBER 2026', venue: 'MACTAN EXPO | MACTAN NEWTOWN', utc: Date.UTC(2026, 11, 12), site: 'first79.jcicebu.org' };
const NAVY = '#00172f', GOLD = '#c9ab4f';
const SANS = '"Arimo", "Helvetica Neue", Arial, sans-serif', SERIF = '"Cormorant Garamond", Georgia, "Times New Roman", serif';

function daysToGo() { // counted on the Cebu calendar, not the phone's
  const n = new Date(Date.now() + 8 * 3600e3);
  return Math.max(0, Math.round((EVENT.utc - Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate())) / 864e5));
}

const DEFAULTS = {
  title: { title: 'Dress Code', details: '# Ladies\nBlack or blue gown\n\n# Gentlemen\nSuit and tie\n\n# JCI Cebu members\nRoyal blue tie' },
  letter: { lhead: 'Announcement', dropcap: true, body: 'We look forward to welcoming you to our 79th Induction and Turnover Ceremonies on December 12, 2026 at Mactan Expo.\n\nAs we finalize our preparations, we would greatly appreciate your confirmation at first79.jcicebu.org.\n\nYour presence would truly make the occasion more meaningful.' },
  count: { title: '', clabel: 'Days to go', cline: 'See you at Mactan Expo' },
  person: { title: 'Guest of Honour', pname: 'Full Name', prole: 'Title or office\nOrganization', py: 30, pz: 100 },
  prog: { title: 'Programme', rows: '# Saturday, 12 December\n11:00 AM | Sister Chapter Lunch | Mactan Newtown\n1:00 PM | National Anthem video shoot | Mactan Expo\n5:00 PM | Benefit Concert | Mactan Expo\n7:00 PM | Induction and Turnover Ceremonies | Mactan Expo' },
  key: { kline: '' },
};
const STARTS = {
  title: {
    'Dress code': DEFAULTS.title,
    'Save the date': { title: 'Save the Date', details: '# You are invited\n79th Induction and Turnover Ceremonies\n\nSaturday, 12 December 2026\nMactan Expo, Mactan Newtown' },
    'Reminder': { title: 'Reminder', details: '# For our guests\nFirst line\nSecond line\n\n# Questions\nMessage the JCI Cebu page' },
    'Blank': { title: '', details: '' },
  },
  letter: {
    'RSVP reminder': DEFAULTS.letter,
    'Blank': { lhead: 'Announcement', body: '', dropcap: true },
  },
  person: {
    'Guest of Honour': { title: 'Guest of Honour' }, 'Inducting Officer': { title: 'Inducting Officer' }, 'Keynote Speaker': { title: 'Keynote Speaker' },
    'Master of Ceremonies': { title: 'Master of Ceremonies' }, 'Performer': { title: 'Performing Live' }, 'Incoming officer': { title: '2027 Board of Directors' },
  },
  prog: { 'Induction day': DEFAULTS.prog, 'Blank': { title: 'Programme', rows: '' } },
};

let state = {
  kind: 'title', look: 'midnight', size: 'poster', partners: true,
  titles: { title: DEFAULTS.title.title, count: '', person: DEFAULTS.person.title, prog: DEFAULTS.prog.title },
  qr: { title: false, letter: true, prog: false, person: false },
  qrUrl: 'https://' + EVENT.site, qrLabel: 'Scan here for induction details',
  days: daysToGo(),
};
for (const k of Object.keys(DEFAULTS)) { const { title, ...rest } = DEFAULTS[k]; Object.assign(state, rest); }
const images = { photo: null };
const A = {}; // loaded assets
let captionEdited = false, U = 1;

/* ---------- small helpers ---------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
function shrink(img, max = 2000) {
  const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height, k = Math.min(1, max / Math.max(w, h));
  if (k === 1) return img;
  const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
  const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, c.width, c.height); return c;
}
function trim(img) { // cut the empty margin off a logo so it can be placed by its real edges
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0);
  let d; try { d = x.getImageData(0, 0, c.width, c.height).data; } catch { return img; }
  let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
  for (let yy = 0; yy < c.height; yy += 2) for (let xx = 0; xx < c.width; xx += 2) if (d[(yy * c.width + xx) * 4 + 3] > 16) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; }
  if (x1 <= x0 || y1 <= y0) return img;
  const o = document.createElement('canvas'); o.width = x1 - x0 + 2; o.height = y1 - y0 + 2;
  o.getContext('2d').drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height); return o;
}
function tint(img, col) { // a flat-colour copy of a logo, for the faint watermarks
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const x = c.getContext('2d'); x.drawImage(img, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = col; x.fillRect(0, 0, c.width, c.height); return c;
}
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

const F = (w, s, fam = SANS, it = '') => { ctx.font = `${it} ${w} ${s}px ${fam}`; };
const hasLS = 'letterSpacing' in ctx;
const tw = (t, tr = 0) => ctx.measureText(t).width + tr * Math.max(0, [...t].length - 1);
function txt(t, x, y, tr = 0) { // left-aligned text with tracking
  ctx.textAlign = 'left';
  if (!tr) return ctx.fillText(t, x, y);
  if (hasLS) { ctx.letterSpacing = tr + 'px'; ctx.fillText(t, x, y); ctx.letterSpacing = '0px'; return; }
  let cx = x; for (const ch of t) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + tr; }
}
const ctext = (t, cx, y, tr = 0) => txt(t, cx - tw(t, tr) / 2, y, tr);
function wrap(t, maxW, tr = 0, first = maxW) {
  const words = String(t).split(/\s+/).filter(Boolean), out = []; let cur = '';
  for (const w of words) { const n = cur ? cur + ' ' + w : w, lim = out.length ? maxW : first; if (!cur || tw(n, tr) <= lim) cur = n; else { out.push(cur); cur = w; } }
  if (cur) out.push(cur); return out;
}
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function poly(pts) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); }
function cover(img, x, y, w, h, fx = .5, fy = .5, z = 1) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height, s = Math.max(w / iw, h / ih) * z, dw = iw * s, dh = ih * s;
  ctx.drawImage(img, x + (w - dw) * fx, y + (h - dh) * fy, dw, dh);
}
const shadow = (col, blur, ox = 0, oy = 0) => { ctx.shadowColor = col; ctx.shadowBlur = blur * U; ctx.shadowOffsetX = ox * U; ctx.shadowOffsetY = oy * U; }; // shadows ignore the canvas scale, so scale them by hand
const noShadow = () => { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = ctx.shadowOffsetY = 0; };
function goldGrad(y0, y1) { const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#f3e2a4'); g.addColorStop(.38, '#d2b658'); g.addColorStop(.72, '#a8861f'); g.addColorStop(1, '#d9c172'); return g; }
function glow(x, y, r, rgb, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
function sparkle(x, y, r, a = 1) {
  ctx.save(); ctx.globalAlpha = a; glow(x, y, r, '255,252,230', .95);
  for (const [dx, dy, l] of [[1, 0, r * 2.8], [0, 1, r * 1.5]]) {
    const g = ctx.createLinearGradient(x - dx * l, y - dy * l, x + dx * l, y + dy * l); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = g; ctx.lineWidth = Math.max(1, r * .08); ctx.beginPath(); ctx.moveTo(x - dx * l, y - dy * l); ctx.lineTo(x + dx * l, y + dy * l); ctx.stroke();
  }
  ctx.restore();
}
function whiteGlow(draw) { ctx.save(); ctx.fillStyle = '#fff'; shadow('rgba(255,255,255,.8)', 24); draw(); shadow('rgba(255,255,255,.55)', 9); draw(); ctx.restore(); }
// the largest size at which the text fits the width in at most maxLines lines
function fit(t, size, maxW, maxLines, weight = 400, tr = 0, min = size * .45) {
  for (let fs = size; ; fs -= Math.max(2, size * .04)) {
    F(weight, fs); const lines = wrap(t, maxW, fs * tr);
    if (fs <= min || (lines.length <= maxLines && lines.every(l => tw(l, fs * tr) <= maxW))) return { fs, lines, tr: fs * tr };
  }
}

/* ---------- backgrounds, drawn once and kept ---------- */
let grainTile = null;
function grain(B, a = .07) {
  if (!grainTile) { const c = document.createElement('canvas'); c.width = c.height = 240; const x = c.getContext('2d'), d = x.createImageData(240, 240), r = rng(7); for (let i = 0; i < d.data.length; i += 4) { const v = r() < .5 ? 0 : 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = r() * 70; } x.putImageData(d, 0, 0); grainTile = c; }
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = ctx.createPattern(grainTile, 'repeat'); ctx.fillRect(0, 0, W, B); ctx.restore();
}
function navyBase(B) {
  ctx.fillStyle = NAVY; ctx.fillRect(0, 0, W, B);
  glow(CX, B * .36, 980, '10,52,108', .5);
  const g = ctx.createLinearGradient(0, B * .55, 0, B); g.addColorStop(0, 'rgba(0,8,22,0)'); g.addColorStop(1, 'rgba(0,8,22,.55)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, B);
}
function watermarks(B) { // the faint 79 and JCI Cebu shapes behind everything
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, B); ctx.clip();
  const w79 = 1060, h79 = w79 * A.wm79.height / A.wm79.width;
  ctx.globalAlpha = .5; ctx.drawImage(A.wm79, -390, -170, w79, h79);
  ctx.globalAlpha = .34; ctx.drawImage(A.wm79, 900, B * .40, w79, h79);
  const wj = 620, hj = wj * A.wmJci.height / A.wmJci.width;
  ctx.globalAlpha = .42; ctx.drawImage(A.wmJci, 34, B * .615, wj, hj);
  ctx.restore();
}
function dust(pts, ax, ay, bx, by, n, r) { // gold dust that fades from (ax,ay) towards (bx,by)
  ctx.save(); poly(pts); ctx.clip();
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
  const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
  const g = ctx.createLinearGradient(ax, ay, bx, by); g.addColorStop(0, 'rgba(214,185,85,.34)'); g.addColorStop(1, 'rgba(214,185,85,0)'); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, h);
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * w, y = y0 + r() * h, t = clamp(((x - ax) * dx + (y - ay) * dy) / L2, 0, 1), a = Math.pow(1 - t, 2.2) * (.2 + .8 * r());
    if (a < .03) continue; ctx.globalAlpha = a; ctx.fillStyle = r() < .22 ? '#fff1b8' : '#d6b955'; const s = .6 + r() * 1.5; ctx.fillRect(x, y, s, s);
  }
  ctx.restore();
}
function paper(pts, c0, c1, edge) { // one sheet of the layered blue paper, with its gold edge
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  ctx.save(); shadow('rgba(0,0,0,.6)', 34, 6, 12); const g = ctx.createLinearGradient(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)); g.addColorStop(0, c0); g.addColorStop(1, c1); ctx.fillStyle = g; poly(pts); ctx.fill(); ctx.restore();
  ctx.save(); poly(pts); ctx.clip(); ctx.globalAlpha = .09; ctx.fillStyle = ctx.createPattern(grainTile, 'repeat'); ctx.fillRect(Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)); ctx.restore();
  ctx.save(); ctx.lineJoin = 'miter'; ctx.lineWidth = 3; const eg = ctx.createLinearGradient(edge[0][0], edge[0][1], edge[edge.length - 1][0], edge[edge.length - 1][1]); eg.addColorStop(0, '#8f6f1c'); eg.addColorStop(.45, '#f0dc98'); eg.addColorStop(1, '#a8861f'); ctx.strokeStyle = eg;
  ctx.beginPath(); edge.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
}
function bgEdge(B) {
  navyBase(B); watermarks(B); grain(B);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, B); ctx.clip();
  const r = rng(79);
  // top left: two sheets and a beam of gold dust below them
  dust([[-10, 380], [360, 420], [-10, 800]], 150, 420, 60, 770, 5200, r);
  paper([[-40, 170], [205, 140], [262, 400], [-40, 470]], '#0a3166', '#041f47', [[205, 140], [262, 400], [-40, 470]]);
  paper([[-40, -40], [262, -40], [338, 196], [-40, 322]], '#0d3b78', '#062654', [[262, -40], [338, 196], [-40, 322]]);
  // bottom right: the same, mirrored
  dust([[W + 10, B * .43], [W + 10, B * .62], [760, B * .81], [690, B * .745]], 930, B * .70, 880, B * .50, 6200, r);
  paper([[W + 40, B * .60], [770, B * .80], [842, B + 40], [W + 40, B + 40]], '#0c3771', '#05224c', [[W + 40, B * .60], [770, B * .80], [842, B + 40]]);
  paper([[W + 40, B * .765], [905, B * .868], [948, B + 40], [W + 40, B + 40]], '#082b5b', '#031a3d', [[W + 40, B * .765], [905, B * .868], [948, B + 40]]);
  ctx.restore();
}
function bgStar(B) {
  const g = ctx.createLinearGradient(0, 0, W * .4, B); g.addColorStop(0, '#0a1230'); g.addColorStop(.5, '#131a40'); g.addColorStop(1, '#070f25'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, B);
  ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, B); ctx.clip();
  const r = rng(1948);
  for (let i = 0; i < 16; i++) glow(r() * W, r() * B, 220 + r() * 300, '46,42,124', .16 + r() * .14);
  for (let i = 0; i < 9; i++) glow(r() * W, r() * B, 180 + r() * 260, '3,7,24', .3 + r() * .2);
  for (let i = 0; i < 170; i++) { ctx.globalAlpha = .12 + r() * .4; ctx.fillStyle = r() < .4 ? '#e7d98c' : '#dfe6ff'; const s = .7 + r() * 1.5; ctx.fillRect(r() * W, r() * B, s, s); }
  ctx.globalAlpha = 1;
  for (let i = 0; i < 44; i++) { const big = r() < .16; glow(r() * W, r() * B, big ? 11 + r() * 8 : 3 + r() * 6, '214,198,96', big ? .36 + r() * .2 : .4 + r() * .45); }
  ctx.restore(); grain(B, .09);
}
const bgCache = {};
function background(S, B, LH) {
  const key = [state.look, state.size, B].join('|'); let c = bgCache[key];
  if (!c) {
    c = bgCache[key] = document.createElement('canvas'); c.width = S.w; c.height = S.h;
    const keep = ctx; ctx = c.getContext('2d'); // draw with the same helpers on the spare canvas
    try { ctx.setTransform(U, 0, 0, U, 0, 0); if (state.look === 'star') bgStar(LH); else if (state.look === 'edge') bgEdge(LH); else { navyBase(LH); watermarks(LH); grain(LH); } }
    finally { ctx = keep; }
  }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(c, 0, 0); ctx.restore();
}

/* ---------- the fixed pieces ---------- */
function lockup(top, w79) { // gold 79 + "79TH INDUCTION AND TURNOVER CEREMONIES"; returns where it ends
  const h = w79 * A.g79.height / A.g79.width; ctx.drawImage(A.g79, CX - w79 / 2, top, w79, h);
  const fs = w79 / 270 * 19; F(700, fs); ctx.save(); ctx.fillStyle = GOLD; shadow('rgba(214,185,85,.45)', 8);
  ctext('79TH INDUCTION AND', CX, top + h + fs * 1.55, fs * .02); ctext('TURNOVER CEREMONIES', CX, top + h + fs * 2.75, fs * .02); ctx.restore();
  return top + h + fs * 3.3;
}
function footer(fc, x0) { // JCI Cebu + SALAMAT | date and venue, centred on the line y = fc
  let x = x0; const jh = 44, jw = jh * A.jci.width / A.jci.height; ctx.drawImage(A.jci, x, fc - jh / 2, jw, jh); x += jw + 22;
  const sh = 58, sw = sh * A.sal.width / A.sal.height; ctx.drawImage(A.sal, x, fc - sh / 2, sw, sh); x += sw + 22;
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(x, fc - 34, 2, 68); x += 24;
  ctx.fillStyle = '#fff'; F(700, 25); txt(EVENT.date, x, fc - 1, .2); F(700, 15.5); txt(EVENT.venue, x, fc + 22, .2);
}
function qrMatrix(url) {
  if (!window.qrcode || !url) return null;
  try { const q = window.qrcode(0, 'H'); q.addData(url); q.make(); return { n: q.getModuleCount(), dark: (r, c) => q.isDark(r, c) }; } catch { return null; }
}
function drawQR(m, x, y, size) { // white tile with the code; the modules land on whole pixels so phones can read it
  const quiet = 4, cells = m.n + quiet * 2, px = Math.floor(size * U / cells), full = px * cells;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const X = Math.round(x * U + (size * U - full) / 2), Y = Math.round(y * U + (size * U - full) / 2);
  ctx.fillStyle = '#fff'; ctx.fillRect(X, Y, full, full); ctx.fillStyle = '#000';
  for (let r = 0; r < m.n; r++) for (let c = 0; c < m.n; c++) if (m.dark(r, c)) ctx.fillRect(X + (c + quiet) * px, Y + (r + quiet) * px, px, px);
  ctx.restore();
}

/* ---------- the six kinds ---------- */
function kTitle(top, bot) {
  const T = (state.titles.title || '').trim().toUpperCase(), lines = state.details.replace(/\s+$/, '').split('\n').map(l => l.trim());
  while (lines.length && !lines[0]) lines.shift();
  function block(s, y0, draw) {
    let y = y0;
    if (T) { const L = fit(T, 104 * s, 940, 3); F(400, L.fs); for (const l of L.lines) { y += L.fs * 1.06; if (draw) whiteGlow(() => ctext(l, CX, y - L.fs * .2)); } y += (lines.length ? 38 : 0) * s; }
    for (const l of lines) {
      if (!l) { y += 22 * s; continue; }
      if (l[0] === '#') { const fs = 23 * s; F(700, fs); y += 8 * s; for (const w of wrap(l.slice(1).trim().toUpperCase(), 880, fs * .16)) { y += fs * 1.5; if (draw) { ctx.fillStyle = GOLD; ctext(w, CX, y - fs * .42, fs * .16); } } continue; }
      const fs = 31 * s; F(700, fs); for (const w of wrap(l, 900)) { y += fs * 1.42; if (draw) { ctx.fillStyle = '#fff'; ctext(w, CX, y - fs * .4); } }
    }
    return y - y0;
  }
  let s = 1; while (s > .5 && block(s, 0, false) > bot - top) s -= .04;
  block(s, top + clamp((bot - top - block(s, 0, false)) * .36, 0, 300), true);
}

function velvet(x, y, w, h) {
  ctx.save(); shadow('rgba(0,0,0,.6)', 40, 0, 18); ctx.fillStyle = '#1a1252'; ctx.fillRect(x, y, w, h); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, '#1b1356'); g.addColorStop(.5, '#24176c'); g.addColorStop(1, '#150e46'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  const r = rng(26);
  for (let i = 0; i < 46; i++) { const light = r() < .55; glow(x + r() * w, y + r() * h, 50 + r() * 130, light ? '74,54,178' : '9,6,44', light ? .1 + r() * .16 : .16 + r() * .2); }
  ctx.globalAlpha = .16; ctx.fillStyle = ctx.createPattern(grainTile, 'repeat'); ctx.fillRect(x, y, w, h); ctx.globalAlpha = 1;
  const v = ctx.createLinearGradient(x, y, x, y + h); v.addColorStop(0, 'rgba(0,0,0,.26)'); v.addColorStop(.12, 'rgba(0,0,0,0)'); v.addColorStop(.88, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.3)'); ctx.fillStyle = v; ctx.fillRect(x, y, w, h);
  ctx.restore();
  for (const px of [x + 26, x + w - 26]) { // the two gold pins
    ctx.save(); shadow('rgba(0,0,0,.6)', 6, 1, 3); const pg = ctx.createRadialGradient(px - 4, y + 22, 1, px, y + 26, 13); pg.addColorStop(0, '#fff6c4'); pg.addColorStop(.45, '#d2b658'); pg.addColorStop(1, '#7c5d12'); ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, y + 26, 12, 0, 7); ctx.fill(); ctx.restore();
  }
}
function kLetter(top, bot) {
  const cw = 650, pad = 56, tw0 = cw - pad * 2, x = CX - cw / 2, head = (state.lhead || '').trim().toUpperCase();
  const paras = state.body.split(/\n\s*\n/).map(p => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  function block(fs, y0, draw) {
    let y = y0 + 44;
    if (head) { const hs = Math.min(36, fs * 1.02); F(700, hs, SERIF); y += hs * 1.1; if (draw) { ctx.fillStyle = '#fff'; ctext(head, CX, y - hs * .25, hs * .04); } y += fs * .9; }
    paras.forEach((p, pi) => {
      if (pi && pi === paras.length - 1 && paras.length > 2) { // the small gold light before the closing line
        if (draw) { ctx.save(); const lg = ctx.createLinearGradient(CX - 150, 0, CX + 150, 0); lg.addColorStop(0, 'rgba(240,220,130,0)'); lg.addColorStop(.5, 'rgba(255,236,150,1)'); lg.addColorStop(1, 'rgba(240,220,130,0)'); ctx.fillStyle = lg; shadow('rgba(255,225,120,.9)', 10); ctx.fillRect(CX - 150, y - fs * .36, 300, 2.5); ctx.restore(); }
        y += fs * .16;
      }
      const cap = state.dropcap && pi === 0 && /^[A-Za-z]/.test(p) ? p[0] : '', rest = cap ? p.slice(1) : p, cfs = fs * 1.95;
      let capW = 0; if (cap) { F(600, cfs, SERIF, 'italic'); capW = tw(cap) + fs * .02; }
      F(600, fs, SERIF); const lines = wrap(rest, tw0, 0, tw0 - capW);
      lines.forEach((l, i) => {
        y += fs * 1.2;
        if (!draw) return;
        ctx.fillStyle = '#fff'; const lw = tw(l) + (i ? 0 : capW), lx = CX - lw / 2;
        if (!i && cap) { F(600, cfs, SERIF, 'italic'); txt(cap, lx, y - fs * .16); F(600, fs, SERIF); }
        txt(l, lx + (i ? 0 : capW), y - fs * .28);
      });
      y += fs * .72;
    });
    return y - y0 + 26;
  }
  let fs = 45; while (fs > 22 && block(fs, 0, false) > bot - top - 16) fs -= 1;
  const h = Math.max(block(fs, 0, false), 300), y = top + 8 + clamp((bot - top - 16 - h) * .3, 0, 220);
  // the gold light behind the card
  glow(x + cw - 6, y + 96, 250, '240,222,90', .62); glow(x + cw + 30, y + 150, 420, '120,104,40', .22); glow(x - 40, y + h - 30, 300, '70,60,16', .5);
  ctx.save(); ctx.lineCap = 'round'; const sx = [x - 250, y + h + 28, x - 10, y + h - 30, x + 150, y + h * .66];
  for (const [lw, a, b] of [[30, .1, 40], [12, .34, 26], [3.5, .95, 12]]) { ctx.strokeStyle = `rgba(246,226,120,${a})`; ctx.lineWidth = lw; shadow('rgba(255,228,110,.95)', b); ctx.beginPath(); ctx.moveTo(sx[0], sx[1]); ctx.quadraticCurveTo(sx[2], sx[3], sx[4], sx[5]); ctx.stroke(); }
  ctx.restore();
  velvet(x, y, cw, h); block(fs, y, true);
}

function kCount(top, bot) {
  const avail = bot - top, d = Math.max(0, Number(state.days) || 0), over = (state.titles.count || '').trim().toUpperCase(), line = (state.cline || '').trim();
  let label = (state.clabel || '').trim(); if (d === 1 && /^days to go$/i.test(label)) label = 'Day to go';
  const num = d === 0 ? '' : String(d);
  if (d === 0) label = label && !/^days? to go$/i.test(label) ? label : 'Tonight';
  let ns = clamp(avail * .5, 200, 600); F(700, ns); if (num && tw(num) > 900) ns *= 900 / tw(num);
  F(700, ns); const m = num ? ctx.measureText(num) : null, nh = num ? m.actualBoundingBoxAscent : 0;
  const L = label ? fit(label.toUpperCase(), d === 0 ? 150 : 84, 940, 2, 400, .07) : null;
  const hOver = over ? 62 : 0, hLab = L ? L.lines.length * L.fs * 1.1 + 40 : 0, hLine = line ? 68 : 0, total = hOver + nh + hLab + hLine;
  let y = top + Math.max(0, (avail - total) * .42);
  if (over) { F(700, 25); ctx.fillStyle = GOLD; ctext(over, CX, y + 26, 4.5); y += hOver; }
  if (num) {
    y += nh; ctx.save(); ctx.textAlign = 'center'; ctx.lineJoin = 'round'; F(700, ns);
    ctx.strokeStyle = goldGrad(y - nh, y); ctx.lineWidth = ns * .042; shadow('rgba(214,185,85,.5)', 30); ctx.strokeText(num, CX, y);
    noShadow(); ctx.strokeStyle = 'rgba(255,248,214,.6)'; ctx.lineWidth = ns * .007; ctx.strokeText(num, CX - ns * .008, y - ns * .008); ctx.restore();
    const hw = tw(num) / 2; sparkle(CX - hw + ns * .07, y - nh + ns * .02, ns * .085); sparkle(CX + hw - ns * .03, y - nh * .62, ns * .05, .9); sparkle(CX - hw + ns * .1, y - ns * .02, ns * .04, .8);
  }
  if (L) { y += 40; F(400, L.fs); for (const l of L.lines) { y += L.fs * 1.1; whiteGlow(() => ctext(l, CX, y - L.fs * .22, L.tr)); } }
  if (line) { F(700, 30); ctx.fillStyle = '#fff'; const ls = wrap(line, 900); ls.forEach((l, i) => ctext(l, CX, y + 52 + i * 42)); }
}

function kPerson(top, bot) {
  const avail = bot - top, label = (state.titles.person || '').trim().toUpperCase(), name = (state.pname || '').trim().toUpperCase(), roles = (state.prole || '').split('\n').map(s => s.trim()).filter(Boolean);
  function text(s, y0, draw) {
    let y = y0;
    if (name) { const L = fit(name, 68 * s, 960, 2); F(400, L.fs); for (const l of L.lines) { y += L.fs * 1.1; if (draw) whiteGlow(() => ctext(l, CX, y - L.fs * .22)); } y += 14 * s; }
    const fs = 28 * s; F(700, fs); roles.forEach((r, i) => { for (const w of wrap(r, 900)) { y += fs * 1.42; if (draw) { ctx.fillStyle = i ? 'rgba(255,255,255,.86)' : '#fff'; ctext(w, CX, y - fs * .4); } } });
    return y - y0;
  }
  const hLab = label ? 64 : 0; let s = 1, th = text(s, 0, false), ph = avail - hLab - th - 34;
  while (ph < 300 && s > .6) { s -= .05; th = text(s, 0, false); ph = avail - hLab - th - 34; }
  ph = clamp(ph, 220, 760); let pw = ph * .8; if (pw > 620) { pw = 620; ph = pw / .8; }
  let y = top + Math.max(0, (avail - hLab - ph - 34 - th) * .4);
  if (label) { const L = fit(label, 27, 940, 1, 700, .17); F(700, L.fs); ctx.fillStyle = GOLD; ctext(label, CX, y + 30, L.tr); y += hLab; }
  const x = CX - pw / 2, R = 30;
  glow(CX, y + ph * .5, pw * .95, '214,185,85', .16);
  ctx.save(); shadow('rgba(0,0,0,.55)', 36, 0, 16); rr(x, y, pw, ph, R); ctx.fillStyle = '#06224a'; ctx.fill(); ctx.restore();
  ctx.save(); rr(x, y, pw, ph, R); ctx.clip();
  if (images.photo) cover(images.photo, x, y, pw, ph, .5, state.py / 100, state.pz / 100);
  else { const g = ctx.createLinearGradient(x, y, x, y + ph); g.addColorStop(0, '#0b2f63'); g.addColorStop(1, '#041b3d'); ctx.fillStyle = g; ctx.fillRect(x, y, pw, ph); ctx.fillStyle = 'rgba(255,255,255,.5)'; F(700, 26); ctext('Add a photo', CX, y + ph / 2 + 8); }
  ctx.restore();
  ctx.save(); rr(x, y, pw, ph, R); ctx.strokeStyle = goldGrad(y, y + ph); ctx.lineWidth = 5; shadow('rgba(214,185,85,.55)', 16); ctx.stroke(); ctx.restore();
  sparkle(x + 8, y + 10, 22, .95); sparkle(x + pw - 4, y + ph - 26, 14, .8);
  text(s, y + ph + 34, true);
}

function kProg(top, bot) {
  const T = (state.titles.prog || '').trim().toUpperCase();
  const rows = (state.rows || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    if (l[0] === '#') return { h: l.slice(1).trim().toUpperCase() };
    const p = l.split('|').map(x => x.trim()); return p.length > 1 ? { t: p[0], w: p[1], p: p.slice(2).join(' · ') } : { t: '', w: p[0], p: '' };
  });
  const anyTime = rows.some(r => r.t);
  function block(s, y0, draw) {
    let y = y0, prev = null; const xL = anyTime ? 356 : 150, xi = xL + 30, iw = W - xi - 96;
    if (T) { const L = fit(T, 88 * s, 940, 2); F(400, L.fs); for (const l of L.lines) { y += L.fs * 1.06; if (draw) whiteGlow(() => ctext(l, CX, y - L.fs * .2)); } y += 34 * s; }
    for (const r of rows) {
      if (r.h !== undefined) { const fs = 23 * s; F(700, fs); y += 16 * s + fs * 1.5; if (draw) { ctx.fillStyle = GOLD; ctext(r.h, CX, y - fs * .42, fs * .16); } y += 12 * s; prev = null; continue; }
      const fs = 31 * s; F(700, fs); const ls = wrap(r.w, iw), base = y + fs * 1.15, dotY = base - fs * .33;
      if (draw) {
        if (prev !== null) { ctx.fillStyle = 'rgba(201,171,79,.5)'; ctx.fillRect(xL - .75, prev + 9 * s, 1.5, dotY - prev - 18 * s); }
        ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(xL, dotY, 5.5 * s, 0, 7); ctx.fill();
        if (r.t) { F(700, 27 * s); ctx.fillStyle = GOLD; txt(r.t, xL - 26 - tw(r.t), base - fs * .02); }
        F(700, fs); ctx.fillStyle = '#fff'; ls.forEach((l, i) => txt(l, xi, base + i * fs * 1.22));
      }
      y = base + (ls.length - 1) * fs * 1.22;
      if (r.p) { const ps = 21 * s; F(400, ps); for (const l of wrap(r.p, iw)) { y += ps * 1.4; if (draw) { ctx.fillStyle = 'rgba(255,255,255,.74)'; txt(l, xi, y); } } }
      y += 26 * s; prev = dotY;
    }
    return y - y0;
  }
  let s = 1; while (s > .5 && block(s, 0, false) > bot - top) s -= .04;
  block(s, top + clamp((bot - top - block(s, 0, false)) * .36, 0, 300), true);
}

function kKey(top, B) { // the cover: the gold 79 by itself
  glow(W * .84, -60, 640, '170,200,255', .34); glow(-70, B + 30, 430, '170,200,255', .26);
  const jh = 52, jw = jh * A.jci.width / A.jci.height, sh = 66, sw = sh * A.sal.width / A.sal.height, x = CX - (jw + 44 + sw) / 2, ly = top + 64;
  ctx.drawImage(A.jci, x, ly - jh / 2, jw, jh); ctx.drawImage(A.sal, x + jw + 44, ly - sh / 2, sw, sh);
  const foot = B - (state.size === 'story' ? 210 : 104), free = foot - (ly + 60);
  const w = clamp(free * .62, 420, 700), h = w * A.g79.height / A.g79.width, fs = w / 660 * 45, line = (state.kline || '').trim();
  const total = h + fs * 3.1 + (line ? 70 : 0), y = ly + 60 + Math.max(0, (free - total) * .42);
  glow(CX, y + h * .5, w * .9, '214,185,85', .12);
  ctx.drawImage(A.g79, CX - w / 2, y, w, h);
  sparkle(CX - w * .36, y + h * .03, w * .075); sparkle(CX + w * .47, y + h * .22, w * .04, .9); sparkle(CX - w * .34, y + h * .97, w * .035, .85);
  F(700, fs); ctx.save(); ctx.fillStyle = GOLD; shadow('rgba(214,185,85,.45)', 10); ctext('79TH INDUCTION AND', CX, y + h + fs * 1.5); ctext('TURNOVER CEREMONIES', CX, y + h + fs * 2.72); ctx.restore();
  if (line) { F(700, 29); ctx.fillStyle = '#fff'; ctext(line, CX, y + h + fs * 2.72 + 62); }
  ctx.fillStyle = '#fff'; F(700, 30); ctext(EVENT.date, CX, foot, .3); F(700, 19); ctext(EVENT.venue, CX, foot + 31, .2);
}

/* ---------- putting a pubmat together ---------- */
const mini = $('#mini'), big = $('#big'), peek = $('#peek');
function render() { try { renderCore(); } catch (e) { console.error(e); } syncMini(); }
function renderCore() {
  const S = SIZES[state.size], story = state.size === 'story';
  if (cv.width !== S.w || cv.height !== S.h) { cv.width = big.width = S.w; cv.height = big.height = S.h; mini.height = 220; mini.width = Math.round(220 * S.w / S.h); }
  U = S.w / W; const LH = S.h / U;
  ctx.setTransform(U, 0, 0, U, 0, 0); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left'; ctx.globalAlpha = 1; noShadow();
  const PH = state.partners && A.partners ? W * A.partners.height / A.partners.width : 0;
  const B = story ? LH - (PH ? PH + 132 : 0) : LH - PH; // where the navy picture ends and the partners strip begins
  background(S, B, LH);
  const topPad = story ? 190 : 46, lowPad = story && !PH ? 150 : 0;
  if (state.kind === 'key') kKey(story ? 150 : 0, B - lowPad * .4);
  else {
    const small = state.size === 'feed' || state.kind === 'letter' && !story;
    const lockEnd = lockup(topPad, small ? 216 : 270);
    const fc = B - lowPad - (state.size === 'feed' ? 62 : 78);
    footer(fc, story ? 48 : 36);
    let bot = fc - 64;
    const m = state.qr[state.kind] ? qrMatrix((state.qrUrl || '').trim()) : null;
    if (m) {
      const q = 178, qx = W - (story ? 48 : 36) - q, qy = fc + 36 - q, lab = (state.qrLabel || '').trim().toUpperCase();
      drawQR(m, qx, qy, q);
      F(700, 13.5); const ls = lab ? wrap(lab, q + 30, .3) : []; ctx.fillStyle = '#fff'; ls.forEach((l, i) => ctext(l, qx + q / 2, qy - 12 - (ls.length - 1 - i) * 17, .3));
      bot = Math.min(bot, qy - 12 - ls.length * 17 - 16);
    }
    const top = lockEnd + (small ? 18 : 30);
    ({ title: kTitle, letter: kLetter, count: kCount, person: kPerson, prog: kProg })[state.kind](top, bot);
  }
  if (PH) { const y = story ? LH - PH - 132 : B; ctx.fillStyle = '#fff'; ctx.fillRect(0, y, W, PH + 1); ctx.drawImage(A.partners, 0, y, W, PH); }
}
function syncMini() {
  const m = mini.getContext('2d'); m.imageSmoothingQuality = 'high'; m.clearRect(0, 0, mini.width, mini.height); m.drawImage(cv, 0, 0, mini.width, mini.height);
  if (peek.open) big.getContext('2d').drawImage(cv, 0, 0);
}

/* ---------- caption ---------- */
const TAIL = () => `79th Induction and Turnover Ceremonies\n12 December 2026 · Mactan Expo, Mactan Newtown\nDetails: ${EVENT.site}\n\n#SALAMAT79 #GratitudeInMotion #JCICebu #ChampionGenuineImpact`;
function caption() {
  const k = state.kind, t = (state.titles[k] || '').trim(); let top = '';
  if (k === 'title') top = [t, state.details.split('\n').map(l => l.trim().replace(/^#\s*/, '')).join('\n').replace(/\n{3,}/g, '\n\n').trim()].filter(Boolean).join('\n\n');
  else if (k === 'letter') top = state.body.trim();
  else if (k === 'count') { const d = Number(state.days) || 0; top = (d === 0 ? 'Tonight.' : `${d} ${d === 1 ? 'day' : 'days'} to go.`) + (state.cline.trim() ? ' ' + state.cline.trim().replace(/[.!]?$/, '.') : ''); }
  else if (k === 'person') top = [t ? t + ':' : '', state.pname.trim(), state.prole.split('\n').map(s => s.trim()).filter(Boolean).join(', ')].filter(Boolean).join(t ? ' ' : '\n').replace(/: (.+?) (?=\S)/, ': $1\n');
  else if (k === 'prog') top = [t, state.rows.split('\n').map(l => l.trim()).filter(Boolean).map(l => l[0] === '#' ? '\n' + l.slice(1).trim() : l.split('|').map(x => x.trim()).filter(Boolean).join(' · ')).join('\n').trim()].filter(Boolean).join('\n\n');
  else top = state.kline.trim();
  return [top, TAIL()].filter(Boolean).join('\n\n');
}

/* ---------- the form ---------- */
function fillForm() {
  for (const el of form.elements) {
    const n = el.name; if (!n) continue;
    const v = n === 'title' ? state.titles[state.kind] || '' : n === 'qrOn' ? !!state.qr[state.kind] : state[n];
    if (el.type === 'radio') el.checked = el.value === v; else if (el.type === 'checkbox') el.checked = !!v; else el.value = v ?? '';
  }
}
function applyKind() {
  const k = state.kind;
  document.querySelectorAll('[data-only]').forEach(el => { el.hidden = !el.dataset.only.split(' ').includes(k); });
  const box = $('#starts'), set = STARTS[k]; box.innerHTML = ''; box.hidden = !set;
  if (set) for (const name of Object.keys(set)) { const b = document.createElement('button'); b.type = 'button'; b.textContent = name; b.onclick = () => applyStart(set[name], name); box.append(b); }
  fillForm(); syncNotes();
}
function applyStart(v, name) {
  const { title, ...rest } = v; if (title !== undefined) state.titles[state.kind] = title; Object.assign(state, rest);
  captionEdited = false; fillForm(); $('#cap').value = caption(); render(); if (name) toast(`${name} filled in`);
}
function syncNotes() {
  $('#sizeNote').textContent = SIZES[state.size].note;
  $('#qrFields').hidden = !state.qr[state.kind];
  const note = $('#qrNote'), on = state.qr[state.kind]; note.hidden = !on;
  if (on) { const m = qrMatrix((state.qrUrl || '').trim()); note.textContent = !window.qrcode ? 'The QR tool did not load. Check your internet and reload the page.' : !m ? 'Type the link to make the QR code.' : m.n > 41 ? 'That link is long, so the code is very fine and may not scan. Use a shorter link.' : 'Scan it with your own phone before you post.'; }
}
let raf = 0, to = 0;
function go() { cancelAnimationFrame(raf); clearTimeout(to); render(); }
const schedule = () => { cancelAnimationFrame(raf); clearTimeout(to); raf = requestAnimationFrame(go); to = setTimeout(go, 140); };
form.addEventListener('input', e => {
  const t = e.target, n = t.name; if (!n) return;
  if (n === 'kind') { state.kind = t.value; captionEdited = false; applyKind(); }
  else if (n === 'title') state.titles[state.kind] = t.value;
  else if (n === 'qrOn') state.qr[state.kind] = t.checked;
  else if (t.type === 'checkbox') state[n] = t.checked;
  else if (t.type === 'radio') { if (t.checked) state[n] = t.value; }
  else if (t.type === 'range' || t.type === 'number') state[n] = t.value === '' ? 0 : Number(t.value);
  else state[n] = t.value;
  syncNotes(); if (!captionEdited) $('#cap').value = caption(); schedule();
});
$('#cap').addEventListener('input', () => { captionEdited = true; });
$('#reset').onclick = () => { const k = state.kind; if (k === 'count') state.days = daysToGo(); if (k === 'person') { images.photo = null; $('#photoNote').textContent = 'No photo yet'; } applyStart(DEFAULTS[k]); toast('Back to the example'); };
$('#photoIn').addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return;
  try { images.photo = shrink(await loadImg(URL.createObjectURL(f))); $('#photoNote').textContent = f.name; render(); } catch { toast('That photo could not be opened'); }
});

/* ---------- download, share, copy ---------- */
const slug = s => String(s || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const NAMES = { title: 'title', letter: 'announcement', count: 'countdown', person: 'spotlight', prog: 'programme', key: 'key-visual' };
function fileName() { const k = state.kind, extra = k === 'count' ? state.days + '-days' : k === 'person' ? state.pname : k === 'letter' ? state.lhead : state.titles[k]; return ['induction79', NAMES[k], slug(extra).slice(0, 40), state.size].filter(Boolean).join('-') + '.jpg'; }
const blob = (type = 'image/jpeg') => new Promise(res => cv.toBlob(res, type, .94));
$('#dl').onclick = async () => { render(); const b = await blob(), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fileName(); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('Downloaded'); };
if (navigator.canShare) {
  const s = $('#share'); s.hidden = false;
  s.onclick = async () => { render(); const files = [new File([await blob()], fileName(), { type: 'image/jpeg' })]; if (navigator.canShare({ files })) { try { await navigator.share({ files, text: $('#cap').value }); } catch {} } else toast('Sharing files is not supported here. Use Download.'); };
}
if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
  const c = $('#copyImg'); c.hidden = false;
  c.onclick = async () => { render(); try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob('image/png') })]); toast('Pubmat copied. Paste it in the chat.'); } catch { toast('Copying images is not supported here. Use Download or Share.'); } };
}
$('#copy').onclick = async () => { try { await navigator.clipboard.writeText($('#cap').value); toast('Caption copied'); } catch { $('#cap').select(); toast('Select and copy the text'); } };

/* ---------- phone bar ---------- */
const dock = $('#dock');
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => { dock.hidden = e.isIntersecting; document.body.classList.toggle('docked', !e.isIntersecting); }, { threshold: .25 }).observe(cv);
  $('#dockDl').onclick = () => $('#dl').click(); $('#peekDl').onclick = () => $('#dl').click();
  if (!$('#share').hidden) { const s = $('#dockShare'); s.hidden = false; s.onclick = () => $('#share').click(); }
  $('#dockPeek').onclick = () => { render(); big.getContext('2d').drawImage(cv, 0, 0); peek.showModal(); };
  $('#peekClose').onclick = () => peek.close();
  peek.addEventListener('click', e => { if (e.target === peek) peek.close(); });
}
let tt; function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2200); }

/* ---------- start ---------- */
(async () => {
  try { await Promise.all(['400 40px Arimo', '700 40px Arimo', '600 40px "Cormorant Garamond"', '700 40px "Cormorant Garamond"', 'italic 600 40px "Cormorant Garamond"'].map(f => document.fonts.load(f))); } catch {}
  const day = Math.floor(Date.now() / 864e5); // the partners strip changes when a partner is added, so fetch a fresh copy each day
  const [g79, jci, sal, partners] = await Promise.all(['logos/Gold-79.png', 'logos/JCI-Cebu-white.png', 'logos/SALAMAT-logo-white.png', 'assets/partner-footer.png?d=' + day].map(s => loadImg(s).catch(() => null)));
  A.g79 = trim(g79); A.jci = trim(jci); A.sal = sal; A.partners = partners;
  A.wm79 = tint(A.g79, '#000c1f'); A.wmJci = tint(A.jci, '#000c1f');
  grain(0); // make the grain tile before the first paper is drawn
  const q = new URLSearchParams(location.search);
  if (DEFAULTS[q.get('kind')]) state.kind = q.get('kind');
  if (SIZES[q.get('size')]) state.size = q.get('size');
  if (['midnight', 'edge', 'star'].includes(q.get('look'))) state.look = q.get('look');
  applyKind(); $('#cap').value = caption(); render();
})();
