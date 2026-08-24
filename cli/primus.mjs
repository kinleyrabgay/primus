#!/usr/bin/env node
/**
 * primus CLI (PoC) — shadcn-style component installer for the primus fork.
 *
 *   primus init  [--dir libs/primus]     scaffold primus.json, core/, theme entry, tsconfig paths
 *   primus add   <component...>          copy component folder(s) + transitive deps into the app
 *   primus theme                         compile primus.config.ts -> static primus.theme.css
 *   primus diff  <component>             compare local copy against the installed package
 *
 * Source of truth: the primus package installed as a git devDependency
 * (node_modules/@selisedev/primus-beta). The CLI only ever COPIES from it — the app owns
 * every file after that.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(__dirname, '..'); // the installed @selisedev/primus-beta package root
const cwd = process.cwd();

const [cmd, ...rest] = process.argv.slice(2);
const flags = {};
const positional = [];
for (let i = 0; i < rest.length; i++) {
    if (rest[i].startsWith('--')) flags[rest[i].slice(2)] = rest[i + 1] && !rest[i + 1].startsWith('--') ? rest[++i] : true;
    else positional.push(rest[i]);
}

const registry = JSON.parse(readFileSync(join(__dirname, 'registry.json'), 'utf8'));
const SRC = join(PKG_ROOT, registry.sourceRoot ?? 'src');

// Files that only serve the fork's own build/test harness are not copied into
// apps unless asked for (`--with-specs` keeps the spec files).
const copyFilter = (src) => {
    if (src.endsWith('.spec.ts')) return Boolean(flags['with-specs']);
    if (src.endsWith('ng-package.json')) return false;
    return true;
};

// tsconfig files are JSONC — strip comments (string-aware) before parsing.
const parseJsonc = (text) => {
    let out = '';
    let inStr = false;
    let inLine = false;
    let inBlock = false;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        const n = text[i + 1];
        if (inLine) { if (c === '\n') { inLine = false; out += c; } continue; }
        if (inBlock) { if (c === '*' && n === '/') { inBlock = false; i++; } continue; }
        if (inStr) { out += c; if (c === '\\') { out += n; i++; } else if (c === '"') inStr = false; continue; }
        if (c === '"') { inStr = true; out += c; continue; }
        if (c === '/' && n === '/') { inLine = true; continue; }
        if (c === '/' && n === '*') { inBlock = true; i++; continue; }
        out += c;
    }
    return JSON.parse(out.replace(/,\s*([}\]])/g, '$1'));
};

const loadAppConfig = () => {
    const p = join(cwd, 'primus.json');
    if (!existsSync(p)) fail(`primus.json not found in ${cwd} — run \`primus init\` first.`);
    return JSON.parse(readFileSync(p, 'utf8'));
};
const fail = (msg) => {
    console.error(`✗ ${msg}`);
    process.exit(1);
};
const ok = (msg) => console.log(`  ✓ ${msg}`);

// ─────────────────────────────────────────────────────────────── init ──
function init() {
    const dir = flags.dir ?? 'libs/primus';
    const target = resolve(cwd, dir);

    // 1. primus.json — the app-side config (shadcn's components.json equivalent)
    const primusJson = {
        $schema: 'https://selise.internal/primus.schema.json',
        version: registry.version,
        paths: {
            root: dir,
            components: `${dir}/components`,
            core: `${dir}/core`,
            theme: `${dir}/theme`
        },
        theme: {
            config: 'primus.config.ts',
            output: `${dir}/theme/primus.theme.css`
        }
    };
    writeFileSync(join(cwd, 'primus.json'), JSON.stringify(primusJson, null, 4) + '\n');
    ok(`primus.json (components will be created under ${dir}/)`);

    // 2. core/ — always-installed base layer (basecomponent, api, dom, icons, ...)
    mkdirSync(target, { recursive: true });
    if (existsSync(join(SRC, 'core'))) {
        cpSync(join(SRC, 'core'), join(target, 'core'), { recursive: true, filter: copyFilter });
        ok(`core/ copied (${readdirSync(join(target, 'core')).length} modules)`);
    }

    // 2b. MIT license + notice travel with every copy (see NOTICE.md)
    for (const f of ['LICENSE.md', 'NOTICE.md']) {
        if (existsSync(join(PKG_ROOT, f))) cpSync(join(PKG_ROOT, f), join(target, f));
    }

    // 3. primus.config.ts — single design-system entry (starter template)
    if (!existsSync(join(cwd, 'primus.config.ts'))) {
        const tpl = join(PKG_ROOT, 'primus.config.ts');
        if (existsSync(tpl)) {
            // starter imports token modules that live in the copied theme/ folder
            mkdirSync(join(target, 'theme'), { recursive: true });
            if (existsSync(join(SRC, 'theme'))) cpSync(join(SRC, 'theme'), join(target, 'theme'), { recursive: true, filter: copyFilter });
            const rewritten = readFileSync(tpl, 'utf8').replaceAll("'./src/theme/", `'./${dir}/theme/`);
            writeFileSync(join(cwd, 'primus.config.ts'), rewritten);
            ok('primus.config.ts scaffolded (edit this to restyle everything)');
        }
    }

    // 4. tsconfig paths — wildcards, set ONCE; `add` never touches tsconfig again
    const tsconfigPath = ['tsconfig.base.json', 'tsconfig.json'].map((f) => join(cwd, f)).find(existsSync);
    if (tsconfigPath) {
        const tsconfig = parseJsonc(readFileSync(tsconfigPath, 'utf8'));
        tsconfig.compilerOptions ??= {};
        tsconfig.compilerOptions.paths ??= {};
        // relative path values — valid without a baseUrl (TS5090).
        // Redirect ONLY the copied, app-owned layers (components / core / theme) to the
        // local folders. The primeuix engine is deliberately NOT remapped: it keeps
        // resolving to node_modules/@selisedev/primus-beta (the compiled engine the copied
        // components import at runtime). No catch-all '@selisedev/primus-beta/*' mapping —
        // that would swallow '@selisedev/primus-beta/primeuix/*' and break the engine.
        const rel = tsconfig.compilerOptions.baseUrl ? '' : './';
        Object.assign(tsconfig.compilerOptions.paths, {
            '@selisedev/primus-beta/theme': [`${rel}${dir}/theme/public_api.ts`],
            '@selisedev/primus-beta/core/*': [`${rel}${dir}/core/*/public_api.ts`],
            '@selisedev/primus-beta/components/*': [`${rel}${dir}/components/*/public_api.ts`]
        });
        if (tsconfig.compilerOptions.strict === true) {
            console.warn('  ! this tsconfig has strict:true — primus sources compile with strict:false + strictNullChecks:true (and strictTemplates:false); align these or the build will fail');
        }
        writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 4) + '\n');
        ok(`${tsconfigPath.split('/').pop()} paths added (@selisedev/primus-beta/components/*, @selisedev/primus-beta/core/*, @selisedev/primus-beta/theme)`);
    } else {
        console.warn('  ! no tsconfig.base.json/tsconfig.json found — add @selisedev/primus-beta/* paths manually');
    }

    console.log('\nNext: `primus add button`, then `primus theme` to generate CSS.');
}

// ──────────────────────────────────────────────────────────────── add ──
function resolveClosure(names) {
    const seen = new Set();
    const order = [];
    const visit = (name) => {
        if (seen.has(name)) return;
        seen.add(name);
        const entry = registry.components[name];
        if (!entry) fail(`'${name}' is not in the registry. Known: ${Object.keys(registry.components).join(', ')}`);
        (entry.dependencies ?? []).forEach(visit);
        order.push(name);
    };
    names.forEach(visit);
    return order;
}

async function promptComponents() {
    const all = Object.keys(registry.components).sort();
    if (!process.stdin.isTTY) fail('usage: primus add <component...>  (no TTY for interactive select)');
    const { createInterface } = await import('node:readline/promises');
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    console.log('\nSelect components to add (shadcn-style):\n');
    all.forEach((n, i) => console.log(`  ${String(i + 1).padStart(3)}. ${n}`));
    console.log('\nEnter names or numbers (comma/space separated), or "all".');
    const answer = (await rl.question('› ')).trim();

    let picked;
    if (answer.toLowerCase() === 'all') picked = all;
    else
        picked = answer
            .split(/[\s,]+/)
            .filter(Boolean)
            .map((tok) => (/^\d+$/.test(tok) ? all[Number(tok) - 1] : tok))
            .filter(Boolean);

    if (!picked.length) {
        rl.close();
        fail('nothing selected.');
    }
    const confirm = (await rl.question(`\nAdd: ${picked.join(', ')} ?  (Y/n) `)).trim().toLowerCase();
    rl.close();
    if (confirm && confirm !== 'y' && confirm !== 'yes') fail('aborted.');
    return picked;
}

async function add() {
    if (!positional.length) positional.push(...(await promptComponents()));
    const cfg = loadAppConfig();
    const closure = resolveClosure(positional);
    const npmDeps = new Set();
    let copied = 0;

    for (const name of closure) {
        const entry = registry.components[name];
        const from = join(SRC, entry.dir);
        const to = resolve(cwd, cfg.paths.components, name);
        (entry.npm ?? []).forEach((d) => npmDeps.add(d));
        if (existsSync(to)) {
            console.log(`  - ${name} already present, skipped (use \`primus diff ${name}\` to compare)`);
            continue;
        }
        if (!existsSync(from)) fail(`source folder missing in package: ${from}`);
        cpSync(from, to, { recursive: true, filter: copyFilter });
        ok(`${name} -> ${join(cfg.paths.components, name)}`);
        copied++;
    }

    console.log(`\n${copied} component(s) installed (${closure.length - positional.length} pulled in as dependencies).`);
    if (npmDeps.size) console.log(`Install npm peer(s): pnpm add ${[...npmDeps].join(' ')}`);
}

// ─────────────────────────────────────────────────────────────── diff ──
function diffCmd() {
    if (!positional.length) fail('usage: primus diff <component>');
    const cfg = loadAppConfig();
    const name = positional[0];
    const entry = registry.components[name];
    if (!entry) fail(`'${name}' is not in the registry.`);
    const from = join(SRC, entry.dir);
    const to = resolve(cwd, cfg.paths.components, name);
    if (!existsSync(to)) fail(`'${name}' is not installed (${to}).`);

    const walk = (dir, base = dir) =>
        readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
            const p = join(dir, e.name);
            return e.isDirectory() ? walk(p, base) : copyFilter(p) ? [p.slice(base.length + 1)] : [];
        });

    const pkgFiles = new Set(walk(from));
    const appFiles = new Set(walk(to));
    let clean = true;
    for (const f of [...new Set([...pkgFiles, ...appFiles])].sort()) {
        if (!pkgFiles.has(f)) { console.log(`  + ${f} (local only)`); clean = false; }
        else if (!appFiles.has(f)) { console.log(`  - ${f} (missing locally)`); clean = false; }
        else if (readFileSync(join(from, f), 'utf8') !== readFileSync(join(to, f), 'utf8')) {
            console.log(`  ~ ${f} (modified — inspect: git diff --no-index ${join(from, f)} ${join(to, f)})`);
            clean = false;
        }
    }
    console.log(clean ? `  ✓ ${name} matches the installed package` : `\n'${name}' differs from the package. Review before re-copying.`);
}

// ────────────────────────────────────────────────────────────── theme ──
async function theme() {
    const cfg = loadAppConfig();
    const gen = join(__dirname, '..', 'tools', 'generate-theme.mjs');
    const { spawnSync } = await import('node:child_process');
    mkdirSync(dirname(resolve(cwd, cfg.theme.output)), { recursive: true });

    // Structural CSS is generated for whatever is actually installed — discovered from
    // the components directory — so adding a component needs no config change anywhere.
    // --structural still overrides for one-off runs.
    let structural = flags.structural;
    if (!structural) {
        const compDir = resolve(cwd, cfg.paths.components);
        structural = existsSync(compDir)
            ? readdirSync(compDir, { withFileTypes: true })
                  .filter((e) => e.isDirectory())
                  .map((e) => e.name)
                  .join(',')
            : '';
    }

    const res = spawnSync(process.execPath, [gen, '--config', cfg.theme.config, '--out', cfg.theme.output, ...(structural ? ['--structural', structural] : [])], {
        cwd,
        stdio: 'inherit'
    });
    process.exit(res.status ?? 0);
}

// ─────────────────────────────────────────────────────────────── main ──
switch (cmd) {
    case 'init':
        init();
        break;
    case 'add':
        await add();
        break;
    case 'theme':
        await theme();
        break;
    case 'diff':
        diffCmd();
        break;
    default:
        console.log('primus <init|add|theme|diff> — see header of cli/primus.mjs');
        process.exit(cmd ? 1 : 0);
}
