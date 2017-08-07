////#region Misc
var sel = (selector: string) => document.querySelector(selector) as HTMLElement;
var selAll = (selector: string) => document.querySelectorAll(selector) as NodeListOf<HTMLElement>;

// Eine ForEach Erweiterung für alle Enumerables
function forEach(callback: (index: number, value: Object) => void, scope?) {
    let _this: Array<any> = this ? this : scope;
    for (var i = 0; i < _this.length; i++) {
        callback.call(scope, i, _this[i]); // passes back stuff we need
    }
};

// Direkte ForEach Erweiterung für NodeList
interface NodeList {
    forEach(callback: (index: number, value: Node) => void, scope?): void;
}
interface NodeListOf<TNode extends Node> {
    forEach(callback: (index: number, value: TNode) => void, scope?): void;
}
(<any>NodeList.prototype).forEach = forEach;

// Berechnet den offset zum Body
function offset(obj: HTMLElement): { x: number, y: number } {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent as HTMLElement);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

// Json request
function makeRequest(type: string, path: string, success: (result: string) => void, error: (xhr: XMLHttpRequest) => void) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(xhr.responseText);
            } else {
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

function goTo(selector: string | number, yOffset: number = 50) {
    // Berechnung
    let start = window.scrollY;
    let target = Math.max((typeof selector === "number" ? selector : offset(sel(selector)).y) - yOffset, 0);
    let dist = target - start;
    let scrollStep = dist / 20;
    let lastPos = -1;
    let finished = false;
    // Manche Browser setzten kurz nach dem laden selbst die Pos,
    // daher die aktuelle Position zweimal überprüfen
    let twice = 0;
    this.userScroll = false;
    let bla = [];

    //Update bis Ziel, Seitenende oder User hat gescrollt
    let scrollInterval = setInterval(() => {
        if (finished || this.userScroll) {
            if (document.readyState === "complete" || this.userScroll) {
                clearInterval(scrollInterval);
            }

            if (!this.userScroll) {
                window.scrollTo(0, target);
            }
        }
        else if (!(target < start ? window.scrollY <= target : window.scrollY >= target) && (lastPos !== window.scrollY || twice++ < 1)) {
            lastPos = window.scrollY;
            window.scrollTo(0, window.scrollY + scrollStep);
        }
        else {
            finished = true
        }
    }, 1000 / 59.9);
}

// Erkennung, ob User selbst scrollt
if (window.addEventListener) {
    document.addEventListener('DOMMouseScroll', () => userScroll = true, <any>{ passive: true });
}
//for IE/OPERA etc
document.addEventListener('mousewheel', () => userScroll = true, <any>{ passive: true });

////#endregion Scrolling

////#region CounterUp
var counterUpStarted = false;

function counterUp() {
    let items = selAll('[data-counterup]');
    let finished = false;
    if (items.length > 0) {
        let firstPos = offset(items[0]).y;

        // Wenn im Bild, dann anfangen zu zählen
        window.addEventListener('scroll', () => {
            if (!counterUpStarted) {
                if (window.scrollY + window.innerHeight > firstPos) {
                    counterUpStarted = true;
                    // Auf 0 setzten
                    items.forEach((i, item) => {
                        let num = parseInt(item.innerText);
                        item.innerText = item.innerText.replace(num.toString(), "0");
                    });

                    // Schrittweise hoch zählen
                    let currentStep = 0.01;
                    let counterInterval = setInterval(() => {
                        for (var i = 0; i < items.length; i++) {
                            let item = items[i];
                            let target = parseInt(item.getAttribute("data-counterup"));
                            let current = parseInt(item.innerText);
                            let newVal = target * currentStep;
                            if (newVal >= target) {
                                finished = true;
                                newVal = target;
                            }
                            item.innerText = item.innerText.replace(current.toFixed(0), newVal.toFixed(0))
                        }
                        currentStep += 0.01;

                        if (finished) {
                            clearInterval(counterInterval);
                        }
                    }, 1000 / 59.9)
                }
            }
        });
    }
}

////#endregion Scrolling