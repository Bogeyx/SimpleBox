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

class Gallery {
    public items: HTMLElement[] = [];
    private _currentItems: HTMLElement[];
    private _currentIndex = 0;
    // Falls type=ref, dann ist dies das Ursprungselement
    private _originElement: HTMLElement;
    private _dimension: { width: number, height: number };

    // Elemente fürs Markup
    private _main: HTMLDivElement;
    private _content: HTMLDivElement;
    private _captionContent: HTMLSpanElement;


    // Initialisiert Markup und Events 
    constructor(elements: NodeListOf<Element>) {
        let instance = this;

        for (var i = 0; i < elements.length; i++) {
            let item = elements[i] as HTMLElement;
            item.onclick = function (ev: MouseEvent) {
                instance.onItemClicked(this, ev);
                ev.preventDefault();
                ev.stopPropagation();
            };
            this.items.push(item);
        }

        this.initMarkup();
        window.addEventListener("resize", () => {
            this.updateImageSize();
        });
    }


    // Initialisiert Markup
    private initMarkup() {
        let body = sel("body");
        let imageViewer = document.createElement("div");
        imageViewer.classList.add("imageViewer");
        this._main = imageViewer;

        let wrapper = document.createElement("div");
        wrapper.classList.add("imageViewer-wrapper");
        //wrapper.onclick = () => this.close();
        imageViewer.appendChild(wrapper);

        let content = document.createElement("div");
        content.classList.add("imageViewer-content");
        let container = document.createElement("div");
        container.classList.add("container");
        content.appendChild(container);
        this._content = container;
        this._content.onclick = () => this.close();
        wrapper.appendChild(content);

        if (this.items.length > 1) {
            let prev = document.createElement("span");
            prev.classList.add("imageViewer-prev");
            let prevContent = document.createElement("span");
            prevContent.innerText = "<";
            prev.onclick = () => this.prev();
            prev.appendChild(prevContent);
            wrapper.appendChild(prev);

            let next = document.createElement("span");
            let nextContent = document.createElement("span");
            nextContent.innerText = ">";
            next.onclick = () => this.next();
            next.appendChild(nextContent);
            next.classList.add("imageViewer-next");
            wrapper.appendChild(next);
        }

        let close = document.createElement("span");
        close.innerText ="X";
        close.classList.add("imageViewer-close");
        close.onclick = () => this.close();
        wrapper.appendChild(close);

        let caption = document.createElement("div");
        caption.classList.add("imageViewer-caption");
        let captionContent = document.createElement("span");
        caption.appendChild(captionContent);
        this._captionContent = captionContent;
        imageViewer.appendChild(caption);

        body.appendChild(imageViewer);
    }

    // Wenn ein Galerie Item angeklickt wurde
    private onItemClicked(el: HTMLElement, ev: MouseEvent): any {
        this._currentItems = this.items.filter(i => i.getAttribute("data-imageViewer") === el.getAttribute("data-imageViewer"));
        this._currentIndex = this._currentItems.indexOf(el);

        this.loadContent();        

        this._main.style.display = "block";
    }

