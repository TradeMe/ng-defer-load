import {AfterViewInit, Directive, ElementRef, EventEmitter, NgZone, OnDestroy, Output} from '@angular/core';
import 'rxjs/add/observable/fromEvent';
import {Observable} from 'rxjs/Observable';
import {debounceTime} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';

@Directive({
    selector: '[onDeferredLoad]'
})
export class DeferredLoaderDirective implements AfterViewInit, OnDestroy {

    private static makeGuid (): string {
        function s4 () {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    private static getClientHeight (): number {
        return document.documentElement.clientHeight;
    }

    @Output() public tmOnDeferLoad: EventEmitter<any> = new EventEmitter();

    private _intersectionObserver? : IntersectionObserver;
    private _scrollSubscription?: Subscription;

    constructor (
        private _element: ElementRef,
        private _zone: NgZone
    ) {}

    public ngAfterViewInit () {
        if ('IntersectionObserver' in window) {
            this.registerIntersectionObserver();
            this._element.nativeElement.id = DeferredLoaderDirective.makeGuid();
            if (this._intersectionObserver) {
                this._intersectionObserver.observe(<Element>(this._element.nativeElement));
            }
        } else {
            // add scroll watch if intersection observer is not available
            this.addScrollListeners();
        }
    }

    public ngOnDestroy () {
        this.removeListeners();
    }

    private registerIntersectionObserver (): void {
        if (!!this._intersectionObserver) {
            return;
        }
        this._intersectionObserver = new IntersectionObserver(entries => {
            this.checkForIntersection(entries);
        }, {});
    }

    private checkForIntersection = (entries: Array<IntersectionObserverEntry>) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
            if ((<any>entry).isIntersecting && entry.target === this._element.nativeElement) {
                this.load();
                if (this._intersectionObserver) {
                    this._intersectionObserver.unobserve(<Element>(this._element.nativeElement));
                }
            }
        });
    }

    private load (): void {
        this.removeListeners();
        this.tmOnDeferLoad.emit();
    }

    private addScrollListeners () {
        if (this.isVisible()) {
            this.load();
            return;
        }
        this._zone.runOutsideAngular(() => {
            this._scrollSubscription = Observable.fromEvent(window, 'scroll')
                .pipe(debounceTime(50))
                .subscribe(this.onScroll);
        });
    }

    private removeListeners () {
        if (this._scrollSubscription) {
            this._scrollSubscription.unsubscribe();
        }

        if (this._intersectionObserver) {
            this._intersectionObserver.disconnect();
        }
    }

    private onScroll = () => {
        if (this.isVisible()) {
            this._zone.run(() => this.load());
        }
    }

    private isVisible () {
        let scrollPosition = window.scrollY + DeferredLoaderDirective.getClientHeight();
        let elementOffset = this._element.nativeElement.offsetTop;
        return elementOffset <= scrollPosition;
    }
}
