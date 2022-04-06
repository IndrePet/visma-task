'use strict';
const containerLeft = document.querySelector('.left');
const containerRight = document.querySelector('.img-large');
const authorInfo = document.querySelector('#author');
const sizeInfo = document.querySelector('#img-size');
const greyscale = document.querySelector('#greyscale');
const blurSlider = document.querySelector('#blur');

let apiPage = 1;

const getImageList = (apiPage, limit = 4) => {
  fetch(`https://picsum.photos/v2/list?page=${apiPage}&limit=${limit}`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => loadThumbnails(element));
    });
};

const loadThumbnails = (data) => {
  const imgThumb = document.createElement('img');
  imgThumb.setAttribute('src', data.download_url);
  imgThumb.classList.add('thumbnail');
  containerLeft.appendChild(imgThumb);

  imgThumb.addEventListener('click', () => {
    containerRight.innerHTML = '';
    sizeInfo.innerText = '';
    authorInfo.innerText = '';
    const rightSide = new RightSide(data);
    rightSide.toLarge(blurSlider.value);

    greyscale.addEventListener('change', () => {
      rightSide.newRender(blurSlider.value);
    });

    blurSlider.addEventListener('change', () => {
      rightSide.newRender(blurSlider.value);
    });
  });
};

class RightSide {
  constructor(data) {
    this.id = data.id;
    this.width = data.width;
    this.height = data.height;
    this.author = data.author;
    this.url = `https://picsum.photos/id/${this.id}/${this.width}/${this.height}`;
  }

  toLarge(blurValue) {
    if (greyscale.checked && parseInt(blurValue) === 0) {
      this.url = `https://picsum.photos/id/${this.id}/${this.width}/${this.height}?grayscale`;
    } else if (blurValue > 0 && !greyscale.checked) {
      this.url = `https://picsum.photos/id/${this.id}/${this.width}/${this.height}?blur=${blurValue}`;
    } else if (greyscale.checked && blurValue > 0) {
      this.url = `https://picsum.photos/id/${this.id}/${this.width}/${this.height}?grayscale&blur=${blurValue}`;
    } else {
      this.url = `https://picsum.photos/id/${this.id}/${this.width}/${this.height}`;
    }
    const imgLarge = document.createElement('img');
    imgLarge.setAttribute('src', this.url);
    imgLarge.classList.add('enlarged');
    containerRight.appendChild(imgLarge);
    authorInfo.innerText = `${this.author}`;
    sizeInfo.innerText = `${this.width}px / ${this.height}px`;
  }

  newRender(blurValue = 0) {
    containerRight.innerHTML = '';
    this.toLarge(blurValue);
  }
}

getImageList();

/*
Responsive infinite scroll
*/
containerLeft.addEventListener('scroll', () => {
  let imageLimit = 1;
  if (window.innerWidth > 800) {
    if (
      containerLeft.scrollHeight - containerLeft.offsetHeight <=
      Math.ceil(containerLeft.scrollTop)
    ) {
      getImageList(++apiPage, imageLimit);
    }
  } else {
    if (
      containerLeft.scrollWidth - containerLeft.offsetWidth <=
      Math.ceil(containerLeft.scrollLeft)
    ) {
      getImageList(++apiPage, imageLimit);
    }
  }
});
