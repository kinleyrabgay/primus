#!/usr/bin/env node
/**
 * Ensure every spec-local host that uses a CommonModule directive or pipe imports it.
 *
 *   node cli/codemods/spec-hosts-common-module.mjs [--dir src] [--dry]
 *
 * Companion to spec-hosts-to-standalone.mjs. That codemod derives each host's directive
 * scope from what the spec hands TestBed — which frequently omits CommonModule, because
 * under the old NgModule-based TestBed it came in implicitly. Once hosts are standalone
 * the omission is fatal at runtime: `*ngIf` reports NG0303 ("Can't bind to 'ngIf'").
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

// structural directives, attribute directives and pipes that live in CommonModule
const NEEDS_COMMON =
    /\*ngIf|\*ngFor|\*ngSwitch|\[ngIf\]|\[ngForOf\]|\[ngSwitch\]|\[ngClass\]|\[ngStyle\]|ngTemplateOutlet|ngComponentOutlet|\[ngSwitchCase\]|ngSwitchDefault|\|\s*(?:async|currency|date|uppercase|lowercase|json|percent|number|slice|titlecase|keyvalue)\b/;

let changed = 0;
let hosts = 0;

for (const file of specs(root)) {
    const before = readFileSync(file, 'utf8');
    if (!before.includes('@Component')) continue;

    // split on decorator boundaries so each host is handled in isolation
    const parts = before.split(/(?=@Component\(\{)/);
    let touched = false;

    for (let i = 0; i < parts.length; i++) {
        const block = parts[i];
        if (!block.startsWith('@Component({')) continue;
        const decoratorEnd = block.indexOf('})');
        if (decoratorEnd < 0) continue;
        const decorator = block.slice(0, decoratorEnd);
        if (!NEEDS_COMMON.test(decorator)) continue; // template needs nothing from CommonModule
        if (/imports:\s*\[[^\]]*\bCommonModule\b/.test(decorator)) continue; // already there
        const m = decorator.match(/imports:\s*\[/);
        if (!m) continue; // NgModule-declared host; not our business
        parts[i] = block.slice(0, m.index) + decorator.slice(m.index).replace('imports: [', 'imports: [CommonModule, ') + block.slice(decoratorEnd);
        touched = true;
        hosts++;
    }

    if (!touched) continue;
    let s = parts.join('');

    // make sure the symbol is actually imported
    if (!/import\s*\{[^}]*\bCommonModule\b[^}]*\}\s*from\s*'@angular\/common'/.test(s)) {
        const common = s.match(/import\s*\{([^}]*)\}\s*from\s*'@angular\/common';/);
        s = common ? s.replace(common[0], `import {${common[1].replace(/\s+$/, '')}, CommonModule } from '@angular/common';`) : `import { CommonModule } from '@angular/common';\n${s}`;
    }

    changed++;
    if (!dry) writeFileSync(file, s);
}

console.log(`${dry ? '[dry] ' : ''}${changed} spec file(s), ${hosts} host(s) given CommonModule`);
