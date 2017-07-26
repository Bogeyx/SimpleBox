////#region Misc
var sel = (selector: string) => document.querySelector(selector) as HTMLElement;
var selAll = (selector: string) => document.querySelectorAll(selector) as NodeListOf<HTMLElement>;

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
function getJSON(path: string, success: (data: any) => void, error: (xhr: XMLHttpRequest) => void) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}
////#endregion Misc



////#region Scrolling
var userScroll = false;

function goTo(selector: string | number) {
    // Berechnung
    let target = Math.max((typeof selector === "number" ? selector : offset(sel(selector)).y) - 50, 0);
    let dist = target - window.scrollY;
    let scrollStep = (dist/20) * (target < window.scrollY ? -1 : 1);
    let lastPos = -1;    
    let finished = false;
    // Manche Browser setzten kurz nach dem laden selbst die Pos,
    // daher die aktuelle Position zweimal überprüfen
    let twice = 0;

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
        else if (!(window.scrollY > target - scrollStep && window.scrollY < target + scrollStep) && (lastPos !== window.scrollY || twice++ < 1)) {
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
    document.addEventListener('DOMMouseScroll', () => userScroll = true, false);
}
//for IE/OPERA etc
document.addEventListener('mousewheel', () => userScroll = true);

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
                    for (var i = 0; i < items.length; i++) {
                        let num = parseInt(items[i].innerText);
                        items[i].innerText = items[i].innerText.replace(num.toString(), "0");
                    }

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
                    }, 1000/ 59.9)
                }
            }
        });
    }
}

////#endregion Scrolling