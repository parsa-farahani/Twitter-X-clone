const router = {
   "/": {
      template: "pages/home.html",
      stylesheet: "styles/home.css",
      scripts: [],
      handlerName: "handleHomePage"
   },
   "/home": {
      template: "pages/home.html",
      stylesheet: "styles/home.css",
      scripts: [],
      handlerName: "handleHomePage"
   },
   "/index.html": {
      template: "pages/home.html",
      stylesheet: "styles/home.css",
      scripts: [],
      handlerName: "handleHomePage"
   },
   "/user-panel": {
      template: "pages/user-panel.html",
      stylesheet: "styles/user-panel.css",
      scripts: [],
      handlerName: "handleUserPanelPage"
   },
   "/write-post": {
      template: "pages/write-post.html",
      stylesheet: "styles/write-post.css",
      scripts: [],
      handlerName: "handleWritePostPage"
   },
   "/post": {
      template: "pages/post.html",
      stylesheet: "styles/post.css",
      scripts: [],
      handlerName: "handlePostPage"
   },
};

export default router;