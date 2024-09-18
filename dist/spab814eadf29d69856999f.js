/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/home.js":
/*!*********************!*\
  !*** ./src/home.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   init: () => (/* binding */ init)\n/* harmony export */ });\n// Elements\n\n\nconst init = function() {\n   // control header quiet-mode (navbars go away to leave more space to see tweets, when user scrolls down)\n   const header = document.querySelector('header');\n   let lastScrollY = 0;\n   window.addEventListener('scroll', e => {\n      if (document.scrollingElement !== document.documentElement) return;\n      \n      if (window.scrollY >= 400 && !header.classList.contains('quiet')) {\n         header.classList.add('quiet');\n         lastScrollY = window.scrollY;\n         return;\n      }\n      \n      if (header.classList.contains('quiet') && ((window.scrollY - lastScrollY) < 0) ) {\n         header.classList.remove('quiet');\n         lastScrollY = window.scrollY;\n         return;  \n      }\n\n   })\n}\n\n//# sourceURL=webpack://orion/./src/home.js?");

/***/ }),

/***/ "./src/idb-control.js":
/*!****************************!*\
  !*** ./src/idb-control.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addAccountToDB: () => (/* binding */ addAccountToDB),\n/* harmony export */   addPostToDB: () => (/* binding */ addPostToDB),\n/* harmony export */   createDB: () => (/* binding */ createDB),\n/* harmony export */   deleteAccountFromDB: () => (/* binding */ deleteAccountFromDB),\n/* harmony export */   deletePostFromDB: () => (/* binding */ deletePostFromDB),\n/* harmony export */   getAccountFromDB: () => (/* binding */ getAccountFromDB),\n/* harmony export */   getDB: () => (/* binding */ getDB),\n/* harmony export */   getPostFromDB: () => (/* binding */ getPostFromDB)\n/* harmony export */ });\n/* harmony import */ var idb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! idb */ \"./node_modules/idb/build/index.js\");\n\n\nlet db;\nlet dbPromise;\n\nfunction getDB() {\n   return dbPromise ? Promise.resolve(dbPromise) : Promise.reject(\"Database not initialized\");\n   // console.log(db);\n   // return db;\n}\n\nasync function createDB() {\n   dbPromise = (0,idb__WEBPACK_IMPORTED_MODULE_0__.openDB)('twitter', 1, {\n      upgrade(db, oldVersion, newVersion, tx) {\n         if (!db.objectStoreNames.contains('accounts')) {\n            const accountsObjectStore = db.createObjectStore('accounts', {keyPath: 'id', autoIncrement: true});\n         }\n         if (!db.objectStoreNames.contains('tweets')) {\n            const tweetsObjectStore = db.createObjectStore('tweets', {keyPath: 'id', autoIncrement: true});\n            tweetsObjectStore.createIndex('post_id', 'post_id');\n         }\n         // switch(oldVersion) {\n         //    case 0:\n         // }\n      }\n   })\n   db = await dbPromise;\n   console.log(dbPromise);\n   return dbPromise;\n}\n\n// account controls\nasync function addAccountToDB(account) {\n   const tx = await window.db.transaction('accounts', 'readwrite');\n   const accounts = tx.objectStores('accounts');\n   accounts.add(account);\n   await tx.done;\n}\n\nasync function getAccountFromDB(postId=null) {\n   // const tx = await db.transaction('tweets', 'readwrite');\n   // const tweets = tx.objectStores('tweets');\n   // tweets.add(post);\n   // await tx.done;\n}\n\nasync function deleteAccountFromDB(postId) {\n   // const tx = await db.transaction('tweets', 'readwrite');\n   // const tweets = tx.objectStores('tweets');\n   // tweets.add(post);\n   // await tx.done;\n}\n\n// post(tweets) controls\nasync function addPostToDB(post) {\n   const tx = db.transaction('tweets', 'readwrite');\n   const tweets = tx.objectStore('tweets');\n   tweets.put(post);\n   await tx.done;\n}\n\nasync function getPostFromDB(postId=null) {\n   const tx = db.transaction('tweets', 'readwrite');\n   const tweets = tx.objectStore('tweets');\n   let result;\n   if (postId === null) {\n      result = await tweets.getAll();     \n   } else {\n      const postIdIndex = tweets.index('post_id');\n      result = await postIdIndex.get(postId);\n   }\n   await tx.done;\n   return result;\n}\n\nasync function deletePostFromDB(postId) {\n   const tx = db.transaction('tweets', 'readwrite');\n   const tweets = tx.objectStore('tweets');\n   const postIdIndex = tweets.index('post_id');\n\n   let record = await postIdIndex.get(postId);\n   let result = tweets.delete(record.id);\n\n   await tx.done;\n   return result;\n}\n\n\n\n//# sourceURL=webpack://orion/./src/idb-control.js?");

