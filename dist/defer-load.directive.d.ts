import { AfterViewInit, ElementRef, EventEmitter, NgZone, OnDestroy, OnInit } from '@angular/core';
export declare class DeferLoadDirective implements OnInit, AfterViewInit, OnDestroy {
    private _element;
    private _zone;
    private platformId;
    private static getScrollPosition;
    preRender: boolean;
    fallbackEnabled: boolean;
    /** Disables lazy loading */
    eagerLoad: boolean;
    deferLoad: EventEmitter<any>;
    private _intersectionObserver?;
    private _scrollSubscription?;
    private _loaded?;
    constructor(_element: ElementRef, _zone: NgZone, platformId: Object);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    hasCompatibleBrowser(): boolean;
    ngOnDestroy(): void;
    private registerIntersectionObserver;
    private checkForIntersection;
    private checkIfIntersecting;
    private load;
    private addScrollListeners;
    private removeListeners;
    private onScroll;
    private isVisible;
}
