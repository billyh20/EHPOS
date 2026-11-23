const V = 'eh-pos-v8';   // เปลี่ยนเลขนี้ทุกครั้งที่อัปโหลดหน้าเว็บชุดใหม่
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  './fonts/prompt-thai-500-normal.woff2', './fonts/prompt-thai-700-normal.woff2', './fonts/prompt-thai-800-normal.woff2',
  './fonts/prompt-latin-500-normal.woff2', './fonts/prompt-latin-700-normal.woff2', './fonts/prompt-latin-800-normal.woff2'];
// ติดตั้ง: แคชทีละไฟล์ ไฟล์ไหนหายไม่ทำให้ทั้งแอปติดตั้งออฟไลน์ไม่ได้ (เดิม addAll ล้มทั้งชุด)
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(ASSETS.map(a => c.add(new Request(a, { cache: 'reload' })).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
// หน้าเว็บ: ลองเน็ตก่อน (ได้เวอร์ชันใหม่เสมอ) ถ้าไม่มีเน็ตใช้ของที่แคชไว้ — ไม่แตะคำขอไป Apps Script (คนละ origin)
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => {
      if (res && res.ok && res.type === 'basic') { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }   // ไม่แคชหน้า 404/500
      return res;
    }).catch(() => caches.match(r, { ignoreSearch: true }).then(m => m || (r.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
  );
});
