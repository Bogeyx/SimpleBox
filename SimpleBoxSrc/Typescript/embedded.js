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
            if (el.offsetWidth > 700) {
                img_1.src = "https://i.ytimg.com/vi/ID/maxresdefault.jpg".replace("ID", el.dataset.id);
                img_1.setAttribute("fallback", "https://i.ytimg.com/vi/ID/hqdefault.jpg".replace("ID", el.id));
                img_1.alt = "YoutTube";
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
            getJSON('https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/' + el.dataset.id, function (data) {
                var div, img, play;
                div = document.createElement("div");
                div.setAttribute("data-id", el.dataset.id);
                img = document.createElement("img");
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
    // IFrame Code für allgemine IFrames
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