/***/ }),

/***/ "./src/loadPosts.js":
/*!**************************!*\
  !*** ./src/loadPosts.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadPosts: () => (/* binding */ loadPosts)\n/* harmony export */ });\n/* harmony import */ var _idb_control__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./idb-control */ \"./src/idb-control.js\");\n\n\nfunction loadPosts(area='feed', id=null) {  // area: (feed, user-panel, comments, ...) | id: if we loading page of a 'psot, we pass its id, to load its data in post page'\n   if (area === 'feed') {\n      renderFeedPosts();\n      return;\n   }\n   if (area === 'user-panel') {\n      renderUserPosts();\n      return;\n   }\n   if (area === 'post') {\n      const strPostObject = localStorage.getItem('current_post');  // for now that we haven't back end API\n      renderPostPage( JSON.parse(strPostObject) );  // sending post-data(instead of backend-fetch), to render it\n      return;\n   }\n}\n\nasync function renderUserPosts() {\n   const userPostsCont = document.querySelector('.main__posts-cont');\n   const posts = await (0,_idb_control__WEBPACK_IMPORTED_MODULE_0__.getPostFromDB)();\n   if (!posts.length) {  // so we should fetch user-posts from server (needs backend API so we now dont use it)\n      /* get posts from server */\n   } else {\n      posts.forEach(async (post) => {\n         const author = await fetch('user.json').then(res => res.json());  // this should be handled by backend-API(by passing user id)\n         const userTweetEl = createPostEl(author, post);\n         userTweetEl.classList.add('user-post');\n         userPostsCont.prepend(userTweetEl);\n      })\n   }\n}\n\nasync function renderPostPage(curntPost) {\n   // the post itself\n   const mainPostContEl = document.querySelector('.main__post-cont');\n   const author = await fetch('user.json').then(res => res.json());  // for now that we haven't back end API, actually it can be gotten by 'curntPost.author_id'\n\n   const curntPostEl = createPostEl(author, curntPost);\n   curntPostEl.classList.add('focused');\n   mainPostContEl.append(curntPostEl);\n\n   // comments:  loading comments is done, by giving 'curntPost.comments_ids' to 'backend API', so for now, we havent backend API, so we load the from a json file(as placeholder)\n   const commentsContEl = document.querySelector('.main__comments-cont');\n   const commentPosts = await fetch('comments.json').then(res => res.json());\n   // const commentPosts = await loadComments();\n\n   [...commentPosts].forEach(async (post) => {\n      const author = await fetch('user.json').then(res => res.json());  // this should be handled by backend-API(by passing user id)\n      const userTweetEl = createPostEl(author, post);\n      commentsContEl.prepend(userTweetEl);\n   })\n}\n\n\nasync function loadFeedPosts( kind=\"foryou\" ) {  // kind: foryou/following\n   try {\n      const res = await fetch('tweets.json');\n      if (res.ok) {\n         return await res.json();\n      } else {\n         throw new Error('Error fetching posts - status: ' + res.status);\n      }\n   } catch (error) {\n      console.warn(error);\n   }\n}\n\nasync function renderFeedPosts() {\n   const postsCont = document.querySelector('.main__posts-cont');\n   const posts = await loadFeedPosts();  // Array of posts(feed/global)\n\n   [...posts].forEach(async (post) => {\n      const author = await fetch('user.json').then(res => res.json());  // this should be handled by backend-API(by passing user id)\n      const userTweetEl = createPostEl(author, post);\n      postsCont.prepend(userTweetEl);\n   })\n}\n\n// cretaes <user-tweet> (and sets all of its info-attributes), and returns it\nfunction createPostEl(authorObj, postObj) {\n   const { avatar, name, username } = authorObj;\n   const { post_id, referred_id, posting_date, content, media_srcs, comments_ids, comments_count, reposts_count, likes_count, view_count } = postObj;\n\n   const userTweetEl = document.createElement('user-tweet');\n   userTweetEl.setAttribute('data-post-id', post_id);\n   userTweetEl.setAttribute('data-author-avatar', avatar);\n   userTweetEl.setAttribute('data-author-username', name);\n   userTweetEl.setAttribute('data-author-id', username);\n   userTweetEl.setAttribute('data-referred-id', referred_id);\n   userTweetEl.setAttribute('data-datetime', posting_date);\n   userTweetEl.setAttribute('data-content', content);\n   userTweetEl.setAttribute('data-media-srcs', (typeof media_srcs != 'string') ? JSON.stringify(media_srcs) : media_srcs);   // Array of srcs\n   userTweetEl.setAttribute('data-comments-ids', (typeof comments_ids != 'string') ? JSON.stringify(comments_ids) : comments_ids);  // Array of comments-id s\n   userTweetEl.setAttribute('data-comments-count', comments_count);\n   userTweetEl.setAttribute('data-reposts-count', reposts_count);\n   userTweetEl.setAttribute('data-likes-count', likes_count);\n   userTweetEl.setAttribute('data-view-count', view_count);\n\n   return userTweetEl;\n}\n\n//# sourceURL=webpack://orion/./src/loadPosts.js?");