    // Lädt den Content abhängig vom Typ
    private loadContent() {
        this._dimension = null;

        // Typ und Link ermitteln
        let el = this._currentItems[this._currentIndex];        
        let link = el.getAttribute("data-target");
        if (!link) {
            if (el instanceof HTMLAnchorElement) {
                link = el.href;
            } else if (el instanceof HTMLImageElement) {
                link = el.src;
            } else {
                throw new Error("No data-target");
            }
        }
        let type = el.getAttribute("data-type");
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
            let tmpImage = new Image();
            tmpImage.src = link;

            tmpImage.onload = (e) => {
                this._dimension = {} as any;
                this._dimension.width = tmpImage.width;
                this._dimension.height = tmpImage.height;
                this.updateImageSize();
            };

            this._content.parentElement.style.backgroundImage = "url(" + link + ")";
            this._content.innerHTML = "";
        } else if (type === "youtube") {
            let player = document.createElement("div");
            player.classList.add("youtube-player");
            player.setAttribute("data-id", link);
            player.setAttribute("title", el.title);

            this.updateContainer(player);
            embedded.embedItem(player, "youtube");
        } else if (type === "vimeo") {
            let player = document.createElement("div");
            player.classList.add("vimeo-player");
            player.setAttribute("data-id", link);
            player.setAttribute("title", el.title);

            this.updateContainer(player);
            embedded.embedItem(player, "vimeo");
        } else if (type === "iframe") {
            let player = document.createElement("div");
            let thumb = el instanceof HTMLImageElement ? el.src : el.getAttribute("data-thumb");
            player.classList.add("iframe-player");
            player.setAttribute("data-id", link);
            player.setAttribute("title", el.title);
            player.setAttribute("data-thumb", thumb);

            this.updateContainer(player);
            embedded.embedItem(player, "iframe");
        } else if (type === "ref") {
            let div = document.createElement("div");
            link = "#" + link.split('#').slice(-1)[0];
            this._originElement = sel(link) as HTMLElement;

            if (!this._originElement) {
                div.innerHTML = "Konnte nicht geladen werden!";         
            }

            for (var i = 0; i < this._originElement.children.length; i++) {
                div.appendChild(this._originElement.children[i]);
            }

            this.updateContainer(div);
        } else {
            let iframe = document.createElement("iframe");
            iframe.src = link;

            this.updateContainer(iframe);
        }

        // Untertitel Text ermitteln und setzten
        let captionText = el.getAttribute("title");
        if (!captionText) {
            captionText = el.getAttribute("name");
            if (!captionText) {
                captionText = el.getAttribute("alt");
            }
        }

        if (captionText) {
            this._captionContent.innerText = captionText;
        } else {
            this._captionContent.innerText = "";
        }
    }

    // Pass die Größe des Bildes an die momentane Auflösung an
    private updateImageSize() {
        if (this._dimension) {
            if (this._dimension.width < this._content.parentElement.clientWidth || this._dimension.height < this._content.parentElement.clientHeight) {
                this._content.parentElement.style.backgroundSize = this._dimension.width + "px " + this._dimension.height + "px";
            } else {
                this._content.parentElement.style.backgroundSize = "inherit";
            }
        } else {
            this._content.parentElement.style.backgroundSize = "inherit";
        }
    }

    // Setzt den neuen Content
    private updateContainer(el: HTMLElement) {
        this._content.parentElement.style.backgroundImage = "";

        if (el instanceof HTMLIFrameElement) {
            this._content.classList.add("full");
        } else {
            this._content.classList.remove("full");
        }

        let oldChild = this._content.children.item(0);
        if (oldChild) {
            this._content.removeChild(oldChild);
        }

        this._content.appendChild(el);
    }

    // Next geklickt
    private next() {
        if (++this._currentIndex === this._currentItems.length) {
            this._currentIndex = 0;
        }

        this.loadContent();
    }

    // Vorher geklickt
    private prev() {
        if (--this._currentIndex < 0) {
            this._currentIndex = this._currentItems.length - 1;
        }

        this.loadContent();
    }

    // Schließen geklickt
    private close() {
        if (this._originElement) {
            for (var i = 0; i < this._content.children[0].children.length; i++) {
                this._originElement.appendChild(this._content.children[0].children[i]);
            }

            this._originElement = null;
        }

        let oldChild = this._content.children.item(0);
        if (oldChild) {
            this._content.removeChild(oldChild);
        }

        this._main.style.display = "none";
    }
}

(function () {
    let elements = selAll('[data-imageviewer]');
    if (elements.length > 0) {
        var gallery = new Gallery(elements);
    }

    let descriptionElements = selAll('.img-description img');
    if (descriptionElements.length > 0) {
        for (var i = 0; i < descriptionElements.length; i++) {
            let img = descriptionElements[i] as HTMLImageElement;
            if (!img.complete) {
                img.onload = (el) => {

                    img.parentElement.classList.add("loaded");
                };
            } else {
                img.parentElement.classList.add("loaded");
            }
        }
    }
})();