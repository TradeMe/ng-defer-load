import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, EventEmitter, Inject, Input, NgZone, OnDestroy, Output, PLATFORM_ID } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';
import { DeferLoadService, IntersectionState } from './defer-load.service';

const NOT_GIVEN = 'not given';

@Directive({
    selector: '[deferLoad]'
})
export class DeferLoadDirective implements AfterViewInit, OnDestroy {

    @Input() public preRender: boolean = true;
    @Output() public deferLoad: EventEmitter<any> = new EventEmitter();

    private _intersectionObserver?: IntersectionObserver;
    private _subscription = new Subscription();

    private _init = false;
    private _url = NOT_GIVEN;
    
    /* cases for 'url' setter:
    1a. null (OnInit): do nothing in ngAfterViewInit
    1b. urla (OnInit): register promptly or manually in ngAfterViewInit
    2. null -> urla (runtime): register promptly
    3. urla -> null (runtime): do nothing
    4. urla -> urlb (runtime): do nothing
    */
    @Input()
    set url(value: string) { // optional
        if (value === this._url) return;
    
        if (this._init) {
            if (!this._url && value) {
                this.doRegister();
                if (this._service.isDevMode) console.log('case 2.');
            } else if (this._url && !value) {
                if (this._service.isDevMode) console.log('case 3.');
            } else if (this._url && this._url !== value) {
                if (this._service.isDevMode) console.log('case 4.');
            }
        }
    
        this._url = (value && value.trim()) || '';
    }
  
    @Input() index = -1;
    get manual() { return this._element.nativeElement.getAttribute('manualRegister') !== null; }

    constructor (private _service: DeferLoadService,
        private _element: ElementRef,
        private _zone: NgZone,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    public ngAfterViewInit () {
        if (!this._url) {
            if (this._service.isDevMode) console.log('deferLoad never');
        } else if (this.manual) { // register later
            const sub = this._service.announcedOrder.pipe(first()).subscribe(_ => this.doRegister());
            this._subscription.add(sub);
        } else { // register now (default)
            this.doRegister();
        }

        this._init = true;
    }

    public hasCompatibleBrowser (): boolean {
        const hasIntersectionObserver = 'IntersectionObserver' in window;
        const userAgent = window.navigator.userAgent;
        const matches = userAgent.match(/Edge\/(\d*)\./i);

        const isEdge = !!matches && matches.length > 1;
        const isEdgeVersion16OrBetter = isEdge && (!!matches && parseInt(matches[1], 10) > 15);

        return hasIntersectionObserver && (!isEdge || isEdgeVersion16OrBetter);
    }

    public ngOnDestroy () {
        this.removeListeners();
    }

    private doRegister() {
        if (isPlatformBrowser(this.platformId)) {
            if (this.hasCompatibleBrowser()) {
                this.registerIntersectionObserver();
                if (this._intersectionObserver && this._element.nativeElement) {
                    this._intersectionObserver.observe(<Element>(this._element.nativeElement));
                    if (this._service.isDevMode) console.log('deferLoad register');
                }
            } else {
                this.addScrollListeners();
                if (this._service.isDevMode) console.log('deferLoad listener');
            }
        } else {
            if (this.preRender) {
                this.load(IntersectionState.Prerender);
                if (this._service.isDevMode) console.log('deferLoad prerender');
            }
        }
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
            const state = this.checkIfIntersecting(entry);
            if (state > IntersectionState.None) {
                this.load(state);
                if (this._intersectionObserver && this._element.nativeElement) {
                    this._intersectionObserver.unobserve(<Element>(this._element.nativeElement));
                }
            }
        });
    }

    private checkIfIntersecting (entry: IntersectionObserverEntry): IntersectionState {
        // For Samsung native browser, IO has been partially implemented where by the
        // callback fires, but entry object is empty. We will check manually.
        if (entry && 'isIntersecting' in entry) {
            if ((<any>entry).isIntersecting && entry.target === this._element.nativeElement) {
                return IntersectionState.Intersecting;
            }
        }
        if (this.isVisible()) {
            return IntersectionState.Visible;
        }
        return IntersectionState.None; // not intersecting
    }

    private load (state: IntersectionState): void {
        this.removeListeners();
        if (this.index === -1) { // [index] input not given
            this.deferLoad.emit(state);
        } else {
            this._service.announceIntersection({ index: this.index, state });
        }
    }

    private addScrollListeners () {
        if (this.isVisible()) {
            this.load(IntersectionState.Visible);
            return;
        }
        this._zone.runOutsideAngular(() => {
            const sub = fromEvent(window, 'scroll')
                .pipe(debounceTime(50))
                .subscribe(this.onScroll);
            this._subscription.add(sub);
        });
    }

    private removeListeners () {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }

        if (this._intersectionObserver) {
            this._intersectionObserver.disconnect();
        }
    }

    private onScroll = () => {
        if (this.isVisible()) {
            this._zone.run(() => this.load(IntersectionState.Visible));
        }
    }

    private isVisible () {
        let scrollPosition = this.getScrollPosition();
        let elementOffset = this._element.nativeElement.offsetTop;
        return elementOffset <= scrollPosition;
    }

    private getScrollPosition () {
        // Getting screen size and scroll position for IE
        return (window.scrollY || window.pageYOffset)
            + (document.documentElement.clientHeight || document.body.clientHeight);
    }
}