/***/ }),

/***/ "./src/loadcomponents.js":
/*!*******************************!*\
  !*** ./src/loadcomponents.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst loadComponents = async () => {\n   const componentsSrcs = [\n      './components/user-tweet/user-tweet.js'\n   ];\n\n   componentsSrcs.map(src => {\n      const script = document.createElement('script');\n      script.src = src;\n      script.type = \"module\";\n\n      document.head.append(script);\n   })\n}\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (loadComponents);\n\n//# sourceURL=webpack://orion/./src/loadcomponents.js?");

/***/ }),

/***/ "./src/router.js":
/*!***********************!*\
  !*** ./src/router.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst router = {\n   \"/\": {\n      template: \"pages/home.html\",\n      stylesheet: \"styles/home.css\",\n      scripts: [],\n      handlerName: \"handleHomePage\"\n   },\n   \"/home\": {\n      template: \"pages/home.html\",\n      stylesheet: \"styles/home.css\",\n      scripts: [],\n      handlerName: \"handleHomePage\"\n   },\n   \"/index.html\": {\n      template: \"pages/home.html\",\n      stylesheet: \"styles/home.css\",\n      scripts: [],\n      handlerName: \"handleHomePage\"\n   },\n   \"/user-panel\": {\n      template: \"pages/user-panel.html\",\n      stylesheet: \"styles/user-panel.css\",\n      scripts: [],\n      handlerName: \"handleUserPanelPage\"\n   },\n   \"/write-post\": {\n      template: \"pages/write-post.html\",\n      stylesheet: \"styles/write-post.css\",\n      scripts: [],\n      handlerName: \"handleWritePostPage\"\n   },\n   \"/post\": {\n      template: \"pages/post.html\",\n      stylesheet: \"styles/post.css\",\n      scripts: [],\n      handlerName: \"handlePostPage\"\n   },\n};\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (router);\n\n//# sourceURL=webpack://orion/./src/router.js?");

/***/ }),

