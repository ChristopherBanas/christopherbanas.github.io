'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "43fc1c4591bd97bec5ba3498889532ed",
"splash/style.css": "13bfafe90a8e21782f8a686e4dddf901",
"favicon.ico": "5ca6dc4d4c70340fa2bb5dabb6d5dea9",
"index.html": "5ff2c36e5d3baf197e012d03913da671",
"/": "5ff2c36e5d3baf197e012d03913da671",
"main.dart.js": "0ab3648b63ad524438e61b2cb6723622",
"icons/Icon-192.png": "17754c5bc8e62f80c38a8ac9eb893449",
"icons/Icon-512.png": "5f5ccc05fb77a47e8ab079d71973f8a2",
"manifest.json": "c5af8243754cfb18ba6018091a8eea06",
"assets/AssetManifest.json": "43e79692edf3f2eadd7f1da82d07067c",
"assets/NOTICES": "cb8ea03dd876c46122f840bd4cf2462d",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/assets/images/secondary_logo.png": "7e03f43aaf88c525b6bc38489930f8bf",
"assets/assets/images/rockets.jpg": "f23cd4f9e799259fbfd91eae7894c965",
"assets/assets/images/timberwolves.jpg": "02bb040ef292f2da04925c654d903187",
"assets/assets/images/thunder.jpg": "ad242fe0b453b38acf4d7e5c4cfe9735",
"assets/assets/images/raptors.jpg": "ec78bfff88010dd2342aab8e017a280b",
"assets/assets/images/clippers.jpg": "a76e988cee53f04455205fe6713119c5",
"assets/assets/images/mavericks.jpg": "db7a517215ed9f2dd00ca5804b6e6189",
"assets/assets/images/kings.jpg": "1f4ac3c1d673466135d4d181dafb2ba2",
"assets/assets/images/lakers.jpg": "3017aab11f068a3353d595cffbc05c70",
"assets/assets/images/bulls.jpg": "8548875b75868e08b36404bbc788e26b",
"assets/assets/images/suns.jpg": "994de2f7d1e1b7f0dd0ad7e501df37fe",
"assets/assets/images/hawks.jpeg": "6098910e327578d500efe424a8050b42",
"assets/assets/images/wizards.jpg": "75552eebd521f5fb92c82a976db794e8",
"assets/assets/images/spurs.jpeg": "60019549ba05e57b1d17d38e52065ce9",
"assets/assets/images/blazers.jpg": "6745e178f3b3e8fc30c75efd9492e5ad",
"assets/assets/images/warriors.jpg": "8cb843f25244991427cbbd9591a4eef6",
"assets/assets/images/heat.jpg": "091931cc088346f11df39d8d20563ef0",
"assets/assets/images/bucks.jpg": "9bfff658b781aec9e004841e959a5a76",
"assets/assets/images/nuggets.jpg": "abda63083d3dfb4ed8abb146549b18d1",
"assets/assets/images/knicks.jpg": "13a0284948900f33d725419b13f490e3",
"assets/assets/images/cavs.jpg": "f438282e5c8fdaa90387e1ad6d5a2ced",
"assets/assets/images/sixers.jpg": "8a8f4a6bc0e1649d1f92ea262edb5fbf",
"assets/assets/images/logo.png": "d3999e8200e356173f737e32f958737b",
"assets/assets/images/pacers.jpg": "3ecdc83f871b41083e0e9d9baad4f0e4",
"assets/assets/images/jazz.jpg": "9d752038c4b6f635fb4e6a18ca40bb1d",
"assets/assets/images/hornets.jpg": "72356da2b727cd455d820846a257327a",
"assets/assets/images/grizzlies.jpg": "959d73ee7572c4e8d63f5a08c745c50a",
"assets/assets/images/magic.jpg": "05df69acb7aaf529ef892b7dea858834",
"assets/assets/images/pelicans.jpg": "90bb9be572f9eacdede7527643a6c475",
"assets/assets/images/celtics.jpg": "de6dff1585744cbe1a9f063c54f14aaf",
"assets/assets/images/nets.jpg": "a5b81f2fbadab938899c08e8f47f60aa",
"assets/assets/images/pistons.jpg": "7680720a4573de7aae402c2ff29d9475"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
