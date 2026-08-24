import { deepMerge } from '@selisedev/primus-beta/primeuix/utils';
import Theme from '../config/index';

export default function updatePreset<T extends Record<string, unknown>>(...presets: T[]): T {
    const newPreset = deepMerge(Theme.getPreset(), ...presets);

    Theme.setPreset(newPreset);

    return newPreset as T;
}
