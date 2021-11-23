const CACHE_NAME = 'my-site-cache-v3';
const CACHE_NAME_STATIC = 'bit-static';
const BASE_URL = '/sw-test/'
const preCache = [
    '',
    'index.html',
    //'lib.min.js',
    'chunks/gui.js',
    'script/main.js',
];

self.addEventListener('install', function (event) {
    console.log('sw.js install');
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(preCache.map(file => `${BASE_URL}${file}`))
                    .then(()=> {
                        console.log('cache lib.min.js');
                        return cache.add(`${BASE_URL}lib.min.js`);
                    });
            })
    );
});
self.addEventListener('activate', function (event) {
    var cacheKeeplist = [CACHE_NAME, CACHE_NAME_STATIC];

    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log(`Going to delete ${key}.`);
                    return caches.delete(key);
                }
            }));
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