/***/ "./src/spa.js":
/*!********************!*\
  !*** ./src/spa.js ***!
  \********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./router */ \"./src/router.js\");\n/* harmony import */ var _loadcomponents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./loadcomponents */ \"./src/loadcomponents.js\");\n/* harmony import */ var _loadPosts__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./loadPosts */ \"./src/loadPosts.js\");\n/* harmony import */ var _home__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./home */ \"./src/home.js\");\n/* harmony import */ var _user_panel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./user-panel */ \"./src/user-panel.js\");\n/* harmony import */ var _write_post__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./write-post */ \"./src/write-post.js\");\n/* harmony import */ var _idb_control__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./idb-control */ \"./src/idb-control.js\");\n\n\n\n\n\n\n\n\n\n// define all web-components\nawait (0,_loadcomponents__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n\n// Elements\nconst root = document.getElementById('root');\n\n\n// current-user\nlet curntUser;\nlet curntUserPostsCount = 0;\n\n(\n   async () => {\n      curntUser = await fetch('user.json');\n      curntUserPostsCount = +curntUser.posts_count;\n   }\n)()\n\n\n// creating indexedDB\nlet db;\n(\n   async() => {\n      db = await (0,_idb_control__WEBPACK_IMPORTED_MODULE_6__.createDB)();\n      console.log(db);\n   }\n)();\n\n// different pages sscripts:\nconst page = {\n   // home\n   handleHomePage() {\n      console.log('home');\n      (0,_home__WEBPACK_IMPORTED_MODULE_3__.init)();\n      (0,_loadPosts__WEBPACK_IMPORTED_MODULE_2__.loadPosts)('feed');\n   },\n   // user-panel\n   handleUserPanelPage() {\n      console.log('user panel');\n      (0,_user_panel__WEBPACK_IMPORTED_MODULE_4__.renderUserInfo)();\n   },\n   // post\n   handlePostPage() {\n      (0,_loadPosts__WEBPACK_IMPORTED_MODULE_2__.loadPosts)('post', +location.search.slice( location.search.indexOf('p=') + 2 ));\n   },\n   // write-post\n   handleWritePostPage() {\n      (0,_write_post__WEBPACK_IMPORTED_MODULE_5__.init)(db, curntUserPostsCount);\n   }\n}\n\n\n// SPA logic\n// handling nav-links:\n// prevent default navigation links\nconst attachNavigationEventListener = () => {\n   document.addEventListener('DOMContentLoaded', e => {\n      console.log('loaded DOM')\n      document.addEventListener('click', e => {\n         const {target} = e;\n         if (!target.matches('[data-navlink]')) return;\n         e.preventDefault();\n         e.stopPropagation();\n         navigate(target.href);\n      })\n   })\n}\nattachNavigationEventListener();\n\n\n// state management\nwindow.addEventListener('popstate', e => {\n   render();\n})\n\nconst navigate = (url) => {\n   if (location.href.endsWith(url)) return; // so we are already in that page\n\n   history.pushState( {}, '',  url );\n   render();\n}\n\nconst render = async () => {\n   const path = location.pathname;\n   // const state = path.slice( path.indexOf('/dist') + ('/dist').length );\n\n\n   const route = _router__WEBPACK_IMPORTED_MODULE_0__[\"default\"][path];\n\n   if (!route) {\n      root.innerHTML = `<h1>404 -- Not Found</h1>`;\n      return;\n   }\n\n   const { template, stylesheet, scripts, handlerName } = route;\n\n   try {\n      const html = await fetch(template).then(res => res.text());\n\n      root.innerHTML = html;\n\n      loadStyles(stylesheet);\n\n      page[handlerName]();\n\n      // loadScripts(scripts);\n   } catch (error) {\n      console.warn('Error - loading template' , error);  \n      root.innerHTML = '<h1>Error loading page</h1>';\n   }\n\n   function loadStyles(stylesheet) {\n      let exists = false;\n      // clearing prev pages stylesheets\n      document.querySelectorAll('link').forEach(link => {\n         if (link.rel === 'stylesheet' && link.href !== stylesheet && !link.href.includes('index') ) {\n            link.remove();\n         }\n         if (link.href === stylesheet) {\n            exists = true;\n         }\n      })\n      // adding new stylesheet\n      if (!exists) {\n         const link = document.createElement('link');\n         link.rel = 'stylesheet';\n         link.href = stylesheet;\n         document.head.append(link);\n      }\n   }\n\n   function loadScripts(scripts) {\n      // clearing prev-page scripts\n      document.querySelectorAll('script').forEach(script => {\n         if ( script.src && !script.src.includes('index') && !script.src.includes('spa') ) {\n            script.remove();\n         }\n      })\n\n      // adding new scripts\n      scripts.forEach(scriptSrc => {\n         const scriptEl = document.createElement('script');\n         // scriptEl.type = 'module';\n         scriptEl.async = false;\n         scriptEl.defer = true;\n\n         scriptEl.src = scriptSrc;\n         document.head.append(scriptEl);\n      })\n   }\n}\n\nrender();\n\n/* navigate to post-page by clicking on it */\ndocument.addEventListener('navigate-to-post', e => {\n   const {id} = e.detail;    // id of post(to load its data from API)\n   const postEl = e.target;  // post Elelement (<user-tweet>)\n   const postObject = {  // we extract post-info from its attributes, to send them to 'post-page' (save to localStorage, and retrieve it there), to load there (because for now we haven't backend API)\n      id: id,\n      author_id: postEl.dataset.authorId,\n      referred_id: postEl.dataset.referredId,\n      content: postEl.dataset.content,\n      media_srcs: postEl.dataset.mediaSrcs,\n      comments_ids: postEl.dataset.commentsIds,\n      posting_date: postEl.dataset.datetime,\n      comments_count: postEl.dataset.commentsCount,\n      reposts_count: postEl.dataset.repostsCount,\n      likes_count: postEl.dataset.likesCount,\n      view_count: postEl.dataset.viewCount,\n   }\n   localStorage.setItem( 'current_post', JSON.stringify(postObject) );\n   navigate( `/post?p=${id}` );\n})\n\n/* navigate to user-page by clicking on post's author-link */\ndocument.addEventListener('navigate-to-user-panel', e => {\n   const {id} = e.detail;    // id of post(to load its data from API)\n   navigate( `/user-panel?p=${id}` );\n})\n\n/* deleting user-pos by clicking 'delete post' */\ndocument.addEventListener('delete-post', e => {\n   const {postId} = e.detail;    // id of post(to load its data from API)\n   console.log(postId);\n   (0,_idb_control__WEBPACK_IMPORTED_MODULE_6__.deletePostFromDB)(postId);\n   document.querySelector(`user-tweet[data-post-id=\"${postId}\"]`).remove();\n})\n\n\n\n\n\n\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } }, 1);\n\n//# sourceURL=webpack://orion/./src/spa.js?");

