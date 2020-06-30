# ng-defer-load
*ng-defer-load* is an Angular directive to load elements lazily. 

It uses [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to check if an element is in viewport and falls back to scroll detection mechanism for unsupported browsers.

## Installation

Using npm:
```shell
$ npm i @trademe/ng-defer-load
```
## Usage

1. Import `DeferLoadModule` into the module corresponding to your component

2. Use the directive with the element you wish to lazy load
```html
  <div
    (deferLoad)="showMyElement=true">
    <my-element
       *ngIf=showMyElement>
      ...
    </my-element>
</div>
```
*Note:* You might want to have a loading state for your element with approximately same height as the element.

## Server Side Rendering

`ng-defer-load` supports Server Side Rendering from version 1.1.0

It loads the element on the server by default supporting Search Engine Optimization. If you do not want to pre-render the element in server, you can set `preRender` to false on the element as below:

```html
  <div
    [preRender]="false"
    (deferLoad)="showMyElement=true">
    <my-element
       *ngIf=showMyElement>
      ...
    </my-element>
</div>
```

## Fall back support

`ng-defer-load` supports a fall back in browsers that do not support the IntersectionObserver API. This uses the scroll position and the element's offset. This is enabled by default.

If you do not want to allow this fallback, and would prefer the browser to just render the element regardless, you can set `fallbackEnabled` to false on the element as below:

```html
  <div
    [fallbackEnabled]="false"
    (deferLoad)="showMyElement=true">
    <my-element
       *ngIf=showMyElement>
      ...
    </my-element>
</div>
```

## Demo

Demo of *ng-defer-load* in use is available [here](https://stackblitz.com/edit/ng-defer-load).

## License

Released under the [MIT license](https://github.com/TradeMe/ng-defer-load/blob/master/README.md).

## Release notes

v1.0.1 - Initial version

v1.1.0 - Supports Universal - Server Side Rendering

v2.0.0 - Supports Angular 6

v3.0.0 - Supports Angular 7

v3.1.0 - Made it possible to switch off scroll fallback

v8.0.0 - Supports Angular 8/9

v8.1.0 - Supports more package formats (using ng-packagr)

v8.2.0 - Added option to remove listeners after load

v8.2.1 - Fix for IE11 and older browsers