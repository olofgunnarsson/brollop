"use strict";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js');
}

window.naturalGalleries = window.naturalGalleries || [];
var naturalGallery = {
    id: 'gallery',
    options: {
        showCount: true,
        searchFilter: false,
        categoriesFilter: true,
        showNone: true,
        showOthers: true
    }
};

window.naturalGalleries.push(naturalGallery);

more();

function more() {
    search(1);
}

function search(page) {
    var query = {
        api_key: '1fc6ba10b6eaa4bc658b63fcc138d5b0',
        method: 'flickr.people.getPublicPhotos',
        format: 'json',
        user_id: '154685165@N08',
        // user_id: '78621811@N06',
        page: page,
        per_page: 100
    };
    var url = 'https://api.flickr.com/services/rest';
    jsonp(url, query, renderPhotos);
}

function renderPhotos(data) {
    var pages = data.photos.pages;

    window.naturalGalleries[0].images = data.photos.photo.map(renderPhoto);

}

var categoriesStaringe = [
    {
        key: "GRATULATIONER",
        id: 1,
        name: "Gratulationer"
    },
    {
        key: "VIGSEL",
        id: 2,
        name: "Vigsel"
    },
    {
        key: "MINGEL",
        id: 3,
        name: "Mingel"
    },
    {
        key: 'BRÖLLOPSMIDDAG',
        id: 4,
        name: "Bröllopsmiddag"
    },
    {
        key: "BRUDPAR",
        id: 5,
        name: "Brudpar"
    },
    {
        key: "BRUDFÖLJE",
        id: 6,
        name: "Brudfölje"
    },
    {
        key: "FOTOBÅS",
        id: 7,
        name: "Fotobås"
    },
    {
        key: "GÄSTER",
        id: 8,
        name: "Gäster"
    }
];


function getCategoryForPic(groups) {
    var res = [];
    for (var i = 0; i < groups.length; i++) {
        for (var j = 0; j < categoriesStaringe.length; j++) {
            if (groups[i] === categoriesStaringe[j].key)
                res.push({title: categoriesStaringe[j].name, id: categoriesStaringe[j].id});

        }
    }
    return res;
}

function renderPhoto(photo) {
    var thumbSrc = buildFlickrPhotoUrl(photo, '_n');
    var orgSrc = buildFlickrPhotoUrl(photo, '_b');
    var regex = /\[(.*)]\.[0-9]*\.([0-9]*)x([0-9]*)/.exec(photo.title);
    var groups = regex[1]
        .split(",");

    var width = regex[2];
    var height = regex[3];
    var tHeight = 100;
    var tWidth = 100;

    if (width > height) {
        tHeight = 60;
        tWidth = 60 * (width / height);
    } else {
        tWidth = 60;
        tHeight = 60 * (height / width);

    }

    var categoryForPic = getCategoryForPic(groups);
    var image = {
        "thumbnail": thumbSrc,
        "enlarged": orgSrc,
        "title": "",
        "categories": categoryForPic,
        "tWidth": tWidth,
        "tHeight": tHeight,
        "eWidth": width ? width : 1024,
        "eHeight": height ? height : 1024
    };
    return image;
}

function buildFlickrPhotoUrl(photo, postfix) {
    return [
        'https://farm', photo.farm,
        '.staticflickr.com/', photo.server,
        '/', photo.id,
        '_', photo.secret,
        postfix || '',
        '.jpg'].join('');
}

function tag(name, className) {
    var el = document.createElement(name);
    if (className) {
        el.className = className;
    }
    return el;
}

function jsonp(url, query, done) {
    var key = query.jsoncallback = '_jsonp';
    var script = tag('script');
    script.src = url + qs(query);
    window[key] = done;
    document.body.appendChild(script);
}

function qs(query) {
    return '?' + Object.keys(query).map(keyValuePair).join('&');

    function keyValuePair(key) {
        return key + '=' + query[key];
    }
}