/* رواد المرافقة: عامل خدمة بسيط يجعل التطبيق قابلًا للتثبيت ويعرض صفحة لطيفة بلا إنترنت. */
var C = 'rm-v1';
var FILES = ['/murafaqa/', '/murafaqa/offline.html', '/murafaqa/icon-192.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(FILES); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); })); })); self.clients.claim(); });
self.addEventListener('fetch', function (e) {
  if (e.request.mode !== 'navigate') { return; }
  e.respondWith(fetch(e.request).catch(function () { return caches.match('/murafaqa/offline.html'); }));
});
