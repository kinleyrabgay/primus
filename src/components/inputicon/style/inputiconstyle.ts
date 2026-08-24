import { Injectable } from '@angular/core';
import { BaseStyle } from '@selisedev/primus-beta/core/base';

const classes = {
    root: 'p-inputicon'
};

@Injectable()
export class InputIconStyle extends BaseStyle {
    name = 'inputicon';

    classes = classes;
}
