// Workbox modules
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
// indexedDB modules
// import { openDB } from 'idb';
import { createDB } from './idb-control';
import { precacheAndRoute } from 'workbox-precaching';


// openning indexedDB
self.addEventListener('install', async (e) => {
   self.skipWaiting();  

   // openning the 'indexedDB' database
   // e.waitUntil(
   //    // createDB()
   // //    // openDB('twitter', 1, {
   // //    //    upgrade(db, oldVersion, newVersion, transaction) {
   // //    //       console.log(db, oldVersion, newVersion, transaction)
   // //    //       window.db = db;
   // //    //       const usersStore = db.createObjectStore('accounts', {keyPath: 'id', autoIncrement: true})
   // //    //       const tweetsStore = db.createObjectStore('tweets', {keyPath: 'id', autoIncrement: true})
   // //    //    }
         
   // //    // })
   // )
})


self.addEventListener("activate", event => {
   event.waitUntil(
      clients.claim()
   );
});



// precaching assets
// Function to filter out images and videos from precaching
const filterAssets = (manifest) => {
   return manifest.filter(({ url }) => {
      // Exclude images and videos except for 'offline.png'
      return !/\.(?:png|jpg|jpeg|gif|svg|mp4|webm|ogg|avi|mov)$/i.test(url);
   });
};

// automatically added assets(filters images/videos)
const filteredManifest = filterAssets(self.__WB_MANIFEST || []);

// Manually added assets:
const customManifest = [
    { url: '/assets/images/offline.png', revision: null },  // we set revision=null, because we want to use them later in this 'sw.js', and we actually dont need revision for such images
    { url: '/assets/images/not-found.png', revision: null },
];


const finalManifest = [...filteredManifest, ...customManifest];  // automatic-manifest + custom-manifest

precacheAndRoute(finalManifest);




// serving assets
// offline fallback
setCatchHandler( ({url, event, params}) => {
   const destination = event.request.destination;
   
   if (destination === 'document') {
      return caches.match('/offline.html') || Response.error();
   } else if (destination === 'image') {
      return caches.match('/dist/assets/images/offline.png') || Response.error();
   }

   return Response.error();

})

// routes - strategies
const pagesStrategy = new StaleWhileRevalidate({
   cacheName: 'pages',
   plugins: [
      new CacheableResponsePlugin({
         statuses: [200],
      })
   ]
})

const stylesStrategy = new StaleWhileRevalidate({
   cacheName: 'styles',
   plugins: [
      new CacheableResponsePlugin({
         statuses: [200],
      })  
   ]
})

const scriptsStrategy = new StaleWhileRevalidate({
   cacheName: 'scripts',
   plugins: [
      new CacheableResponsePlugin({
         statuses: [200],
      })  
   ]
})

const imagesStrategy = new CacheFirst({
   cacheName: 'images',
   plugins: [
      new CacheableResponsePlugin({
         statuses: [200],
      }),
      {
         // for non-existing images
         fetchDidSucceed: async ({ request, response }) => {
            if (response.status === 404) {  // so the image is not exist
               console.log('Image not found, returning fallback:', request.url);
               const fallbackResponse = await caches.match('/dist/assets/images/not-found.png');
               return fallbackResponse || response;
           }
            return response;
         },
     },  
   ]
})

const videosStrategy = new CacheFirst({
   cacheName: 'videos',
   plugins: [
      new CacheableResponsePlugin({
         statuses: [200],
      })  
   ]
})


registerRoute( ({request}) => request.mode === 'navigate',
   pagesStrategy
)

registerRoute( ({request}) => request.destination === 'style',
   stylesStrategy
)

registerRoute( ({request}) => request.destination === 'script',
   scriptsStrategy
)

registerRoute( ({request}) => request.destination === 'image',
   imagesStrategy
)

registerRoute( ({request}) => request.destination === 'video',
   videosStrategy
)



