import { Injectable } from '@angular/core';
import { BaseStyle } from '@selisedev/primus-beta/core/base';

const classes = {
    root: 'p-inputgroupaddon'
};

@Injectable()
export class InputGroupAddonStyle extends BaseStyle {
    name = 'inputgroupaddon';

    classes = classes;
}