/***/ }),

/***/ "./src/user-panel.js":
/*!***************************!*\
  !*** ./src/user-panel.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   loadUserInfo: () => (/* binding */ loadUserInfo),\n/* harmony export */   renderUserInfo: () => (/* binding */ renderUserInfo)\n/* harmony export */ });\n/* harmony import */ var _loadPosts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loadPosts */ \"./src/loadPosts.js\");\n\n\nasync function loadUserInfo(url) {\n   try {\n      const res = await fetch(url);  // can be replaced by backend-API\n      if (res.ok) {\n         return await res.json();  \n      } else {\n         throw new Error('Error fetching user -- status: ' + res.status);\n      }\n   } catch (error) {\n      console.warn(error); \n   }\n}\n\nasync function renderUserInfo() {\n   const userData = await loadUserInfo('user.json');\n   const { username, name, avatar, header, bio, user_location, join_date, followings_count, followers_count, posts_count } = userData;\n   \n   document.querySelector('.header__top-nav__user-info__username').innerText = name;\n   document.querySelector('.header__top-nav__user-info__posts-count__num').innerText = posts_count;\n\n   document.querySelector('.main__user-info__inner__header-img-cont__img').src = header;\n   document.querySelector('.main__user-info__inner__info__avatar-cont__img-cont__img').src = avatar;\n   document.querySelector('.main__user-info__inner__info__username-cont__username').innerText = name;\n   document.querySelector('.main__user-info__inner__info__username-cont__id').innerText = username;\n   document.querySelector('.main__user-info__inner__info__bio-cont__bio').innerText = bio;\n   document.querySelector('.main__user-info__inner__info__location-join-cont__location__text').innerText = user_location;\n   document.querySelector('.main__user-info__inner__info__location-join-cont__join-date').innerText = join_date;\n   document.querySelector('.main__user-info__inner__info__follow-cont__following-cont__count').innerText = followings_count;\n   document.querySelector('.main__user-info__inner__info__follow-cont__follower-cont__count').innerText = followers_count;\n\n   (0,_loadPosts__WEBPACK_IMPORTED_MODULE_0__.loadPosts)('user-panel');\n}\n\n\n//# sourceURL=webpack://orion/./src/user-panel.js?");

/***/ }),

