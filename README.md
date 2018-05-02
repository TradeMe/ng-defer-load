# defer-load
*defer-load* is an Angular directive to load elements lazily. 

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

## Demo

Demo of defer-load in use is available [here](https://stackblitz.com/edit/angular-defer-load).

## License

Released under the [MIT license](https://github.com/TradeMe/ng-defer-load/blob/master/README.md).
