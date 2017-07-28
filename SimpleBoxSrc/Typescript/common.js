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