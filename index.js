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
        per_page: 30
    };
    var url = 'https://api.flickr.com/services/rest';
    jsonp(url, query, renderPhotos);
}

function renderPhotos(data) {
    window.naturalGalleries[0].images = data.photos.photo.map(renderPhoto);

    // gallery.appendItems(map);

}

function renderPhoto(photo) {
    var thumbSrc = buildFlickrPhotoUrl(photo, '_n');
    var orgSrc = buildFlickrPhotoUrl(photo, '_b');
    var regex = /\[(.*)]\.[0-9]*\.([0-9]*)x([0-9]*)/.exec(photo.title);
    var groups = regex[1]
        .split(",")
        .map(function (value) {
            return {"title": value}
        });
    var width = regex[3];
    var height = regex[2];
    var tHeight = 100;
    var tWidth = 100;

    if (width > height) {
        tHeight = 60;
        tWidth = 60 * (width / height);
    } else {
        tWidth = 60;
        tHeight = 60 * (height / width);

    }

    var image = {
        "thumbnail": thumbSrc,
        "enlarged": orgSrc,
        "title": "",
        "categories": groups,
        "tWidth": tWidth,
        "tHeight": tHeight,
        "eWidth": width ? width : 1024,
        "eHeight": height ? height : 1024
    };
    console.info("Added image");
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