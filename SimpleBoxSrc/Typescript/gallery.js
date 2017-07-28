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
        });
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
        var content = document.createElement("div");
        content.classList.add("imageViewer-content");
        var container = document.createElement("div");
        container.classList.add("container");
        content.appendChild(container);
        this._content = container;
        this._content.onclick = function () { return _this.close(); };
        wrapper.appendChild(content);
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
        close.onclick = function () { return _this.close(); };
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
            if (this._dimension.width < this._content.parentElement.clientWidth || this._dimension.height < this._content.parentElement.clientHeight) {
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
    Gallery.prototype.close = function () {
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