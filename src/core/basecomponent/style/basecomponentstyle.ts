import { Injectable } from '@angular/core';
import { BaseStyle } from '@selisedev/primus-beta/core/base';

@Injectable({ providedIn: 'root' })
export class BaseComponentStyle extends BaseStyle {
    name = 'common';
}
