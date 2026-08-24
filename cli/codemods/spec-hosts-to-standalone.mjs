#!/usr/bin/env node
/**
 * Make spec-local test-host components standalone.
 *
 *   node cli/codemods/spec-hosts-to-standalone.mjs [--dir src] [--dry]
 *
 * Why this is needed: the Karma builder JIT-compiled specs, so a host declared
 * `standalone: false` picked its directives up from `TestBed.configureTestingModule`
 * at runtime. The Vitest builder (`@angular/build:unit-test`) compiles specs AOT, where
 * a non-standalone component that belongs to no NgModule has an empty directive scope —
 * every `[pBind]`, `<p-button>`, … in its template becomes NG8002.
 *
 * The fix is the modern pattern, and the one phase 2 moves the whole library to: each
 * host declares its own `imports`. The right value is already in the file — whatever
 * that spec passes to TestBed's `imports: [...]`. So:
 *
 *   1. collect the union of identifiers from every TestBed `imports: [...]` in the file
 *   2. replace each host's `standalone: false` with `imports: [<union>]`
 *      (v19+ makes standalone the default, so dropping the flag is enough)
 *   3. move host classes out of TestBed `declarations: [...]` into `imports: [...]`,
 *      because standalone components cannot be declared
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

function matchBracket(s, open, oc = '[', cc = ']') {
    let depth = 0;
    let q = null;
    for (let i = open; i < s.length; i++) {
        const c = s[i];
        if (q) {
            if (c === '\\') { i++; continue; }
            if (c === q) q = null;
            continue;
        }
        if (c === '"' || c === "'" || c === '`') { q = c; continue; }
        if (c === oc) depth++;
        else if (c === cc) { depth--; if (depth === 0) return i; }
    }
    return -1;
}

/** All `<key>: [ ... ]` array literals for the given key, as [start, end, body]. */
function arrays(src, key) {
    const out = [];
    const re = new RegExp(`${key}\\s*:\\s*\\[`, 'g');
    let m;
    while ((m = re.exec(src))) {
        const open = m.index + m[0].length - 1;
        const close = matchBracket(src, open);
        if (close < 0) continue;
        out.push([m.index, close, src.slice(open + 1, close)]);
        re.lastIndex = close;
    }
    return out;
}

const ids = (body) =>
    body
        .split(',')
        .map((x) => x.trim())
        .filter((x) => /^[A-Za-z_$][\w$]*$/.test(x));

let changed = 0;
const report = [];

/** Span of the object literal passed to each TestBed.configureTestingModule( ... ). */
function testBedSpans(src) {
    const out = [];
    const re = /configureTestingModule\s*\(/g;
    let m;
    while ((m = re.exec(src))) {
        const open = m.index + m[0].length - 1;
        const close = matchBracket(src, open, '(', ')');
        if (close > 0) out.push([open, close]);
        re.lastIndex = close > 0 ? close : re.lastIndex;
    }
    return out;
}

for (const file of specs(root)) {
    const before = readFileSync(file, 'utf8');
    if (!before.includes('standalone: false')) continue;

    let s = before;

    // ---- step 1: inside each TestBed call, fold `declarations` into `imports`.
    // Done FIRST, while the only imports arrays in the file are TestBed's — doing it
    // after step 2 would merge host classes into a host's own imports (self-import).
    const hostClasses = new Set();
    for (;;) {
        let didWork = false;
        for (const [tbOpen, tbClose] of testBedSpans(s)) {
            const seg = s.slice(tbOpen, tbClose);
            const dRel = arrays(seg, 'declarations');
            if (!dRel.length) continue;
            const [dStart, dEnd, dBody] = dRel[0];
            const hosts = ids(dBody);
            hosts.forEach((h) => hostClasses.add(h));
            const iRel = arrays(seg, 'imports')[0];

            let out;
            if (iRel) {
                const [iStart, iEnd, iBody] = iRel;
                const merged = `imports: [${[...ids(iBody), ...hosts].join(', ')}]`;
                if (iStart > dStart) {
                    out = seg.slice(0, dStart) + seg.slice(dEnd + 1).replace(/^\s*,\s*/, '');
                    const shift = dEnd + 1 - dStart - (seg.slice(dEnd + 1).match(/^\s*,\s*/)?.[0].length ? 0 : 0);
                    const re2 = arrays(out, 'imports')[0];
                    out = out.slice(0, re2[0]) + merged + out.slice(re2[1] + 1);
                } else {
                    out = seg.slice(0, iStart) + merged + seg.slice(iEnd + 1);
                    const re2 = arrays(out, 'declarations')[0];
                    out = out.slice(0, re2[0]) + out.slice(re2[1] + 1).replace(/^\s*,\s*/, '');
                }
            } else {
                out = seg.slice(0, dStart) + `imports: [${hosts.join(', ')}]` + seg.slice(dEnd + 1);
            }
            s = s.slice(0, tbOpen) + out + s.slice(tbClose);
            didWork = true;
            break;
        }
        if (!didWork) break;
    }

    // ---- step 2: the directive scope each host needs = what TestBed imports,
    // minus the host classes themselves.
    const scope = new Set();
    for (const [tbOpen, tbClose] of testBedSpans(s)) {
        const seg = s.slice(tbOpen, tbClose);
        for (const [, , body] of arrays(seg, 'imports')) ids(body).forEach((i) => scope.add(i));
    }
    // Exclude every class declared in THIS file, not just the ones that were in
    // `declarations`: some specs already list their hosts under TestBed `imports`.
    // Including them would make one host reference another before its declaration
    // (TS2449) and defeat static analysis (NG1010).
    const localClasses = new Set([...s.matchAll(/(?:^|\n)\s*(?:export\s+)?class\s+(\w+)/g)].map((m) => m[1]));
    const scopeList = [...scope].filter((i) => !hostClasses.has(i) && !localClasses.has(i));

    // ---- step 3: hosts become standalone with that explicit scope
    // (v19+ makes standalone the default, so dropping the flag is what "standalone" means)
    // A host that already declares `imports` must be merged into, not given a second key
    // (TS1117 duplicate property).
    s = s.replace(/@(Component|Directive)\(\{([\s\S]*?)\}\)/g, (whole, kind, body) => {
        if (!body.includes('standalone: false')) return whole;
        const existing = body.match(/imports:\s*\[([^\]]*)\]/);
        if (existing) {
            const merged = [...new Set([...ids(existing[1]), ...scopeList])];
            return `@${kind}({${body.replace(/imports:\s*\[[^\]]*\]/, `imports: [${merged.join(', ')}]`).replace(/\s*standalone: false,?/, '')}})`;
        }
        const repl = scopeList.length ? `imports: [${scopeList.join(', ')}]` : 'standalone: true';
        return `@${kind}({${body.replace('standalone: false', repl)}})`;
    });

    s = s.replace(/,(\s*[\]}])/g, '$1').replace(/\[\s*,/g, '[').replace(/,\s*,/g, ',');

    if (s !== before) {
        changed++;
        if (!dry) writeFileSync(file, s);
        report.push([file.replace(root + '/', ''), scopeList.length]);
    }
}

console.log(`${dry ? '[dry] ' : ''}converted ${changed} spec file(s) to standalone hosts`);
const noScope = report.filter(([, n]) => n === 0);
if (noScope.length) {
    console.log(`\n${noScope.length} file(s) had no TestBed imports to derive a scope from (hosts made standalone with no imports — verify their templates need none):`);
    for (const [f] of noScope) console.log(`  ${f}`);
}
