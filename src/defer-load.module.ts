import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DeferredLoaderDirective} from './defer-load.directive';
@NgModule({
    imports: [CommonModule],
    declarations: [DeferredLoaderDirective],
    exports: [DeferredLoaderDirective]
})
export class DeferLoadModule { }
