{
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash = str => { let x = 2166136261; for (const ch of str) x = Math.imul(x ^ ch.charCodeAt(0), 16777619); return x >>> 0; };
const rng = seed => () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const fmtDate = (d, o = {day:'numeric', month:'short', year:'numeric'}) => new Date(d).toLocaleDateString('en-GB', {timeZone:'Asia/Kolkata', ...o});
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PH = window.JSRO_PHOTOS, DATA = window.JSRO_DATA, CFG = window.JSRO_CONFIG || {};

/* ---------- nav + stars ---------- */
const nav = $('#nav'); const onScroll = () => nav.classList.toggle('solid', scrollY > 40); addEventListener('scroll', onScroll, {passive:true}); onScroll();
const sc = $('#stars');
const drawStars = () => { const d = devicePixelRatio || 1, W = sc.clientWidth, H = sc.clientHeight; if (!W) return; sc.width = W*d; sc.height = H*d; const c = sc.getContext('2d'); c.scale(d, d); const r = rng(7), n = Math.round(W*H/2600);
  for (let i = 0; i < n; i++) { const k = r(); c.globalAlpha = .2 + k*.75; c.fillStyle = k > .97 ? '#cfe2ff' : '#fff'; c.beginPath(); c.arc(r()*W, r()*H, k > .96 ? 1.4 : .4 + k*.7, 0, 7); c.fill(); } };
const starRO = new ResizeObserver(drawStars); starRO.observe(sc);

/* ---------- hero window ---------- */
const SLIDES = ['earth', 'mars', 'geminids', 'christmas'];
$('#heroWin').innerHTML = SLIDES.map((k, i) => `<div class="sl${i ? '' : ' on'}"><img src="assets/win-${k}.png" alt=""></div>`).join('');
let hi = 0; if (!reduce) setInterval(() => { const sl = $$('#heroWin .sl'); sl[hi].classList.remove('on'); hi = (hi + 1) % sl.length; sl[hi].classList.add('on'); }, 4500);

/* ---------- sky events + launches ---------- */
const now = () => Date.now();
const liveEvents = () => DATA.events.filter(e => new Date(e.until).getTime() > now()).sort((a, b) => new Date(a.at) - new Date(b.at));
const liveLaunches = () => DATA.launches.filter(l => new Date(l.until + 'T23:59:00+05:30').getTime() > now()).sort((a, b) => a.net.localeCompare(b.net));
let laFilter = 'all';
function renderFeeds() {
  const ev = liveEvents(), la = liveLaunches(), f = ev[0];
  if (f) {
    $('#evK').textContent = 'Skywatch · ' + f.when; $('#evT').textContent = f.title; $('#evS').textContent = f.summary;
    const ph = PH[f.photo]; $('#evArt').innerHTML = ph ? `<img src="${ph.src}" alt="${esc(f.title)}" style="object-position:${ph.focus}"><figcaption>Photo: ${esc(ph.credit)}</figcaption>` : '';
    $('#evF').innerHTML = f.facts.map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`).join('') + `<tr><td>Viewing</td><td>${esc(f.rating)}</td></tr>`;
  } else { $('#evT').textContent = 'New events coming soon'; $('#evS').textContent = 'The next batch of sky events is being lined up.'; }
  $('#evL').innerHTML = ev.slice(1, 9).map(e => `<tr><td class="d">${esc(fmtDate(e.at))}</td><td><b>${esc(e.title)}</b><small>${esc(e.summary)}</small></td><td><span class="pill">${esc(e.rating)}</span></td></tr>`).join('') || '<tr><td colspan="3" class="note">More events coming soon.</td></tr>';
  const shown = la.filter(l => laFilter === 'all' || (l.tags || []).includes(laFilter));
  $('#laL').innerHTML = shown.map((l, i) => `<tr class="${i ? '' : 'first'}"><td class="d">${esc(l.label)}</td><td><b>${esc(l.mission)}</b>${(l.tags||[]).includes('india') ? ' <span class="pill">India</span>' : ''}${(l.tags||[]).includes('crewed') ? ' <span class="pill">Crewed</span>' : ''}<small>${esc(l.blurb)}</small></td><td>${esc(l.vehicle)}<small>${esc(l.provider)}</small></td><td>${esc(l.site)}</td></tr>`).join('') || '<tr><td colspan="4" class="note">Nothing in this category right now.</td></tr>';
  $('#laUpd').textContent = fmtDate(DATA.updated);
  tick();
}
function tick() {
  const f = liveEvents()[0]; if (!f) return;
  let s = Math.max(0, (new Date(f.at).getTime() - now()) / 1000); const d = Math.floor(s/86400); s -= d*86400; const h = Math.floor(s/3600); s -= h*3600; const m = Math.floor(s/60);
  $('#cd-d').textContent = String(d).padStart(2,'0'); $('#cd-h').textContent = String(h).padStart(2,'0'); $('#cd-m').textContent = String(m).padStart(2,'0');
  if (new Date(f.until).getTime() < now()) renderFeeds();
}
setInterval(tick, 15000);
$('#laChips').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; laFilter = b.dataset.f; $$('#laChips button').forEach(x => x.setAttribute('aria-pressed', x === b)); renderFeeds(); });
renderFeeds();

/* ---------- images + posters ---------- */
const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
const logoP = loadImg('assets/logo-full.png');
const photoCache = {}; const photoImg = k => photoCache[k] || (photoCache[k] = loadImg(PH[k].src));
const fontsP = document.fonts ? Promise.all([document.fonts.load('600 40px Barlow'), document.fonts.load('500 40px Barlow'), document.fonts.load('500 24px "IBM Plex Mono"')]).catch(() => {}) : Promise.resolve();
const sp = (c, v) => { if ('letterSpacing' in c) c.letterSpacing = v; };
function wrapText(c, text, maxW) { const words = text.split(' '), lines = []; let ln = ''; for (const w of words) { const t = ln ? ln + ' ' + w : w; if (c.measureText(t).width > maxW && ln) { lines.push(ln); ln = w; } else ln = t; } lines.push(ln); return lines; }
async function makePoster(p) {
  await fontsP; const ph = PH[p.photo]; const [logo, img] = await Promise.all([logoP, photoImg(p.photo)]);
  const W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = '#020307'; c.fillRect(0, 0, W, H);
  const [fx, fy] = ph.focus.split(' ').map(v => parseFloat(v) / 100), s = Math.max(W / img.naturalWidth, H / img.naturalHeight), iw = img.naturalWidth * s, ih = img.naturalHeight * s;
  c.drawImage(img, Math.min(0, Math.max(W - iw, W / 2 - iw * fx)), Math.min(0, Math.max(H - ih, H / 2 - ih * fy)), iw, ih);
  let g = c.createLinearGradient(0, 0, 0, 440); g.addColorStop(0, 'rgba(2,3,7,.92)'); g.addColorStop(1, 'rgba(2,3,7,0)'); c.fillStyle = g; c.fillRect(0, 0, W, 440);
  g = c.createLinearGradient(0, 760, 0, 1150); g.addColorStop(0, 'rgba(2,3,7,0)'); g.addColorStop(1, 'rgba(2,3,7,.96)'); c.fillStyle = g; c.fillRect(0, 760, W, 590);
  const Lw = 560, Lh = Lw * 533 / 1077; c.drawImage(logo, (W - Lw) / 2, 48, Lw, Lh);
  c.textAlign = 'center'; c.fillStyle = '#c9d0dc'; c.font = '600 24px Barlow, sans-serif'; sp(c, '7px'); c.fillText(p.kicker.toUpperCase(), W/2, 990);
  c.fillStyle = '#fff'; c.font = '600 76px Barlow, sans-serif'; sp(c, '4px'); let lines = wrapText(c, p.title.toUpperCase(), 960), lh = 80; if (lines.length > 1) { c.font = '600 62px Barlow, sans-serif'; lines = wrapText(c, p.title.toUpperCase(), 960); lh = 66; }
  let y = 1070; lines.slice(0, 2).forEach((l, i) => c.fillText(l, W/2, y + i * lh)); y += (Math.min(lines.length, 2) - 1) * lh + 58;
  c.fillStyle = '#cfe2ff'; c.font = '500 32px Barlow, sans-serif'; sp(c, '3px'); c.fillText(p.when.toUpperCase(), W/2, y);
  if (p.line) { c.fillStyle = '#9aa3b3'; c.font = '500 24px Barlow, sans-serif'; sp(c, '1px'); c.fillText(p.line, W/2, y + 42); }
  c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(W/2 - 200, 1268, 400, 1); c.fillStyle = '#9aa3b3'; c.font = '600 17px Barlow, sans-serif'; sp(c, '6px'); c.fillText('JSRO · ADVANCING FORWARD SINCE 2014', W/2, 1300);
  c.fillStyle = 'rgba(255,255,255,.55)'; c.font = '400 15px Barlow, sans-serif'; sp(c, '0px'); c.fillText('Photo: ' + ph.credit, W/2, 1330);
  return cv;
}
const ARCHIVE = [['earth', 'The mark — Earth', 'Original window'], ['mars', 'The mark — Mars', 'Exploration window'], ['geminids', 'Geminids 2026', 'Skywatch poster'], ['christmas', 'Season’s greetings', 'Holiday window']];
const posterCanvases = {};
async function renderPosters() {
  $('#arcPosters').innerHTML = ARCHIVE.map(([k, t, s]) => `<article class="poster"><img class="sq" src="assets/poster-${k}.jpg" alt="${esc(t)} poster" loading="lazy"><div><b>${esc(t)}</b><span>${esc(s)} · 1000 × 1000</span><a class="btn sm" href="assets/poster-${k}.jpg" download="JSRO-${k}.jpg">Download</a></div></article>`).join('');
  const ev = liveEvents().filter(e => PH[e.photo]).slice(0, 3).map(e => ({ id: e.id, photo: e.photo, kicker: 'JSRO Skywatch', title: e.title, when: e.when, line: ((e.facts.find(([k]) => /Rate|Brightness/.test(k)) || e.facts[0] || [])[1]) || '' }));
  const la = liveLaunches().find(l => (l.tags || []).includes('india')) || liveLaunches()[0];
  if (la && PH[la.photo]) ev.push({ id: la.id, photo: la.photo, kicker: 'JSRO Launch watch', title: la.mission, when: la.label, line: `${la.vehicle} · ${la.site}` });
  $('#genPosters').innerHTML = ev.map(p => `<article class="poster"><img id="pi-${esc(p.id)}" alt="${esc(p.title)} poster"><div><b>${esc(p.title)}</b><span>${esc(p.when)} · 1080 × 1350</span><button class="btn sm" type="button" data-gen="${esc(p.id)}" disabled>Download</button></div></article>`).join('');
  for (const p of ev) { try { const cv = await makePoster(p); posterCanvases[p.id] = { cv, name: `JSRO-${p.id}.jpg` }; $('#pi-' + p.id).src = cv.toDataURL('image/jpeg', .86); $(`[data-gen="${p.id}"]`).disabled = false; } catch (err) { console.warn(err); } }
}
renderPosters();
const saveBlob = (blob, name) => { const u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); };
$('#genPosters').addEventListener('click', e => { const g = e.target.closest('[data-gen]'); if (!g || !posterCanvases[g.dataset.gen]) return; const { cv, name } = posterCanvases[g.dataset.gen]; cv.toBlob(b => saveBlob(b, name), 'image/jpeg', .92); });

/* ---------- crew card preview ---------- */
async function drawCard(cv, m) {
  const c = cv.getContext('2d'), W = 1012, H = 638, name = (m.name || 'Your name').toUpperCase();
  let logo = null; try { logo = await logoP; } catch {}
  c.save(); c.clearRect(0, 0, W, H); c.beginPath(); c.roundRect ? c.roundRect(0, 0, W, H, 36) : c.rect(0, 0, W, H); c.clip();
  c.fillStyle = '#05070c'; c.fillRect(0, 0, W, H);
  const r = rng(hash(name)); for (let i = 0; i < 160; i++) { c.globalAlpha = .15 + r()*.5; c.fillStyle = '#fff'; c.beginPath(); c.arc(r()*W, r()*H*.8, r()*1.1 + .3, 0, 7); c.fill(); } c.globalAlpha = 1;
  const gx = W*1.16, gy = H*2.62, R = 1215, O = R + 70, q = v => v / O;
  const g = c.createRadialGradient(gx, gy, 0, gx, gy, O); g.addColorStop(0, '#05070c'); g.addColorStop(q(R - 90), '#06101f'); g.addColorStop(q(R - 6), 'rgba(40,110,230,.75)'); g.addColorStop(q(R), 'rgba(205,228,255,.95)'); g.addColorStop(q(R + 4), 'rgba(61,139,255,.35)'); g.addColorStop(1, 'rgba(61,139,255,0)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  if (logo) c.drawImage(logo, 48, 40, 300, 300*533/1077);
  const fit = (t, wgt, size, maxW) => { do { c.font = `${wgt} ${size}px Barlow, sans-serif`; size -= 2; } while (c.measureText(t).width > maxW && size > 16); };
  c.textAlign = 'right'; c.fillStyle = '#9aa3b3'; c.font = '600 17px Barlow, sans-serif'; sp(c, '4px'); c.fillText('CREW APPLICATION', 960, 78);
  c.fillStyle = '#ffd27a'; c.font = '500 46px Barlow, sans-serif'; sp(c, '2px'); c.fillText('PENDING', 962, 130); c.textAlign = 'left';
  c.fillStyle = 'rgba(255,255,255,.16)'; c.fillRect(56, 222, 900, 1);
  c.fillStyle = '#9aa3b3'; c.font = '600 16px Barlow, sans-serif'; sp(c, '4px'); c.fillText('NAME', 56, 266);
  c.fillStyle = m.name ? '#fff' : '#4b5363'; sp(c, '3px'); fit(name, 600, 52, 880); c.fillText(name, 56, 318);
  const cell = (label, val, x, w) => { c.fillStyle = '#9aa3b3'; c.font = '600 16px Barlow, sans-serif'; sp(c, '4px'); c.fillText(label, x, 384); c.fillStyle = val ? '#fff' : '#4b5363'; sp(c, '1px'); const v = (val || '—').toUpperCase(); fit(v, 500, 25, w); c.fillText(v, x, 420); };
  cell('ROLE', m.role, 56, 280); cell('CALLSIGN', m.callsign, 360, 180); cell('HOME BASE', m.base, 560, 190); cell('ISSUED', '', 780, 180);
  const mz = s => String(s || '').toUpperCase().normalize('NFD').replace(/[^A-Z0-9]+/g, '<');
  const l1 = ('JS<CREW<<' + mz(m.name || 'CREW') + '<'.repeat(44)).slice(0, 44);
  const l2 = ('PEND<' + mz(m.role || 'CREW') + '<' + mz(m.fav || 'SKY') + '<' + new Date().getFullYear() + '<'.repeat(44)).slice(0, 44);
  c.fillStyle = 'rgba(255,255,255,.78)'; c.font = '500 24px "IBM Plex Mono", monospace'; sp(c, '3px'); c.fillText(l1, 56, 538); c.fillText(l2, 56, 578); sp(c, '0px');
  c.restore();
}
const F = { name:$('#f-name'), mail:$('#f-mail'), call:$('#f-call'), base:$('#f-base'), role:$('#f-role'), fav:$('#f-fav'), why:$('#f-why'), link:$('#f-link') };
const form = () => ({ name:F.name.value.trim(), email:F.mail.value.trim(), callsign:F.call.value.trim(), base:F.base.value.trim(), role:F.role.value, fav:F.fav.value.trim(), why:F.why.value.trim(), link:F.link.value.trim() });
const redraw = () => drawCard($('#card'), form());
[F.name, F.call, F.base, F.role, F.fav].forEach(el => el.addEventListener('input', redraw));
fontsP.then(redraw); redraw();

/* ---------- forms → email (FormSubmit) ---------- */
const hasW3F = () => CFG.web3formsKey && !/YOUR-/i.test(CFG.web3formsKey);
const hasFS = () => CFG.formTo && !/YOUR-EMAIL/i.test(CFG.formTo);
async function send(fields, subject, honey) {
  if (honey) return true;
  let r;
  if (hasW3F()) r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: CFG.web3formsKey, subject, from_name: 'JSRO website', ...fields }) });
  else if (hasFS()) r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CFG.formTo)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...fields, _subject: subject, _template: 'table', _captcha: 'false' }) });
  else throw new Error('not-configured');
  const j = await r.json().catch(() => ({})); if (!r.ok || String(j.success) === 'false') throw new Error(j.message || 'send-failed'); return true;
}
const failMsg = err => err.message === 'not-configured' ? 'Sign-ups open very soon — the form isn’t connected yet.' : 'That didn’t go through. Please try again in a minute.';
$('#subForm').addEventListener('submit', async e => {
  e.preventDefault(); const msg = $('#subMsg'), email = $('#s-mail').value.trim(), name = $('#s-name').value.trim(), btn = e.target.querySelector('button'); msg.className = 'note';
  if (!/^\S+@\S+\.\S+$/.test(email)) { msg.textContent = 'Please check that email address.'; return; }
  btn.disabled = true; msg.textContent = 'Sending…';
  try { await send({ type: 'Newsletter subscription', name, email }, `JSRO · New subscriber: ${name || email}`, e.target._honey.value); msg.className = 'note ok'; msg.textContent = 'You’re on the list. The next dispatch will reach your inbox.'; e.target.reset(); }
  catch (err) { msg.textContent = failMsg(err); }
  btn.disabled = false;
});
$('#joinForm').addEventListener('submit', async e => {
  e.preventDefault(); const m = form(), msg = $('#joinMsg'), btn = $('#joinBtn'); msg.className = 'note';
  if (!m.name || !m.email || !m.role || !m.why) { msg.textContent = 'Please fill in your name, email, role and why you’d like to join.'; return; }
  if (!/^\S+@\S+\.\S+$/.test(m.email)) { msg.textContent = 'Please check that email address.'; return; }
  btn.disabled = true; msg.textContent = 'Sending…';
  try { await send({ type: 'Crew application', name: m.name, email: m.email, callsign: m.callsign, role: m.role, 'home base': m.base, 'favourite thing in the sky': m.fav, 'why join': m.why, link: m.link }, `JSRO · Crew application: ${m.name} (${m.role})`, e.target._honey.value);
    msg.className = 'note ok'; msg.textContent = 'Application received. Jude reads every one personally — you’ll hear back by email.'; }
  catch (err) { msg.textContent = failMsg(err); }
  btn.disabled = false;
});
}