/***/ "./src/write-post.js":
/*!***************************!*\
  !*** ./src/write-post.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   init: () => (/* binding */ init),\n/* harmony export */   publishPost: () => (/* binding */ publishPost),\n/* harmony export */   sendPostToServer: () => (/* binding */ sendPostToServer)\n/* harmony export */ });\n/* harmony import */ var _idb_control__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./idb-control */ \"./src/idb-control.js\");\n\n\nlet attachedMedias;\n\nlet db;\nlet postsCont = 0;\n\nasync function init(pdb, userPostsCont=0) {\n   db = pdb;\n   postsCont = userPostsCont\n\n   attachedMedias = new Set();\n\n   document.querySelectorAll('textarea').forEach(ta => {\n      ta.value = \"\";\n      \n      ta.addEventListener('input', function () {\n         this.style.height = 'auto'; // Reset height\n         this.style.height = this.scrollHeight + 'px'; // Set height to scrollHeight(so it will extend vertically without any scrolling)\n       \n         if (ta.value.length > 0) {\n            document.querySelector('.post-btn').disabled = false;\n         } else {\n            document.querySelector('.post-btn').disabled = true;\n         }\n      });\n   })\n   \n   document.addEventListener('click', e => {\n      if (e.target.closest('.post-btn')) {\n         publishPost();\n         document.querySelector('textarea').value = \"\";\n         document.querySelector('.header__top-nav__row--user-home-links__back-home-link').click();\n      }\n   })\n}\n\nfunction publishPost() {\n   const postObject = {\n      post_id: postsCont ? postsCont - 1 : 0,\n      author_id: '@parsa04',   // should be set dynamically based on current-user \n      referred_id: null,\n      content: document.querySelector('.post-content__context__form__inp').value,\n      media_srcs: Array.from( attachedMedias ),\n      comments_ids: [],\n      posting_date: new Date().toISOString(),\n      comments_count: 0,\n      reposts_count: 0,\n      likes_count: 0,\n      view_count: 0,\n   };\n\n   sendPostToServer( JSON.stringify(postObject) );\n   savePostToIDB( postObject );\n}\n\nasync function sendPostToServer( postStr ) {\n   /* needs backend API */\n   /* Fetch/XHR POST request */\n}\n\n// indexedDB controls\n// let idb;\nasync function openDatabase() {\n   idb = await idb.open.open('twitter', 1, {})\n}\n\nasync function savePostToIDB( postStr ) {\n   await (0,_idb_control__WEBPACK_IMPORTED_MODULE_0__.addPostToDB)(postStr);\n}\n\n//# sourceURL=webpack://orion/./src/write-post.js?");

/***/ }),

