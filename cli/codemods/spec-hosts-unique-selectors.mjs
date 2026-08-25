#!/usr/bin/env node
/**
 * Give every selector-less spec host a unique selector.
 *
 *   node cli/codemods/spec-hosts-unique-selectors.mjs [--dir src] [--dry]
 *
 * Angular derives a component's ID from its selector plus template. Hosts written
 * without a selector all report as 'ng-component', and two such hosts in one spec file
 * collide: NG0912 "Component ID generation collision detected". Under the NgModule-based
 * TestBed this rarely surfaced; with standalone hosts it does.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const opt = (n, d) => {
    const i = args.indexOf(`--${n}`);
    return i >= 0 ? args[i + 1] : d;
};
const dry = args.includes('--dry');
const root = resolve(process.cwd(), opt('dir', 'src'));

const specs = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = join(dir, e.name);
        return e.isDirectory() ? specs(p) : e.name.endsWith('.spec.ts') ? [p] : [];
    });

const kebab = (n) =>
    n
        .replace(/Component$/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/_/g, '-')
        .toLowerCase();

let files = 0;
let added = 0;

for (const file of specs(root)) {
    const before = readFileSync(file, 'utf8');
    // pair each @Component decorator with the class it decorates
    const re = /@Component\(\{([\s\S]*?)\}\)\s*(?:export\s+)?class\s+(\w+)/g;
    let s = before;
    let m;
    const edits = [];
    while ((m = re.exec(before))) {
        const [whole, body, cls] = m;
        if (/(^|[\s,{])selector\s*:/.test(body)) continue;
        edits.push([m.index, whole, body, cls]);
    }
    for (const [, whole, body, cls] of edits.reverse()) {
        const withSel = whole.replace('@Component({', `@Component({\n    selector: 'spec-${kebab(cls)}',`);
        s = s.replace(whole, withSel);
        added++;
    }
    if (s !== before) {
        files++;
        if (!dry) writeFileSync(file, s);
    }
}

console.log(`${dry ? '[dry] ' : ''}${files} spec file(s), ${added} host selector(s) added`);
