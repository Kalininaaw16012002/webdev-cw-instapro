import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";

  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="upload-image-container"></div>
        <label>
            Опишите фотографию:
            <textarea class="input textarea" rows="4"></textarea>
        </label>
        <div class="form-error"></div>
        <button class="button" id="add-button">Добавить</button>
      </div>
    </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
      const description = document.querySelector("textarea.input").value;

      if (!imageUrl) {
        alert("Загрузите фотографию!");
        return;
      }

      if (!description) {
        alert("Опишите фотографию!");
        return;
      }

      onAddPostClick({
        description: description,
        imageUrl: imageUrl,
      });
    });
  };

  render();
}