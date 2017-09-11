# SimpleBox
A more or less personal project but you can use it if you like it.
You can find it on Bower, too.

## Live Example: http://lumion3d.de/galerie

## Code Examples:

* Show the same image in a viewbox (short):
```
    <img data-imageViewer data-target="~/image.png" src="/thumbnail.png" title="Description" />
```

* Show an image in the viewbox (long):
```
    <a data-imageViewer href="~/image.png" title="Description">
        <img src="~/thumb.png" />
    </a>
```

* Show video in viewbox (supports youtube and vimeo):
```
    <a data-imageViewer href="https://noJavascript.Link" data-target="k3tQaWxaLzM" data-type="youtube">
        <img src="~/thumb.png" />
    </a>
```

* Show iframe content in the viewbox (+optional loading-thumb):
```
    <a data-imageViewer data-type="iframe" data-target="https://www.google.de/" data-thumb="~/loading-thumb.png">
        <img src="~/thumb.png" />
    </a>
```

* Show iframe content without loading (default mode if not image: just display/load any kind of target):
```
    <a data-imageViewer data-target="https://www.google.de/">
        <img src="~/thumb.png" />
    </a>
```

* Show html content in the viewbox:
```
    <a data-target="#html" data-imageViewer title="4Players">
        <img src="~/thumb.png" />
    </a>
    <div id="html" hidden>
        <span>Hello World!</span>
    </div>
```

* Grouping things (for example for galleries):
```
    <a data-imageViewer="group1" href="~/image1.png" title="Description 1">
        <img src="~/thumb.png" />
    </a>
    <div data-imageViewer="group1" data-target="~/image2.png" title="Description 2" ></div>
    <div data-imageViewer="group1" data-target="k3tQaWxaLzM" data-type="youtube" title="Description 3" ></div>
```
