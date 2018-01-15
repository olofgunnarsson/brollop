void function (window, document) {
    var nextPage = 1;


    var galleryData = {
        options: {
            showCount: true,
            searchFilter: false,
            categoriesFilter: true,
            showNone: true,
            showOthers: true,
            showLabels: 'none'
        }
    };

    var galleryEl = document.getElementById('gallery');
    var photoswipeEl = document.getElementsByClassName('pswp')[0];
    var gallery = new NaturalGallery.Gallery(galleryEl, photoswipeEl, galleryData);

    gallery.images = [];

    more();


    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('serviceworker.js');
    }

    function more() {
        search(nextPage++);
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
        var map = data.photos.photo.map(renderPhoto);
        gallery.appendItems(map);

    }

    function renderPhoto(photo) {
        var thumbSrc = buildFlickrPhotoUrl(photo, '');
        var orgSrc = buildFlickrPhotoUrl(photo, '_b');
        var regex = /([0-9]*)x([0-9]*)/.exec(photo.title);
        var width = regex[1];
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
            "categories": [{"title": "Middag"}],
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

}(window, document);
