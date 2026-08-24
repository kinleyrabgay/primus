#!/usr/bin/env node
/**
 * Jasmine -> Vitest codemod for *.spec.ts.
 *
 *   node cli/codemods/jasmine-to-vitest.mjs [--dir src] [--dry]
 *
 * IMPORTANT semantic difference this handles:
 *   Jasmine's `spyOn(obj, 'm')` replaces the method with a STUB (returns undefined).
 *   Vitest's  `vi.spyOn(obj, 'm')` keeps the ORIGINAL implementation (calls through).
 * So a bare `spyOn(...)` becomes `vi.spyOn(...).mockImplementation(() => {})`, while
 * `spyOn(...).and.callThrough()` becomes a plain `vi.spyOn(...)`. Getting this backwards
 * silently changes what the tests exercise.
 *
 * Idempotent: re-running on converted files is a no-op. Reports leftover Jasmine
 * references per file so nothing is silently missed.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
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

/** Split `a, b, c` on top-level commas only (ignores nested parens/brackets/strings). */
function splitArgs(s) {
    const out = [];
    let depth = 0;
    let cur = '';
    let q = null;
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (q) {
            cur += c;
            if (c === '\\') { cur += s[++i]; continue; }
            if (c === q) q = null;
            continue;
        }
        if (c === '"' || c === "'" || c === '`') { q = c; cur += c; continue; }
        if ('([{'.includes(c)) depth++;
        if (')]}'.includes(c)) depth--;
        if (c === ',' && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
        cur += c;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
}

/** Find the matching close paren for the `(` at `open`. */
function matchParen(s, open) {
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
        if (c === '(') depth++;
        else if (c === ')') { depth--; if (depth === 0) return i; }
    }
    return -1;
}

/**
 * Rewrite every `spyOn(...)`/`spyOnProperty(...)` call together with the `.and.*`
 * modifier that follows it, so stub-vs-callthrough is preserved.
 */
