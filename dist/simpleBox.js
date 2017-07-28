////#region Misc
var sel = function (selector) { return document.querySelector(selector); };
var selAll = function (selector) { return document.querySelectorAll(selector); };
// Berechnet den offset zum Body
function offset(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}
// Json request
function makeRequest(type, path, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(xhr.responseText);
            }
            else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open(type, path, true);
    xhr.send();
}
////#endregion Misc
////#region Scrolling
var userScroll = false;
function goTo(selector, yOffset) {
    var _this = this;
    if (yOffset === void 0) { yOffset = 50; }
    // Berechnung
    var target = Math.max((typeof selector === "number" ? selector : offset(sel(selector)).y) - yOffset, 0);
    var dist = target - window.scrollY;
    var scrollStep = dist / 20;
    var lastPos = -1;
    var finished = false;
    // Manche Browser setzten kurz nach dem laden selbst die Pos,
    // daher die aktuelle Position zweimal überprüfen
    var twice = 0;
    //Update bis Ziel, Seitenende oder User hat gescrollt
    var scrollInterval = setInterval(function () {
        if (finished || _this.userScroll) {
            if (document.readyState === "complete" || _this.userScroll) {
                clearInterval(scrollInterval);
                _this.userScroll = false;
            }
            if (!_this.userScroll) {
                window.scrollTo(0, target);
            }
        }
        else if (!(window.scrollY > target - scrollStep && window.scrollY < target + scrollStep) && (lastPos !== window.scrollY || twice++ < 1)) {
            lastPos = window.scrollY;
            window.scrollTo(0, window.scrollY + scrollStep);
        }
        else {
            finished = true;
        }
    }, 1000 / 59.9);
}
// Erkennung, ob User selbst scrollt
if (window.addEventListener) {
    document.addEventListener('DOMMouseScroll', function () { return userScroll = true; }, { passive: true });
}
//for IE/OPERA etc
document.addEventListener('mousewheel', function () { return userScroll = true; }, { passive: true });
////#endregion Scrolling
////#region CounterUp
var counterUpStarted = false;
function counterUp() {
    var items = selAll('[data-counterup]');
    var finished = false;
    if (items.length > 0) {
        var firstPos_1 = offset(items[0]).y;
        // Wenn im Bild, dann anfangen zu zählen
        window.addEventListener('scroll', function () {
            if (!counterUpStarted) {
                if (window.scrollY + window.innerHeight > firstPos_1) {
                    counterUpStarted = true;
                    // Auf 0 setzten
                    for (var i = 0; i < items.length; i++) {
                        var num = parseInt(items[i].innerText);
                        items[i].innerText = items[i].innerText.replace(num.toString(), "0");
                    }
                    // Schrittweise hoch zählen
                    var currentStep_1 = 0.01;
                    var counterInterval_1 = setInterval(function () {
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            var target = parseInt(item.getAttribute("data-counterup"));
                            var current = parseInt(item.innerText);
                            var newVal = target * currentStep_1;
                            if (newVal >= target) {
                                finished = true;
                                newVal = target;
                            }
                            item.innerText = item.innerText.replace(current.toFixed(0), newVal.toFixed(0));
                        }
                        currentStep_1 += 0.01;
                        if (finished) {
                            clearInterval(counterInterval_1);
                        }
                    }, 1000 / 59.9);
                }
            }
        });
    }
}
////#endregion Scrolling 
//# sourceMappingURL=common.js.map
/// <reference path="./common.ts"/>
//Einbettungscode für Youtube, Vimeo und async IFrames
var Embedded = (function () {
    function Embedded() {
        //Embedded Videos
        var n, v = selAll(".youtube-player");
        //YouTube
        for (n = 0; n < v.length; n++) {
            this.embedItem(v[n], "youtube");
        }
        //Vimeo
        v = selAll(".vimeo-player");
        for (n = 0; n < v.length; n++) {
            this.embedItem(v[n], "vimeo");
        }
        //Panorama
        v = selAll(".iframe-player");
        for (n = 0; n < v.length; n++) {
            this.embedItem(v[n], "iframe");
        }
    }
    // Erzeugt je nach Typ ein entsprechendes IFrame
    Embedded.prototype.embedItem = function (el, type) {
        var _this = this;
        if (type === "youtube") {
            var div_1 = document.createElement("div");
            div_1.setAttribute("data-id", el.dataset.id);
            var img_1 = document.createElement("img");
            img_1.alt = el.title ? el.title : "YoutTube";
            img_1.title = el.title ? el.title : "YoutTube";
            if (el.offsetWidth > 700) {
                img_1.src = "https://i.ytimg.com/vi/ID/maxresdefault.jpg".replace("ID", el.dataset.id);
                img_1.setAttribute("fallback", "https://i.ytimg.com/vi/ID/hqdefault.jpg".replace("ID", el.id));
                img_1.onload = function () {
                    if (img_1.naturalHeight === 90 && img_1.naturalWidth === 120 && img_1.src !== img_1.getAttribute("fallback")) {
                        img_1.src = null;
                        img_1.src = img_1.getAttribute("fallback");
                    }
                };
            }
            else {
                img_1.src = "https://i.ytimg.com/vi/ID/hqdefault.jpg".replace("ID", el.dataset.id);
            }
            var play = document.createElement("div");
            play.classList.add("play");
            div_1.appendChild(img_1);
            div_1.appendChild(play);
            div_1.onclick = function () { return _this.createVideo(true, div_1); };
            el.appendChild(div_1);
        }
        else if (type === "vimeo") {
            makeRequest("GET", 'https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/' + el.dataset.id, function (result) {
                var data = JSON.parse(result);
                var div, img, play;
                div = document.createElement("div");
                div.setAttribute("data-id", el.dataset.id);
                img = document.createElement("img");
                img.alt = el.title ? el.title : "Vimeo";
                img.title = el.title ? el.title : "Vimeo";
                img.src = data.thumbnail_url;
                play = document.createElement("div");
                play.classList.add("play");
                div.appendChild(img);
                div.appendChild(play);
                div.onclick = function () { return _this.createVideo(false, div); };
                sel('.vimeo-player[data-id="' + el.dataset.id + '"]').appendChild(div);
            }, null);
        }
        else if (type === "iframe") {
            var div_2, img = void 0, play = void 0;
            div_2 = document.createElement("div");
            div_2.setAttribute("data-src", el.dataset.id);
            img = document.createElement("img");
            img.alt = el.title ? el.title : "IFrame";
            img.title = el.title ? el.title : "IFrame";
            img.src = el.dataset.thumb;
            play = document.createElement("div");
            play.classList.add("play");
            div_2.appendChild(img);
            div_2.appendChild(play);
            div_2.onclick = function () { return _this.createIframe(div_2); };
            el.appendChild(div_2);
        }
    };
    // IFrame Code für Youtube und Vimeo
    Embedded.prototype.createVideo = function (yt, scope) {
        var iframe = document.createElement("iframe");
        var embed = yt ? "https://www.youtube.com/embed/ID?autoplay=1" : "https://player.vimeo.com/video/ID?autoplay=1";
        iframe.setAttribute("src", embed.replace("ID", scope.dataset.id));
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        scope.parentNode.replaceChild(iframe, scope);
    };
    // IFrame Code für allgemeine IFrames
    Embedded.prototype.createIframe = function (scope) {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", scope.dataset.src);
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        scope.parentNode.replaceChild(iframe, scope);
    };
    return Embedded;
}());
var embedded;
(function () {
    embedded = new Embedded();
})();
//# sourceMappingURL=embedded.js.map
/*! Gallery

Beispiele:
<img data-target="http://static.4players.de/sourcen/portal/4players/2017/header_title_2017.png" src="~/images/Logo-SoftSolutions.png" />
<a href="http://static.4players.de/sourcen/portal/4players/2017/header_title_2017.png" data-imageViewer title="Bild">
    <img src="~/images/Logo-SoftSolutions.png" />
</a>
<a data-type="iframe" data-imageViewer title="Iframe" data-target="https://view.mylumion.com/?p=u3gouj8x&embed=1&iframe=true" data-thumb="https://content.lumion3d.com/lumiondotcom-content/2015/06/u3gouj8xview_4_thumb.jpg">
    <img src="~/images/Logo-SoftSolutions.png" />
</a>
<a data-target="k3tQaWxaLzM" data-type="youtube" data-imageViewer title="Youtube">
    <img src="~/images/Logo-SoftSolutions.png" />
</a>
<a data-target="http://www.4players.de/" data-imageViewer title="Link">
    <img src="~/images/Logo-SoftSolutions.png" />
</a>
<a data-target="#bla" data-imageViewer title="4Players">
    <img src="~/images/Logo-SoftSolutions.png" />
</a>
<div id="bla" hidden>
    <span>Hallo Welt</span>
</div>
*/
// Referenz auf Embedded-Plugin
/// <reference path="./embedded.ts"/>
/// <reference path="./common.ts"/>
var Gallery = (function () {
    // Initialisiert Markup und Events 
    function Gallery(elements) {
        var _this = this;
        this.items = [];
        this._currentIndex = 0;
        var instance = this;
        for (var i = 0; i < elements.length; i++) {
            var item = elements[i];
            item.onclick = function (ev) {
                instance.onItemClicked(this, ev);
                ev.preventDefault();
                ev.stopPropagation();
            };
            this.items.push(item);
        }
        this.initMarkup();
        window.addEventListener("resize", function () {
            _this.updateImageSize();
        }, { passive: true });
    }
    // Initialisiert Markup
    Gallery.prototype.initMarkup = function () {
        var _this = this;
        var body = sel("body");
        var imageViewer = document.createElement("div");
        imageViewer.classList.add("imageViewer");
        this._main = imageViewer;
        var wrapper = document.createElement("div");
        wrapper.classList.add("imageViewer-wrapper");
        //wrapper.onclick = () => this.close();
        imageViewer.appendChild(wrapper);
        var contentWrapper = document.createElement("div");
        contentWrapper.classList.add("imageViewer-content");
        var container = document.createElement("div");
        container.classList.add("container");
        contentWrapper.appendChild(container);
        contentWrapper.onclick = function (e) { return _this.close(e); };
        container.onclick = function (e) { return e.stopPropagation(); };
        this._content = container;
        wrapper.appendChild(contentWrapper);
        if (this.items.length > 1) {
            var prev = document.createElement("span");
            prev.classList.add("imageViewer-prev");
            var prevContent = document.createElement("span");
            prevContent.innerText = "<";
            prev.onclick = function () { return _this.prev(); };
            prev.appendChild(prevContent);
            wrapper.appendChild(prev);
            var next = document.createElement("span");
            var nextContent = document.createElement("span");
            nextContent.innerText = ">";
            next.onclick = function () { return _this.next(); };
            next.appendChild(nextContent);
            next.classList.add("imageViewer-next");
            wrapper.appendChild(next);
        }
        var close = document.createElement("span");
        close.innerText = "X";
        close.classList.add("imageViewer-close");
        close.onclick = function () { return _this.close(null); };
        wrapper.appendChild(close);
        var caption = document.createElement("div");
        caption.classList.add("imageViewer-caption");
        var captionContent = document.createElement("span");
        caption.appendChild(captionContent);
        this._captionContent = captionContent;
        imageViewer.appendChild(caption);
        body.appendChild(imageViewer);
    };
    // Wenn ein Galerie Item angeklickt wurde
    Gallery.prototype.onItemClicked = function (el, ev) {
        this._currentItems = this.items.filter(function (i) { return i.getAttribute("data-imageViewer") === el.getAttribute("data-imageViewer"); });
        this._currentIndex = this._currentItems.indexOf(el);
        this.loadContent();
        this._main.style.display = "block";
    };
    // Lädt den Content abhängig vom Typ
    Gallery.prototype.loadContent = function () {
        var _this = this;
        this._dimension = null;
        // Typ und Link ermitteln
        var el = this._currentItems[this._currentIndex];
        var link = el.getAttribute("data-target");
        if (!link) {
            if (el instanceof HTMLAnchorElement) {
                link = el.href;
            }
            else if (el instanceof HTMLImageElement) {
                link = el.src;
            }
            else {
                throw new Error("No data-target");
            }
        }
        var type = el.getAttribute("data-type");
        if (!type) {
            type = link[0] === '#' ? "ref" : (link.slice(-4).toLowerCase() === ".png" || link.slice(-4).toLowerCase() === ".jpg" ? "image" : "");
        }
        // Reset, falls es ref war
        if (this._originElement) {
            for (var i = 0; i < this._content.children[0].children.length; i++) {
                this._originElement.appendChild(this._content.children[0].children[i]);
            }
            this._originElement = null;
        }
        // Anwenden
        if (type === "image") {
            var tmpImage_1 = new Image();
            tmpImage_1.src = link;
            tmpImage_1.onload = function (e) {
                _this._dimension = {};
                _this._dimension.width = tmpImage_1.width;
                _this._dimension.height = tmpImage_1.height;
                _this.updateImageSize();
            };
            this._content.parentElement.style.backgroundImage = "url(" + link + ")";
            this._content.innerHTML = "";
        }
        else if (type === "youtube") {
            var player = document.createElement("div");
            player.classList.add("youtube-player");
            player.setAttribute("data-id", link);
            player.setAttribute("title", el.title);
            this.updateContainer(player);
            embedded.embedItem(player, "youtube");
        }
        else if (type === "vimeo") {
            var player = document.createElement("div");
            player.classList.add("vimeo-player");
            player.setAttribute("data-id", link);
            player.setAttribute("title", el.title);
            this.updateContainer(player);
            embedded.embedItem(player, "vimeo");
        }
        else if (type === "iframe") {
            var player = document.createElement("div");
            var thumb = el instanceof HTMLImageElement ? el.src : el.getAttribute("data-thumb");
            player.classList.add("iframe-player");
            player.setAttribute("data-id", link);
            player.setAttribute("title", el.title);
            player.setAttribute("data-thumb", thumb);
            this.updateContainer(player);
            embedded.embedItem(player, "iframe");
        }
        else if (type === "ref") {
            var div = document.createElement("div");
            link = "#" + link.split('#').slice(-1)[0];
            this._originElement = sel(link);
            if (!this._originElement) {
                div.innerHTML = "Konnte nicht geladen werden!";
            }
            for (var i = 0; i < this._originElement.children.length; i++) {
                div.appendChild(this._originElement.children[i]);
            }
            this.updateContainer(div);
        }
        else {
            var iframe = document.createElement("iframe");
            iframe.src = link;
            this.updateContainer(iframe);
        }
        // Untertitel Text ermitteln und setzten
        var captionText = el.getAttribute("title");
        if (!captionText) {
            captionText = el.getAttribute("name");
            if (!captionText) {
                captionText = el.getAttribute("alt");
            }
        }
        if (captionText) {
            this._captionContent.innerText = captionText;
        }
        else {
            this._captionContent.innerText = "";
        }
    };
    // Pass die Größe des Bildes an die momentane Auflösung an
    Gallery.prototype.updateImageSize = function () {
        if (this._dimension) {
            if (this._dimension.width < this._content.parentElement.clientWidth && this._dimension.height < this._content.parentElement.clientHeight) {
                this._content.parentElement.style.backgroundSize = this._dimension.width + "px " + this._dimension.height + "px";
            }
            else {
                this._content.parentElement.style.backgroundSize = "contain";
            }
        }
        else {
            this._content.parentElement.style.backgroundSize = "contain";
        }
    };
    // Setzt den neuen Content
    Gallery.prototype.updateContainer = function (el) {
        this._content.parentElement.style.backgroundImage = "";
        if (el instanceof HTMLIFrameElement) {
            this._content.classList.add("full");
        }
        else {
            this._content.classList.remove("full");
        }
        var oldChild = this._content.children.item(0);
        if (oldChild) {
            this._content.removeChild(oldChild);
        }
        this._content.appendChild(el);
    };
    // Next geklickt
    Gallery.prototype.next = function () {
        if (++this._currentIndex === this._currentItems.length) {
            this._currentIndex = 0;
        }
        this.loadContent();
    };
    // Vorher geklickt
    Gallery.prototype.prev = function () {
        if (--this._currentIndex < 0) {
            this._currentIndex = this._currentItems.length - 1;
        }
        this.loadContent();
    };
    // Schließen geklickt
    Gallery.prototype.close = function (e) {
        if (e && this._dimension) {
            var valH = e.movementX > (window.innerWidth / 2) - (this._dimension.width / 2) || e.movementX < (window.innerWidth / 2) + (this._dimension.width / 2);
            var valV = e.movementY > (window.innerHeight / 2) - (this._dimension.height / 2) || e.movementY < (window.innerHeight / 2) + (this._dimension.height / 2);
            if (valH && valV) {
                return;
            }
        }
        if (this._originElement) {
            for (var i = 0; i < this._content.children[0].children.length; i++) {
                this._originElement.appendChild(this._content.children[0].children[i]);
            }
            this._originElement = null;
        }
        var oldChild = this._content.children.item(0);
        if (oldChild) {
            this._content.removeChild(oldChild);
        }
        this._main.style.display = "none";
    };
    return Gallery;
}());
(function () {
    var elements = selAll('[data-imageviewer]');
    if (elements.length > 0) {
        var gallery = new Gallery(elements);
    }
    var descriptionElements = selAll('.img-description img');
    if (descriptionElements.length > 0) {
        var _loop_1 = function () {
            var img = descriptionElements[i];
            if (!img.complete) {
                img.onload = function (el) {
                    img.parentElement.classList.add("loaded");
                };
            }
            else {
                img.parentElement.classList.add("loaded");
            }
        };
        for (var i = 0; i < descriptionElements.length; i++) {
            _loop_1();
        }
    }
})();
//# sourceMappingURL=gallery.js.map