/***/ "./node_modules/idb/build/index.js":
/*!*****************************************!*\
  !*** ./node_modules/idb/build/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   deleteDB: () => (/* binding */ deleteDB),\n/* harmony export */   openDB: () => (/* binding */ openDB),\n/* harmony export */   unwrap: () => (/* binding */ unwrap),\n/* harmony export */   wrap: () => (/* binding */ wrap)\n/* harmony export */ });\nconst instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);\n\nlet idbProxyableTypes;\nlet cursorAdvanceMethods;\n// This is a function to prevent it throwing up in node environments.\nfunction getIdbProxyableTypes() {\n    return (idbProxyableTypes ||\n        (idbProxyableTypes = [\n            IDBDatabase,\n            IDBObjectStore,\n            IDBIndex,\n            IDBCursor,\n            IDBTransaction,\n        ]));\n}\n// This is a function to prevent it throwing up in node environments.\nfunction getCursorAdvanceMethods() {\n    return (cursorAdvanceMethods ||\n        (cursorAdvanceMethods = [\n            IDBCursor.prototype.advance,\n            IDBCursor.prototype.continue,\n            IDBCursor.prototype.continuePrimaryKey,\n        ]));\n}\nconst transactionDoneMap = new WeakMap();\nconst transformCache = new WeakMap();\nconst reverseTransformCache = new WeakMap();\nfunction promisifyRequest(request) {\n    const promise = new Promise((resolve, reject) => {\n        const unlisten = () => {\n            request.removeEventListener('success', success);\n            request.removeEventListener('error', error);\n        };\n        const success = () => {\n            resolve(wrap(request.result));\n            unlisten();\n        };\n        const error = () => {\n            reject(request.error);\n            unlisten();\n        };\n        request.addEventListener('success', success);\n        request.addEventListener('error', error);\n    });\n    // This mapping exists in reverseTransformCache but doesn't doesn't exist in transformCache. This\n    // is because we create many promises from a single IDBRequest.\n    reverseTransformCache.set(promise, request);\n    return promise;\n}\nfunction cacheDonePromiseForTransaction(tx) {\n    // Early bail if we've already created a done promise for this transaction.\n    if (transactionDoneMap.has(tx))\n        return;\n    const done = new Promise((resolve, reject) => {\n        const unlisten = () => {\n            tx.removeEventListener('complete', complete);\n            tx.removeEventListener('error', error);\n            tx.removeEventListener('abort', error);\n        };\n        const complete = () => {\n            resolve();\n            unlisten();\n        };\n        const error = () => {\n            reject(tx.error || new DOMException('AbortError', 'AbortError'));\n            unlisten();\n        };\n        tx.addEventListener('complete', complete);\n        tx.addEventListener('error', error);\n        tx.addEventListener('abort', error);\n    });\n    // Cache it for later retrieval.\n    transactionDoneMap.set(tx, done);\n}\nlet idbProxyTraps = {\n    get(target, prop, receiver) {\n        if (target instanceof IDBTransaction) {\n            // Special handling for transaction.done.\n            if (prop === 'done')\n                return transactionDoneMap.get(target);\n            // Make tx.store return the only store in the transaction, or undefined if there are many.\n            if (prop === 'store') {\n                return receiver.objectStoreNames[1]\n                    ? undefined\n                    : receiver.objectStore(receiver.objectStoreNames[0]);\n            }\n        }\n        // Else transform whatever we get back.\n        return wrap(target[prop]);\n    },\n    set(target, prop, value) {\n        target[prop] = value;\n        return true;\n    },\n    has(target, prop) {\n        if (target instanceof IDBTransaction &&\n            (prop === 'done' || prop === 'store')) {\n            return true;\n        }\n        return prop in target;\n    },\n};\nfunction replaceTraps(callback) {\n    idbProxyTraps = callback(idbProxyTraps);\n}\nfunction wrapFunction(func) {\n    // Due to expected object equality (which is enforced by the caching in `wrap`), we\n    // only create one new func per func.\n    // Cursor methods are special, as the behaviour is a little more different to standard IDB. In\n    // IDB, you advance the cursor and wait for a new 'success' on the IDBRequest that gave you the\n    // cursor. It's kinda like a promise that can resolve with many values. That doesn't make sense\n    // with real promises, so each advance methods returns a new promise for the cursor object, or\n    // undefined if the end of the cursor has been reached.\n    if (getCursorAdvanceMethods().includes(func)) {\n        return function (...args) {\n            // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use\n            // the original object.\n            func.apply(unwrap(this), args);\n            return wrap(this.request);\n        };\n    }\n    return function (...args) {\n        // Calling the original function with the proxy as 'this' causes ILLEGAL INVOCATION, so we use\n        // the original object.\n        return wrap(func.apply(unwrap(this), args));\n    };\n}\nfunction transformCachableValue(value) {\n    if (typeof value === 'function')\n        return wrapFunction(value);\n    // This doesn't return, it just creates a 'done' promise for the transaction,\n    // which is later returned for transaction.done (see idbObjectHandler).\n    if (value instanceof IDBTransaction)\n        cacheDonePromiseForTransaction(value);\n    if (instanceOfAny(value, getIdbProxyableTypes()))\n        return new Proxy(value, idbProxyTraps);\n    // Return the same value back if we're not going to transform it.\n    return value;\n}\nfunction wrap(value) {\n    // We sometimes generate multiple promises from a single IDBRequest (eg when cursoring), because\n    // IDB is weird and a single IDBRequest can yield many responses, so these can't be cached.\n    if (value instanceof IDBRequest)\n        return promisifyRequest(value);\n    // If we've already transformed this value before, reuse the transformed value.\n    // This is faster, but it also provides object equality.\n    if (transformCache.has(value))\n        return transformCache.get(value);\n    const newValue = transformCachableValue(value);\n    // Not all types are transformed.\n    // These may be primitive types, so they can't be WeakMap keys.\n    if (newValue !== value) {\n        transformCache.set(value, newValue);\n        reverseTransformCache.set(newValue, value);\n    }\n    return newValue;\n}\nconst unwrap = (value) => reverseTransformCache.get(value);\n\n/**\n * Open a database.\n *\n * @param name Name of the database.\n * @param version Schema version.\n * @param callbacks Additional callbacks.\n */\nfunction openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {\n    const request = indexedDB.open(name, version);\n    const openPromise = wrap(request);\n    if (upgrade) {\n        request.addEventListener('upgradeneeded', (event) => {\n            upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);\n        });\n    }\n    if (blocked) {\n        request.addEventListener('blocked', (event) => blocked(\n        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405\n        event.oldVersion, event.newVersion, event));\n    }\n    openPromise\n        .then((db) => {\n        if (terminated)\n            db.addEventListener('close', () => terminated());\n        if (blocking) {\n            db.addEventListener('versionchange', (event) => blocking(event.oldVersion, event.newVersion, event));\n        }\n    })\n        .catch(() => { });\n    return openPromise;\n}\n/**\n * Delete a database.\n *\n * @param name Name of the database.\n */\nfunction deleteDB(name, { blocked } = {}) {\n    const request = indexedDB.deleteDatabase(name);\n    if (blocked) {\n        request.addEventListener('blocked', (event) => blocked(\n        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405\n        event.oldVersion, event));\n    }\n    return wrap(request).then(() => undefined);\n}\n\nconst readMethods = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'];\nconst writeMethods = ['put', 'add', 'delete', 'clear'];\nconst cachedMethods = new Map();\nfunction getMethod(target, prop) {\n    if (!(target instanceof IDBDatabase &&\n        !(prop in target) &&\n        typeof prop === 'string')) {\n        return;\n    }\n    if (cachedMethods.get(prop))\n        return cachedMethods.get(prop);\n    const targetFuncName = prop.replace(/FromIndex$/, '');\n    const useIndex = prop !== targetFuncName;\n    const isWrite = writeMethods.includes(targetFuncName);\n    if (\n    // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.\n    !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) ||\n        !(isWrite || readMethods.includes(targetFuncName))) {\n        return;\n    }\n    const method = async function (storeName, ...args) {\n        // isWrite ? 'readwrite' : undefined gzipps better, but fails in Edge :(\n        const tx = this.transaction(storeName, isWrite ? 'readwrite' : 'readonly');\n        let target = tx.store;\n        if (useIndex)\n            target = target.index(args.shift());\n        // Must reject if op rejects.\n        // If it's a write operation, must reject if tx.done rejects.\n        // Must reject with op rejection first.\n        // Must resolve with op value.\n        // Must handle both promises (no unhandled rejections)\n        return (await Promise.all([\n            target[targetFuncName](...args),\n            isWrite && tx.done,\n        ]))[0];\n    };\n    cachedMethods.set(prop, method);\n    return method;\n}\nreplaceTraps((oldTraps) => ({\n    ...oldTraps,\n    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),\n    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop),\n}));\n\nconst advanceMethodProps = ['continue', 'continuePrimaryKey', 'advance'];\nconst methodMap = {};\nconst advanceResults = new WeakMap();\nconst ittrProxiedCursorToOriginalProxy = new WeakMap();\nconst cursorIteratorTraps = {\n    get(target, prop) {\n        if (!advanceMethodProps.includes(prop))\n            return target[prop];\n        let cachedFunc = methodMap[prop];\n        if (!cachedFunc) {\n            cachedFunc = methodMap[prop] = function (...args) {\n                advanceResults.set(this, ittrProxiedCursorToOriginalProxy.get(this)[prop](...args));\n            };\n        }\n        return cachedFunc;\n    },\n};\nasync function* iterate(...args) {\n    // tslint:disable-next-line:no-this-assignment\n    let cursor = this;\n    if (!(cursor instanceof IDBCursor)) {\n        cursor = await cursor.openCursor(...args);\n    }\n    if (!cursor)\n        return;\n    cursor = cursor;\n    const proxiedCursor = new Proxy(cursor, cursorIteratorTraps);\n    ittrProxiedCursorToOriginalProxy.set(proxiedCursor, cursor);\n    // Map this double-proxy back to the original, so other cursor methods work.\n    reverseTransformCache.set(proxiedCursor, unwrap(cursor));\n    while (cursor) {\n        yield proxiedCursor;\n        // If one of the advancing methods was not called, call continue().\n        cursor = await (advanceResults.get(proxiedCursor) || cursor.continue());\n        advanceResults.delete(proxiedCursor);\n    }\n}\nfunction isIteratorProp(target, prop) {\n    return ((prop === Symbol.asyncIterator &&\n        instanceOfAny(target, [IDBIndex, IDBObjectStore, IDBCursor])) ||\n        (prop === 'iterate' && instanceOfAny(target, [IDBIndex, IDBObjectStore])));\n}\nreplaceTraps((oldTraps) => ({\n    ...oldTraps,\n    get(target, prop, receiver) {\n        if (isIteratorProp(target, prop))\n            return iterate;\n        return oldTraps.get(target, prop, receiver);\n    },\n    has(target, prop) {\n        return isIteratorProp(target, prop) || oldTraps.has(target, prop);\n    },\n}));\n\n\n\n\n//# sourceURL=webpack://orion/./node_modules/idb/build/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/spa.js");
/******/ 	
/******/ })()
;