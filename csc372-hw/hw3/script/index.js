const gallery = document.querySelectorAll('.food_recommendation img');

gallery.forEach(image => image.addEventListener('click', expand));

function expand(event) {
    const clickedImage = event.currentTarget;
    const currentBigImage = document.querySelector('.big');

    if (currentBigImage && currentBigImage !== clickedImage) {
        currentBigImage.classList.replace('big', 'small');
        currentBigImage.nextElementSibling.classList.replace('shown', 'hide');
    }

    clickedImage.classList.replace('small', 'big');
    clickedImage.nextElementSibling.classList.replace('hide', 'shown');
}