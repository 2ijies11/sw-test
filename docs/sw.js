const CACHE_NAME = 'my-site-cache-v1';
const BASE_URL = '/sw-test/docs/'
const preCache = [
    '',
    'index.html',
    'script/main.js',
];

self.addEventListener('install', function (event) {
    console.log('sw.js install');
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(preCache.map(file => `${BASE_URL}${file}`));
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});