function convertSpies(src) {
    const re = /(?<![.\w])(spyOnProperty|spyOn)\s*\(/g;
    let out = '';
    let last = 0;
    let m;
    while ((m = re.exec(src))) {
        const isProp = m[1] === 'spyOnProperty';
        const open = m.index + m[0].length - 1;
        const close = matchParen(src, open);
        if (close < 0) continue;
        const inner = src.slice(open + 1, close);
        let call = `vi.spyOn(${inner})`;

        // look at what follows: .and.<modifier>(...)
        const after = src.slice(close + 1);
        const and = after.match(/^\s*\.\s*and\s*\.\s*(returnValue|callThrough|callFake|throwError|stub|returnValues|resolveTo|rejectWith)\s*\(/);
        let consumed = 0;
        if (and) {
            const aOpen = close + 1 + after.indexOf('(', and[0].length - 1);
            const aClose = matchParen(src, aOpen);
            const aArgs = src.slice(aOpen + 1, aClose);
            consumed = aClose - close;
            switch (and[1]) {
                case 'callThrough':
                    break; // vi.spyOn already calls through
                case 'returnValue':
                    call += `.mockReturnValue(${aArgs})`;
                    break;
                case 'returnValues':
                    call += splitArgs(aArgs).map((v) => `.mockReturnValueOnce(${v})`).join('');
                    break;
                case 'callFake':
                    call += `.mockImplementation(${aArgs})`;
                    break;
                case 'resolveTo':
                    call += `.mockResolvedValue(${aArgs})`;
                    break;
                case 'rejectWith':
                    call += `.mockRejectedValue(${aArgs})`;
                    break;
                case 'throwError':
                    call += `.mockImplementation(() => { throw ${aArgs.trim().startsWith('new ') ? aArgs : `new Error(${aArgs})`}; })`;
                    break;
                case 'stub':
                    call += `.mockImplementation(() => {})`;
                    break;
            }
        } else if (!isProp) {
            // bare spyOn => Jasmine stubs the method; replicate that
            call += `.mockImplementation(() => {})`;
        }

        out += src.slice(last, m.index) + call;
        last = close + 1 + consumed;
        re.lastIndex = last;
    }
    return out + src.slice(last);
}

const RULES = [
    // spy factories
    [/jasmine\.createSpy\s*\(\s*(['"`][^'"`]*['"`])\s*\)/g, (_, n) => `vi.fn().mockName(${n})`],
    [/jasmine\.createSpy\s*\(\s*\)/g, 'vi.fn()'],
    // asymmetric matchers
    [/jasmine\.any\s*\(/g, 'expect.any('],
    [/jasmine\.objectContaining\s*\(/g, 'expect.objectContaining('],
    [/jasmine\.arrayContaining\s*\(/g, 'expect.arrayContaining('],
    [/jasmine\.stringMatching\s*\(/g, 'expect.stringMatching('],
    // fake timers
    [/jasmine\.clock\s*\(\s*\)\s*\.install\s*\(\s*\)/g, 'vi.useFakeTimers()'],
    [/jasmine\.clock\s*\(\s*\)\s*\.uninstall\s*\(\s*\)/g, 'vi.useRealTimers()'],
    [/jasmine\.clock\s*\(\s*\)\s*\.tick\s*\(/g, 'vi.advanceTimersByTime('],
    // jasmine-only matchers
    [/\.toBeTrue\s*\(\s*\)/g, '.toBe(true)'],
    [/\.toBeFalse\s*\(\s*\)/g, '.toBe(false)'],
    // spy assertions / helpers
    [/\.calls\.reset\s*\(\s*\)/g, '.mockClear()'],
    [/\.calls\.count\s*\(\s*\)/g, '.mock.calls.length'],
    [/\.calls\.mostRecent\s*\(\s*\)\.args/g, '.mock.calls.at(-1)!'],
    [/\.calls\.allArgs\s*\(\s*\)/g, '.mock.calls'],
    [/\.calls\.any\s*\(\s*\)/g, '.mock.calls.length > 0'],
    [/(?<![.\w])fail\s*\(/g, 'expect.fail('],
    // `.and.*` left over when the spy was not created by spyOn() — e.g.
    // `jasmine.createSpy('x').and.returnValue(1)` or `existingSpy.and.callFake(fn)`
    [/\.and\.throwError\s*\(([^)]*)\)/g, (_, a) => `.mockImplementation(() => { throw ${a.trim().startsWith('new ') ? a : `new Error(${a})`}; })`],
    [/\.and\.returnValue\s*\(/g, '.mockReturnValue('],
    [/\.and\.callFake\s*\(/g, '.mockImplementation('],
    [/\.and\.stub\s*\(\s*\)/g, '.mockImplementation(() => {})'],
    [/\.and\.callThrough\s*\(\s*\)/g, ''],
    // spy TYPES. Vitest's precise analogues (Mock / MockedObject) need a type import;
    // these forms need none and keep the specs compiling.
    [/jasmine\.SpyObj\s*<[^>]*>/g, 'any'],
    [/jasmine\.Spy(?![\w])/g, 'ReturnType<typeof vi.fn>'],
    // Jasmine attaches failure messages to the matcher; Vitest takes them as expect()'s
    // second argument.  expect(x).withContext('m').toBe(y)  ->  expect(x, 'm').toBe(y)
    [/expect\(([\s\S]*?)\)\s*\.withContext\(([^)]*)\)/g, (_, a, m) => `expect(${a}, ${m})`],
    [/expect\(([^;]*?)\)\.(toBeTruthy|toBeFalsy|toBeDefined|toBeUndefined|toBeNull)\((['"`][^'"`]*['"`])\)/g,
        (_, a, matcher, msg) => `expect(${a}, ${msg}).${matcher}()`],
    // Jasmine's expectAsync. `toBeResolved` only asserts that the promise settles
    // successfully, which a bare `await` already does (a rejection fails the test).
    [/await\s+expectAsync\s*\(([\s\S]*?)\)\s*\.toBeResolved\s*\(\s*\)/g, (_, p) => `await ${p}`],
    [/await\s+expectAsync\s*\(([\s\S]*?)\)\s*\.toBeResolvedTo\s*\(([\s\S]*?)\)/g, (_, p, v) => `await expect(${p}).resolves.toEqual(${v})`],
    [/await\s+expectAsync\s*\(([\s\S]*?)\)\s*\.toBeRejectedWith\s*\(([\s\S]*?)\)/g, (_, p, v) => `await expect(${p}).rejects.toEqual(${v})`],
    [/await\s+expectAsync\s*\(([\s\S]*?)\)\s*\.toBeRejected\s*\(\s*\)/g, (_, p) => `await expect(${p}).rejects.toBeDefined()`],
    // Jasmine's focus/skip aliases do not exist in Vitest
    [/(?<![.\w])xdescribe\s*\(/g, 'describe.skip('],
    [/(?<![.\w])fdescribe\s*\(/g, 'describe.only('],
    [/(?<![.\w])xit\s*\(/g, 'it.skip('],
    [/(?<![.\w])fit\s*\(/g, 'it.only(']
];

/**
 * Vitest has no `done` callback. Every `done` in this suite is called synchronously
 * inside an event handler in a test that already asserts synchronously, so the callback
 * is redundant: drop the parameter and the call. A `done` reached asynchronously
 * (setTimeout/Promise/subscribe) is left alone and reported instead.
 */
function convertDone(src) {
    return src.replace(/\b(x?it|f?it|test|it\.skip|it\.only)\(\s*(['"`])((?:\\.|(?!\2).)*)\2\s*,\s*(async\s+)?\(\s*done\s*\)\s*=>\s*\{/g, (whole, fn, q, name, asyncKw, offset) => {
        // find this test's body and make sure `done` is not used asynchronously in it
        const at = src.indexOf(whole);
        const open = src.indexOf('{', at + whole.length - 1);
        const body = src.slice(at, open + 4000);
        const idx = body.search(/\bdone\s*\(\s*\)/);
        if (idx < 0) return whole;
        const before = body.slice(0, idx);
        if (/setTimeout|setInterval|Promise|requestAnimationFrame|\.subscribe\(|whenStable/.test(before)) return whole;
        return `${fn}(${q}${name}${q}, ${asyncKw || ''}() => {`;
    }).replace(/^[ \t]*done\(\s*\);?[ \t]*\r?\n/gm, '');
}

let changed = 0;
const residue = [];
for (const file of specs(root)) {
    const before = readFileSync(file, 'utf8');
    let s = convertDone(convertSpies(before));
    for (const [re, to] of RULES) s = s.replace(re, to);

    // createSpyObj('name', ['a','b']) -> { a: vi.fn(), b: vi.fn() }
    s = s.replace(/jasmine\.createSpyObj\s*(?:<[^>]*>)?\s*\(/g, (mm, off) => `\u0000SPYOBJ(`).replace(/\u0000SPYOBJ\(/g, 'jasmine.createSpyObj(');
    for (;;) {
        const i = s.indexOf('jasmine.createSpyObj(');
        if (i < 0) break;
        const open = s.indexOf('(', i);
        const close = matchParen(s, open);
        if (close < 0) break;
        const parts = splitArgs(s.slice(open + 1, close));
        // (name, ['a','b'], { prop: 1 })  ->  { a: vi.fn(), b: vi.fn(), ...({ prop: 1 }) }
        const arr = parts.find((p) => p.startsWith('['));
        const props = parts.find((p) => p.startsWith('{'));
        const keys = arr ? splitArgs(arr.slice(1, -1)).map((k) => k.replace(/['"`]/g, '').trim()).filter(Boolean) : [];
        const body = keys.map((k) => `${k}: vi.fn()`);
        if (props) body.push(`...(${props})`);
        s = s.slice(0, i) + `{ ${body.join(', ')} }` + s.slice(close + 1);
    }

    if (s !== before) {
        changed++;
        if (!dry) writeFileSync(file, s);
    }
    const left = [...s.matchAll(/jasmine\.\w+|\.and\.\w+|\(\s*done\s*[,)]|\bdone\s*\(\s*\)/g)].map((x) => x[0]);
    if (left.length) residue.push([file.replace(root + '/', ''), [...new Set(left)].join(', ')]);
}

console.log(`${dry ? '[dry] ' : ''}converted ${changed} spec file(s)`);
if (residue.length) {
    console.log(`\n${residue.length} file(s) need manual attention:`);
    for (const [f, r] of residue) console.log(`  ${f}  ->  ${r}`);
}
