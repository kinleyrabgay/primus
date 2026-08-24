/**
 * pack-prep — turn the compiled dist/ into the shadcn-style publishable package.
 *
 * The published @selisedev/primus-beta is a *source registry + CLI*, not an
 * importable component library:
 *   - exports are trimmed to the primeuix engine only (+ root). Components /
 *     core / theme are intentionally NOT importable from the package — you get
 *     them by copying with `primus add`, then you own & edit them.
 *   - the .ts source of components/core/theme is shipped under dist/src so the
 *     CLI can copy it; the CLI + tools + config template + licenses ride along;
 *     `bin` is restored so `pnpm primus <cmd>` works.
 */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

if (!fs.existsSync(path.join(DIST, 'package.json'))) {
    console.error('✗ dist/ not built — run `pnpm build` first.');
    process.exit(1);
}

// 1. Trim exports to the primeuix engine (+ root). Everything else must be copied.
const pkg = fs.readJsonSync(path.join(DIST, 'package.json'));
const keptExports = {};
for (const [key, val] of Object.entries(pkg.exports ?? {})) {
    if (key === '.' || key === './package.json' || key.startsWith('./primeuix')) keptExports[key] = val;
}
pkg.exports = keptExports;

// 2. Restore the CLI bin (stripped from the importable-lib manifest).
pkg.bin = { primus: './cli/primus.mjs' };

// 3. Advertise what the tarball contains.
pkg.files = ['fesm2022', 'types', 'src', 'cli', 'tools', 'primus.config.ts', 'LICENSE.md', 'NOTICE.md', 'README.md', 'index.d.ts'];

fs.writeJsonSync(path.join(DIST, 'package.json'), pkg, { spaces: 4 });

// 4. Ship the copyable source (components / core / theme only — the engine is the
//    compiled primeuix already in fesm2022/). Strip ng-package.json build files.
const srcOut = path.join(DIST, 'src');
for (const layer of ['components', 'core', 'theme']) {
    fs.copySync(path.join(ROOT, 'src', layer), path.join(srcOut, layer), {
        filter: (s) => !s.endsWith('ng-package.json')
    });
}

// 5. Ship the CLI, tools, config template, and licenses.
fs.copySync(path.join(ROOT, 'cli'), path.join(DIST, 'cli'));
fs.copySync(path.join(ROOT, 'tools'), path.join(DIST, 'tools'));
for (const f of ['primus.config.ts', 'LICENSE.md', 'NOTICE.md']) {
    if (fs.existsSync(path.join(ROOT, f))) fs.copySync(path.join(ROOT, f), path.join(DIST, f));
}

const compCount = fs.readdirSync(path.join(srcOut, 'components')).length;
console.log(`✓ pack-prep done: exports trimmed to primeuix engine; ${compCount} component sources + CLI shipped for copy.`);
