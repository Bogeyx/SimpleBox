/// <reference path="./common.ts"/>

//Einbettungscode für Youtube, Vimeo und async IFrames
class Embedded {
    constructor() {
        //Embedded Videos
        let n, v = selAll(".youtube-player");
        //YouTube
        for (n = 0; n < v.length; n++) {
            this.embedItem(v[n] as HTMLElement, "youtube")
        }

        //Vimeo
        v = selAll(".vimeo-player");
        for (n = 0; n < v.length; n++) {
            this.embedItem(v[n] as HTMLElement, "vimeo");
        }

        //Panorama
        v = selAll(".iframe-player");
        for (n = 0; n < v.length; n++) {
            this.embedItem(v[n] as HTMLElement, "iframe");
        }
    }


    // Erzeugt je nach Typ ein entsprechendes IFrame
    public embedItem(el: HTMLElement, type: string) {
        if (type === "youtube") {
            let div = document.createElement("div");
            div.setAttribute("data-id", el.dataset.id);

            let img = document.createElement("img");
            if (el.offsetWidth > 700) {
                img.src = "https://i.ytimg.com/vi/ID/maxresdefault.jpg".replace("ID", el.dataset.id);
                img.setAttribute("fallback", "https://i.ytimg.com/vi/ID/hqdefault.jpg".replace("ID", el.id));
                img.alt = "YoutTube";
                img.onload = () => {
                    if (img.naturalHeight === 90 && img.naturalWidth === 120 && img.src !== img.getAttribute("fallback")) {
                        img.src = null;
                        img.src = img.getAttribute("fallback");
                    }
                };
            } else {
                img.src = "https://i.ytimg.com/vi/ID/hqdefault.jpg".replace("ID", el.dataset.id);
            }
            let play = document.createElement("div");
            play.classList.add("play");
            div.appendChild(img);
            div.appendChild(play);

            div.onclick = () => this.createVideo(true, div);
            el.appendChild(div);
        } else if (type === "vimeo") {
            getJSON('https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/' + el.dataset.id, (data) => {
                let div, img, play;
                div = document.createElement("div");
                div.setAttribute("data-id", el.dataset.id);

                img = document.createElement("img");
                img.src = data.thumbnail_url;
                play = document.createElement("div");
                play.classList.add("play");
                div.appendChild(img);
                div.appendChild(play);

                div.onclick = () => this.createVideo(false, div);
                sel('.vimeo-player[data-id="' + el.dataset.id + '"]').appendChild(div);
            }, null);
        } else if (type === "iframe") {
            let div, img, play;
            div = document.createElement("div");
            div.setAttribute("data-src", el.dataset.id);

            img = document.createElement("img");
            img.src = el.dataset.thumb;
            play = document.createElement("div");
            play.classList.add("play");
            div.appendChild(img);
            div.appendChild(play);

            div.onclick = () => this.createIframe(div);
            el.appendChild(div);
        }
    }

    // IFrame Code für Youtube und Vimeo
    private createVideo(yt, scope) {
        let iframe = document.createElement("iframe");
        let embed = yt ? "https://www.youtube.com/embed/ID?autoplay=1" : "https://player.vimeo.com/video/ID?autoplay=1";
        iframe.setAttribute("src", embed.replace("ID", scope.dataset.id));
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        scope.parentNode.replaceChild(iframe, scope);
    }

    // IFrame Code für allgemine IFrames
    private createIframe(scope) {
        let iframe = document.createElement("iframe");
        iframe.setAttribute("src", scope.dataset.src);
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        scope.parentNode.replaceChild(iframe, scope);
    }
}

var embedded: Embedded;
(function () {
    embedded = new Embedded();
})();