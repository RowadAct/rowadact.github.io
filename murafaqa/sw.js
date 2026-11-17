/* رواد المرافقة: عامل خدمة يجعل التطبيق قابلًا للتثبيت، ويعرض صفحة لطيفة بلا إنترنت، ويستقبل الإشعارات (17 نوفمبر). */
var C = 'rm-v2';
var FILES = ['/murafaqa/', '/murafaqa/offline.html', '/murafaqa/icon-192.png'];
var FB = {apiKey:'AIzaSyCgTIC60J0y-Hmyw0tn-bDIokDO75QN5wI',authDomain:'rowad-murafaqa.firebaseapp.com',projectId:'rowad-murafaqa',messagingSenderId:'936010177958',appId:'1:936010177958:web:96074957d7d4c01b590367'};
try {
  if (FB.apiKey) {
    importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js', 'https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');
    firebase.initializeApp(FB);
    firebase.messaging();
  }
} catch (e) { /* بلا إشعارات */ }
self.addEventListener('install', function (e) { e.waitUntil(caches.open(C).then(function (c) { return c.addAll(FILES); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== C; }).map(function (k) { return caches.delete(k); })); })); self.clients.claim(); });
self.addEventListener('fetch', function (e) {
  if (e.request.mode !== 'navigate') { return; }
  e.respondWith(fetch(e.request).catch(function () { return caches.match('/murafaqa/offline.html'); }));
});
/* الضغط على الإشعار: يفتح التطبيق إن كان مفتوحًا، وإلا يفتحه. */
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && (e.notification.data.FCM_MSG && e.notification.data.FCM_MSG.data && e.notification.data.FCM_MSG.data.link)) || '/murafaqa/';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if (cs[i].url.indexOf('/murafaqa/') > -1 && 'focus' in cs[i]) { return cs[i].focus(); } }
    return self.clients.openWindow(url);
  }));
});
