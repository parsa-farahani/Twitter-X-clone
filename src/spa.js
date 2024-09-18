import router from "./router";
import loadComponents from "./loadcomponents";

import { loadPosts } from "./loadPosts";
import { init as initHome, destroy as destroyHome } from "./home";
import { renderUserInfo, loadUserInfo } from "./user-panel";
import { init as initWritePost } from "./write-post";
import { createDB, deletePostFromDB } from "./idb-control";

// define all web-components
await loadComponents();

// Elements
const root = document.getElementById("root");

// current-user
let curntUser;
let curntUserPostsCount = 0;

(async () => {
  curntUser = await fetch("user.json");
  curntUserPostsCount = +curntUser.posts_count;
})();

// creating indexedDB
let db;
(async () => {
  db = await createDB();
  console.log(db);
})();

// different pages sscripts:
const page = {
  // home
  handleHomePage() {
    console.log("home");
    initHome();
    loadPosts("feed");
  },
  // user-panel
  handleUserPanelPage() {
    destroyHome();
    console.log("user panel");
    renderUserInfo();
  },
  // post
  handlePostPage() {
    destroyHome();
    loadPosts(
      "post",
      +location.search.slice(location.search.indexOf("p=") + 2)
    );
  },
  // write-post
  handleWritePostPage() {
    destroyHome();
    initWritePost(db, curntUserPostsCount);
  },
};

// SPA logic
// handling nav-links:
// prevent default navigation links
const attachNavigationEventListener = () => {
  document.addEventListener("DOMContentLoaded", (e) => {
    console.log("loaded DOM");
    document.addEventListener("click", (e) => {
      const { target } = e;
      if (!target.matches("[data-navlink]")) return;
      e.preventDefault();
      e.stopPropagation();
      navigate(target.href);
    });
  });
};
attachNavigationEventListener();

// state management
window.addEventListener("popstate", (e) => {
  render();
});

const navigate = (url) => {
  if (location.href.endsWith(url)) return; // so we are already in that page

  history.pushState({}, "", url);
  render();
};

const render = async () => {
  const path = location.pathname;
  // const state = path.slice( path.indexOf('/dist') + ('/dist').length );

  const route = router[path];

  if (!route) {
    root.innerHTML = `
         <div class="not-found-cont">
            <h1 class="not-found-cont__alert">
               404 -- Not Found
            </h1>
            <a href="/" class="not-found-cont__backhome-btn" data-navlink>
               Back to home
            </a>
         </div>
      `;
    return;
  }

  const { template, stylesheet, scripts, handlerName } = route;

  try {
    const html = await fetch(template).then((res) => res.text());

    root.innerHTML = html;

    loadStyles(stylesheet);

    page[handlerName]();

    // loadScripts(scripts);
  } catch (error) {
    console.warn("Error - loading template", error);
    root.innerHTML = "<h1>Error loading page</h1>";
  }

  function loadStyles(stylesheet) {
    let exists = false;
    // clearing prev pages stylesheets
    document.querySelectorAll("link").forEach((link) => {
      if (
        link.rel === "stylesheet" &&
        link.href !== stylesheet &&
        !link.href.includes("index")
      ) {
        link.remove();
      }
      if (link.href === stylesheet) {
        exists = true;
      }
    });
    // adding new stylesheet
    if (!exists) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = stylesheet;
      document.head.append(link);
    }
  }

  function loadScripts(scripts) {
    // clearing prev-page scripts
    document.querySelectorAll("script").forEach((script) => {
      if (
        script.src &&
        !script.src.includes("index") &&
        !script.src.includes("spa")
      ) {
        script.remove();
      }
    });

    // adding new scripts
    scripts.forEach((scriptSrc) => {
      const scriptEl = document.createElement("script");
      // scriptEl.type = 'module';
      scriptEl.async = false;
      scriptEl.defer = true;

      scriptEl.src = scriptSrc;
      document.head.append(scriptEl);
    });
  }
};

render();

/* navigate to post-page by clicking on it */
document.addEventListener("navigate-to-post", (e) => {
  const { postId } = e.detail; // id of post(to load its data from API)
  const postEl = e.target; // post Elelement (<user-tweet>)
  const postObject = {
    // we extract post-info from its attributes, to send them to 'post-page' (save to localStorage, and retrieve it there), to load there (because for now we haven't backend API)
    post_id: postId,
    author_id: postEl.dataset.authorId,
    referred_id: postEl.dataset.referredId,
    content: postEl.dataset.content,
    media_srcs: postEl.dataset.mediaSrcs,
    comments_ids: postEl.dataset.commentsIds,
    posting_date: postEl.dataset.datetime,
    comments_count: postEl.dataset.commentsCount,
    reposts_count: postEl.dataset.repostsCount,
    likes_count: postEl.dataset.likesCount,
    view_count: postEl.dataset.viewCount,
  };
  localStorage.setItem("current_post", JSON.stringify(postObject));
  navigate(`/post?p=${postId}`);
});

/* navigate to user-page by clicking on post's author-link */
document.addEventListener("navigate-to-user-panel", (e) => {
  const { id } = e.detail; // id of post(to load its data from API)
  navigate(`/user-panel?u=${id}`);
});

/* deleting user-pos by clicking 'delete post' */
document.addEventListener("delete-post", (e) => {
  const { postId } = e.detail; // id of post(to load its data from API)
  console.log(postId);
  deletePostFromDB(postId);
  document.querySelector(`user-tweet[data-post-id="${postId}"]`).remove();
});
