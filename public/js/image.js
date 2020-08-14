"use strict"

$(document).ready(() => {
    const image = $('.image');
    const imageView = $('.image__view');
    const body = $('body');

    image.click(function() {
        const $this = $(this);
        const viewedImage = imageView.find('img');
        const imageUrl = $this.attr('src');
        viewedImage.attr('src', imageUrl);
        
        body.addClass('h-screen overflow-y-hidden');
        imageView.removeClass('z--9999 opacity-0').addClass('z-50 opacity-100');
    })

    imageView.click(function() {
        body.removeClass('h-screen overflow-y-hidden');
        imageView.removeClass('z-50 opacity-100').addClass('z--9999 opacity-0');
    })
})