const V = 'eh-pos-v4';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  './fonts/prompt-thai-500-normal.woff2', './fonts/prompt-thai-700-normal.woff2', './fonts/prompt-thai-800-normal.woff2',
  './fonts/prompt-latin-500-normal.woff2', './fonts/prompt-latin-700-normal.woff2', './fonts/prompt-latin-800-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// หน้าเว็บ: ลองเน็ตก่อน (ได้เวอร์ชันใหม่เสมอ) ถ้าไม่มีเน็ตใช้ของที่แคชไว้ — ไม่แตะคำขอไป Apps Script
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; }).catch(() => caches.match(r).then(m => m || caches.match('./index.html'))));
});
