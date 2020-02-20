"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var defer_load_directive_1 = require("./defer-load.directive");
var DeferLoadModule = /** @class */ (function () {
    function DeferLoadModule() {
    }
    DeferLoadModule = tslib_1.__decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            declarations: [defer_load_directive_1.DeferLoadDirective],
            exports: [defer_load_directive_1.DeferLoadDirective]
        })
    ], DeferLoadModule);
    return DeferLoadModule;
}());
exports.DeferLoadModule = DeferLoadModule;
//# sourceMappingURL=defer-load.module.js.map