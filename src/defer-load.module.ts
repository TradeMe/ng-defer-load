import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DeferredLoaderDirective} from './defer-load.directive';
@NgModule({
    imports: [CommonModule],
    exports: [DeferredLoaderDirective],
    declarations: [DeferredLoaderDirective]
})
export class DeferLoadModule { }
