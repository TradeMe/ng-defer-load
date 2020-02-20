"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var DeferLoadDirective = /** @class */ (function () {
    function DeferLoadDirective(_element, _zone, platformId) {
        var _this = this;
        this._element = _element;
        this._zone = _zone;
        this.platformId = platformId;
        this.preRender = true;
        this.fallbackEnabled = true;
        /** Disables lazy loading */
        this.eagerLoad = false;
        this.deferLoad = new core_1.EventEmitter();
        this.checkForIntersection = function (entries) {
            entries.forEach(function (entry) {
                if (_this.checkIfIntersecting(entry)) {
                    _this.load();
                    if (_this._intersectionObserver && _this._element.nativeElement) {
                        _this._intersectionObserver.unobserve((_this._element.nativeElement));
                    }
                }
            });
        };
        this.onScroll = function () {
            if (_this.isVisible()) {
                _this._zone.run(function () { return _this.load(); });
            }
        };
    }
    DeferLoadDirective_1 = DeferLoadDirective;
    DeferLoadDirective.getScrollPosition = function () {
        // Getting screen size and scroll position for IE
        return (window.scrollY || window.pageYOffset)
            + (document.documentElement.clientHeight || document.body.clientHeight);
    };
    DeferLoadDirective.prototype.ngOnInit = function () {
        if (this.eagerLoad
            || (common_1.isPlatformServer(this.platformId) && this.preRender)
            || (common_1.isPlatformBrowser(this.platformId) && !this.fallbackEnabled && !this.hasCompatibleBrowser())) {
            this.load();
        }
    };
    DeferLoadDirective.prototype.ngAfterViewInit = function () {
        if (this._loaded) {
            return;
        }
        if (common_1.isPlatformBrowser(this.platformId)) {
            if (this.hasCompatibleBrowser()) {
                this.registerIntersectionObserver();
                if (this._intersectionObserver && this._element.nativeElement) {
                    this._intersectionObserver.observe((this._element.nativeElement));
                }
            }
            else if (this.fallbackEnabled) {
                this.addScrollListeners();
            }
        }
    };
    DeferLoadDirective.prototype.hasCompatibleBrowser = function () {
        var hasIntersectionObserver = 'IntersectionObserver' in window;
        var userAgent = window.navigator.userAgent;
        var matches = userAgent.match(/Edge\/(\d*)\./i);
        var isEdge = !!matches && matches.length > 1;
        var isEdgeVersion16OrBetter = isEdge && (!!matches && parseInt(matches[1], 10) > 15);
        return hasIntersectionObserver && (!isEdge || isEdgeVersion16OrBetter);
    };
    DeferLoadDirective.prototype.ngOnDestroy = function () {
        this.removeListeners();
    };
    DeferLoadDirective.prototype.registerIntersectionObserver = function () {
        var _this = this;
        if (!!this._intersectionObserver) {
            return;
        }
        this._intersectionObserver = new IntersectionObserver(function (entries) {
            _this.checkForIntersection(entries);
        }, {});
    };
    DeferLoadDirective.prototype.checkIfIntersecting = function (entry) {
        // For Samsung native browser, IO has been partially implemented where by the
        // callback fires, but entry object is empty. We will check manually.
        if (entry && entry.time) {
            return entry.isIntersecting && entry.target === this._element.nativeElement;
        }
        return this.isVisible();
    };
    DeferLoadDirective.prototype.load = function () {
        this._loaded = true;
        this.removeListeners();
        this.deferLoad.emit();
    };
    DeferLoadDirective.prototype.addScrollListeners = function () {
        var _this = this;
        if (this.isVisible()) {
            this.load();
            return;
        }
        this._zone.runOutsideAngular(function () {
            _this._scrollSubscription = rxjs_1.fromEvent(window, 'scroll')
                .pipe(operators_1.debounceTime(50))
                .subscribe(_this.onScroll);
        });
    };
    DeferLoadDirective.prototype.removeListeners = function () {
        if (this._scrollSubscription) {
            this._scrollSubscription.unsubscribe();
        }
        if (this._intersectionObserver) {
            this._intersectionObserver.disconnect();
        }
    };
    DeferLoadDirective.prototype.isVisible = function () {
        var scrollPosition = DeferLoadDirective_1.getScrollPosition();
        var elementOffset = this._element.nativeElement.offsetTop;
        return elementOffset <= scrollPosition;
    };
    var DeferLoadDirective_1;
    tslib_1.__decorate([
        core_1.Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DeferLoadDirective.prototype, "preRender", void 0);
    tslib_1.__decorate([
        core_1.Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DeferLoadDirective.prototype, "fallbackEnabled", void 0);
    tslib_1.__decorate([
        core_1.Input(),
        tslib_1.__metadata("design:type", Boolean)
    ], DeferLoadDirective.prototype, "eagerLoad", void 0);
    tslib_1.__decorate([
        core_1.Output(),
        tslib_1.__metadata("design:type", core_1.EventEmitter)
    ], DeferLoadDirective.prototype, "deferLoad", void 0);
    DeferLoadDirective = DeferLoadDirective_1 = tslib_1.__decorate([
        core_1.Directive({
            selector: '[deferLoad]'
        }),
        tslib_1.__param(2, core_1.Inject(core_1.PLATFORM_ID)),
        tslib_1.__metadata("design:paramtypes", [core_1.ElementRef,
            core_1.NgZone,
            Object])
    ], DeferLoadDirective);
    return DeferLoadDirective;
}());
exports.DeferLoadDirective = DeferLoadDirective;
//# sourceMappingURL=defer-load.directive.js.map