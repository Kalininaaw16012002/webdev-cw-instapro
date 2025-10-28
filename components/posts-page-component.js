import { user, posts, goToPage } from "../index.js";
import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import {
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

export function renderPostsPageComponent({ appEl, userId, updatePost }) {
  console.log("Актуальный список постов:", posts);

  const postsHTML = posts
    .map((post) => {
      let userName = post.user.name;
      let postDescription = post.description;
      return `
                  <li class="post">
        ${
          !userId
            ? `<div class="post-header" data-user-id="${post.user.id}">
                  <img src="${post.user.imageUrl}" class="post-header__user-image" />
                  <p class="post-header__user-name">${userName}</p>
                </div>`
            : ``
        }
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}" />
        </div>
        <div class="post-likes">
          <div class="likes-quantity"><button data-post-id="${
            post.id
          }" data-is-liked="${post.isLiked}" class="like-button">
            <img src="./assets/images/${
              post.isLiked ? "like-active.svg" : "like-not-active.svg"
            }" />
          </button>
          <p class="post-likes-text">Нравится: <strong>${
            post.likes.length
          }</strong></p></div>
          ${
            user !== null && post.user.id === user._id
              ? `<button class="secondary-button post-delete" data-post-id="${post.id}">Удалить</button>`
              : ``
          }
        </div>
       <p class="post-text">
          <span class="user-name">${userName}</span>
          ${postDescription}
        </p>
        <p class="post-date">${getTimeElapsed(post.createdAt, new Date())}</p>
      </li>
      `;
    })
    .join("");

  const appHtml = `
  <div class="page-container">
    <div class="header-container"></div>
    ${
      userId
        ? `<div class="posts-user-header">
            <img src="${posts[0].user.imageUrl}" class="post-header__user-image">
            <p class="posts-user-header__user-name">${posts[0].user.name}</p>
          </div>`
        : ``
    }
    <ul class="posts">
      ${postsHTML}
    </ul>
  </div>
  `;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  if (!user) {
    return;
  }

  for (let likeEl of document.querySelectorAll(".like-button")) {
    likeEl.addEventListener("click", () => {
      if (likeEl.dataset.isLiked === "true") {
        updatePost({ type: "dislike", id: likeEl.dataset.postId });
      } else {
        updatePost({ type: "like", id: likeEl.dataset.postId });
      }
    });
  }

  for (let delEl of document.querySelectorAll(".post-delete")) {
    delEl.addEventListener("click", () => {
      updatePost({ type: "delete", id: delEl.dataset.postId });
    });
  }
}

function getTimeElapsed(fromDate, toDate) {
  const differenceInMinutesValue = differenceInMinutes(toDate, fromDate);
  const differenceInHoursValue = differenceInHours(toDate, fromDate);
  const differenceInDaysValue = differenceInDays(toDate, fromDate);
  const differenceInMonthsValue = differenceInMonths(toDate, fromDate);

  if (differenceInMonthsValue >= 1) {
    return `${differenceInMonthsValue} месяцев назад`;
  } else if (differenceInDaysValue >= 1) {
    return `${differenceInDaysValue} дней назад`;
  } else if (differenceInHoursValue >= 1) {
    return `${differenceInHoursValue} часов назад`;
  } else if (differenceInMinutesValue >= 1) {
    return `${differenceInMinutesValue} минут назад`;
  } else {
    return `Только что`;
  }
}
