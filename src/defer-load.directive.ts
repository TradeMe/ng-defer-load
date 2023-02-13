import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    PLATFORM_ID
} from '@angular/core';

@Directive({
    selector: '[deferLoad]'
})
export class DeferLoadDirective implements OnInit, AfterViewInit, OnDestroy {

    @Input() public preRender: boolean = true;
    @Input() public removeListenersAfterLoad: boolean = true;
    @Output() public deferLoad: EventEmitter<any> = new EventEmitter();

    private _intersectionObserver?: IntersectionObserver;

    constructor (
        private _element: ElementRef,
        private _zone: NgZone,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    public ngOnInit () {
        if ((isPlatformServer(this.platformId) && this.preRender)) {
            this.load();
        }
    }

    public ngAfterViewInit () {
        if (isPlatformBrowser(this.platformId)) {
            this.registerIntersectionObserver();
            if (this._intersectionObserver && this._element.nativeElement) {
                this._intersectionObserver.observe(<Element>(this._element.nativeElement));
            }
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
            if (this.checkIfIntersecting(entry)) {
                this.load();
                if (this._intersectionObserver && this._element.nativeElement) {
                    this._intersectionObserver.unobserve(<Element>(this._element.nativeElement));
                }
            }
        });
    }

    private checkIfIntersecting (entry: IntersectionObserverEntry) {
        // For Samsung native browser, IO has been partially implemented where by the
        // callback fires, but entry object is empty. We will check manually.
        if (entry && entry.time) {
            return (<any>entry).isIntersecting && entry.target === this._element.nativeElement;
        }
        return this.isVisible();
    }

    private load (): void {
        if (this.removeListenersAfterLoad) {
            this.removeListeners();
        }
        this.deferLoad.emit();
    }

    private removeListeners () {
        this._intersectionObserver?.disconnect();
    }

    private isVisible () {
        let scrollPosition = this.getScrollPosition();
        let elementOffset = this._element.nativeElement.getBoundingClientRect().top + window.scrollY;
        return elementOffset <= scrollPosition;
    }

    private getScrollPosition () {
        return window.scrollY + (document.documentElement.clientHeight || document.body.clientHeight);
    }
}
