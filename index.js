"use strict";

// Image import

// Left container

const containerLeft = document.querySelector(".left");
const containerRight = document.querySelector(".img-large");
const authorInfo = document.querySelector("#author");
const sizeInfo = document.querySelector("#img-size");

const thumbnail = (url, id, width, height, author) => {
  const imgThumb = document.createElement("img");
  imgThumb.setAttribute("src", url);
  imgThumb.classList.add("thumbnail");
  containerLeft.appendChild(imgThumb);

  imgThumb.addEventListener("click", () => {
    containerRight.innerHTML = "";
    sizeInfo.innerText = "";
    authorInfo.innerText = "";

    toLarge(id, width, height, author);
  });
};

fetch("https://picsum.photos/v2/list")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((element) => {
      thumbnail(
        element.download_url,
        element.id,
        element.width,
        element.height,
        element.author
      );
    });
  });

const toLarge = (id, width, height, author) => {
  let url = `https://picsum.photos/id/${id}/${width}/${height}`;
  const imgLarge = document.createElement("img");
  imgLarge.setAttribute("src", url);
  imgLarge.classList.add("enlarged");
  containerRight.appendChild(imgLarge);
  authorInfo.innerText = `${author}`;
  sizeInfo.innerText = `${width}px / ${height}px`;
};
