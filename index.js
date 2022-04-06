"use strict";
const containerLeft = document.querySelector(".left");
const containerRight = document.querySelector(".img-large");
const authorInfo = document.querySelector("#author");
const sizeInfo = document.querySelector("#img-size");

let page = 1;

const getImageList = (page, limit = 4) => {
  fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => loadThumbnails(element));
    });
};

const loadThumbnails = (data) => {
  const imgThumb = document.createElement("img");
  imgThumb.setAttribute("src", data.download_url);
  imgThumb.classList.add("thumbnail");
  containerLeft.appendChild(imgThumb);

  imgThumb.addEventListener("click", () => {
    containerRight.innerHTML = "";
    sizeInfo.innerText = "";
    authorInfo.innerText = "";

    toLarge(data.id, data.width, data.height, data.author);
  });
};

/*
Buggy on horizontal scroll
*/
if (window.innerWidth > 800) {
  console.log(window.innerWidth);
  containerLeft.addEventListener("scroll", () => {
    let imageLimit = 1;
    if (
      containerLeft.scrollHeight - containerLeft.offsetHeight <=
      containerLeft.scrollTop
    ) {
      getImageList(++page, imageLimit);
    }
  });
}

const toLarge = (id, width, height, author) => {
  let url = `https://picsum.photos/id/${id}/${width}/${height}`;
  const imgLarge = document.createElement("img");
  imgLarge.setAttribute("src", url);
  imgLarge.classList.add("enlarged");
  containerRight.appendChild(imgLarge);
  authorInfo.innerText = `${author}`;
  sizeInfo.innerText = `${width}px / ${height}px`;
};

getImageList();
