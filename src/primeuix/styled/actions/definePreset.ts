import { deepMerge } from '@selisedev/primus-beta/primeuix/utils';

export default function definePreset<T extends Record<string, unknown>>(...presets: T[]): T {
    return deepMerge(...presets) as T;
}
