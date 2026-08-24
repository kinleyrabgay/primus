import { Injectable } from '@angular/core';
import { BaseStyle } from '@primus/core/base';

@Injectable({ providedIn: 'root' })
export class BaseComponentStyle extends BaseStyle {
    name = 'common';
}
