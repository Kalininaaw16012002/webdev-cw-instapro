import { createPost, deletePost, getPosts, getUserPosts, postDislike, postLike } from "./api.js";
import { renderAddPostPageComponent } from "./components/add-post-page-component.js";
import { renderAuthPageComponent } from "./components/auth-page-component.js";
import {
  ADD_POSTS_PAGE,
  AUTH_PAGE,
  LOADING_PAGE,
  POSTS_PAGE,
  USER_POSTS_PAGE,
} from "./routes.js";
import { renderPostsPageComponent } from "./components/posts-page-component.js";
import { renderLoadingPageComponent } from "./components/loading-page-component.js";
import {
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
  saveUserToLocalStorage,
} from "./helpers.js";

export let user = getUserFromLocalStorage();
export let selectedUserId = null;
export let page = null;
export let posts = [];

const getToken = () => {
  const token = user ? `Bearer ${user.token}` : undefined;
  return token;
};

export const logout = () => {
  user = null;
  removeUserFromLocalStorage();
  goToPage(POSTS_PAGE);
};

const updatePost = ({ type, id }) => {
  const replacePost = (updatedPost) => {
    for (let postId in posts) {
      if (updatedPost.id === posts[postId].id) {
        posts[postId] = updatedPost;
        break;
      }
    }
  };

  if (type === "like") {
    postLike({ token: getToken(), id: id })
      .then((updatedPost) => {
        replacePost(updatedPost.post);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        renderApp();
      });
  } else if (type === "dislike") {
    postDislike({ token: getToken(), id: id })
      .then((updatedPost) => {
        replacePost(updatedPost.post);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        renderApp();
      });
  } else if (type === "delete") {
    deletePost({ token: getToken(), id: id })
      .then(() => {
        posts = posts.filter((post) => post.id !== id);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        renderApp();
      });
  }
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
  if ([POSTS_PAGE, AUTH_PAGE, ADD_POSTS_PAGE, USER_POSTS_PAGE, LOADING_PAGE].includes(newPage)) {
    if (newPage === ADD_POSTS_PAGE) {
      // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
      page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
      return renderApp();
    }

    if (newPage === POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getPosts({ token: getToken() })
        .then((newPosts) => {
          page = POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    if (newPage === USER_POSTS_PAGE) {
      page = LOADING_PAGE;
      renderApp();

      return getUserPosts({ token: getToken(), userID: data.userId })
        .then((newPosts) => {
          page = USER_POSTS_PAGE;
          posts = newPosts;
          renderApp();
        })
        .catch((error) => {
          console.error(error);
          goToPage(POSTS_PAGE);
        });
    }

    page = newPage;
    renderApp();

    return;
  }

  throw new Error("страницы не существует");
};

const renderApp = () => {
  const appEl = document.getElementById("app");
  if (page === LOADING_PAGE) {
    return renderLoadingPageComponent({
      appEl,
      user,
      goToPage,
    });
  }

  if (page === AUTH_PAGE) {
    return renderAuthPageComponent({
      appEl,
      setUser: (newUser) => {
        user = newUser;
        saveUserToLocalStorage(user);
        goToPage(POSTS_PAGE);
      },
    });
  }

  if (page === ADD_POSTS_PAGE) {
    return renderAddPostPageComponent({
      appEl,
      onAddPostClick({ description, imageUrl }) {
        createPost({ token: getToken(), description, imageUrl })
          .then(() => {
            alert("Пост успешно добавлен!");
            goToPage(POSTS_PAGE);
          })
          .catch((error) => {
            console.log(error);
          });
      },
    });
  }

  if (page === POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl,
      updatePost: updatePost,
    });
  }

  if (page === USER_POSTS_PAGE) {
    return renderPostsPageComponent({
      appEl: appEl,
      userId: selectedUserId,
      updatePost: updatePost,
    });
  }
};

goToPage(POSTS_PAGE);