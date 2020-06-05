$(function() {
    ymaps.ready(function () {
        var map = new ymaps.Map('map', {
            center: [53.9116158, 27.5937027],
            zoom: 15
        }, {
            searchControlProvider: 'yandex#search'
        });

        var placemark = new ymaps.Placemark(
            [53.9116158, 27.5937027], 
            {
                balloonContent: 'Мы находимся здесь!'
            }, 
            {
                preset: 'islands#icon',
                iconColor: '#0095b6'
            }
        );

        map.geoObjects.add(placemark); 
    });

    $('#theater-programms').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'linear'
    });
});