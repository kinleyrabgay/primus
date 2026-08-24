#!/usr/bin/env node
/**
 * primus theme generator (PoC)
 *
 * Reads primus.config.ts and emits a static stylesheet with every CSS variable
 * the components consume — the same output @primeuix/styled would inject at
 * runtime, computed once at build time instead.
 *
 * Usage: node tools/generate-theme.mjs [--config primus.config.ts] [--out primus.theme.css] [--structural <component,...>]
 *
 * The @primeuix/* packages are used here as BUILD-TIME tools only; the app
 * bundle never ships them once runtime theming is removed.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve as resolvePath, dirname } from 'node:path';
import { createJiti } from 'jiti';
import { Theme, definePreset, dt, css as Css } from '@primeuix/styled';
import { resolve as resolveStyle, minifyCSS } from '@primeuix/utils';

const args = process.argv.slice(2);
const opt = (name, fallback) => {
    const i = args.indexOf(`--${name}`);
    return i >= 0 ? args[i + 1] : fallback;
};

const configPath = resolvePath(process.cwd(), opt('config', 'primus.config.ts'));
const outPath = resolvePath(process.cwd(), opt('out', 'primus.theme.css'));
const structural = (opt('structural', '') || '').split(',').filter(Boolean);

// ── 1. Load primus.config.ts (TypeScript) ────────────────────────────────────
const jiti = createJiti(import.meta.url);
const config = (await jiti.import(configPath)).default;

// ── 2. Compose the preset the way theme/preset.ts does today ────────────────
const preset = definePreset({
    primitive: { ...config.colors, ...config.typography, ...config.spacing },
    semantic: { ...config.semantic, ...config.appColors },
    components: config.components
});

// ── 3. Feed it to the engine once, at build time ─────────────────────────────
Theme.setTheme({
    preset,
    options: {
        prefix: config.prefix ?? 'p',
        darkModeSelector: config.darkModeSelector ?? '.dark',
        cssLayer: config.cssLayer ?? false
    }
});

const banner = `/*
 * GENERATED FILE — do not edit by hand.
 * Built from primus.config.ts by \`primus theme\`.
 */\n`;

const sections = [];

// Common variables: primitive + semantic (incl. dark colorScheme) + global
const common = Theme.getCommon('base') ?? {};
const { primitive, semantic, global } = common;
if (primitive?.css) sections.push(`/* primitive tokens */\n${primitive.css}`);
if (semantic?.css) sections.push(`/* semantic tokens (light + dark) */\n${semantic.css}`);
if (global?.css) sections.push(`/* global tokens */\n${global.css}`);

// Base structural style (.p-component, .p-disabled, focus ring helpers, ...)
try {
    const { style: baseStyle } = await import('@primeuix/styles/base');
    const computed = Css`${resolveStyle(baseStyle, { dt })}`;
    sections.push(`/* base structural style */\n${minifyCSS(Theme.transformCSS('global-style', computed))}`);
} catch {
    /* base style optional */
}

// Per-component variables — everything the runtime would lazily inject
const componentNames = Object.keys(config.components ?? {});
for (const name of componentNames) {
    const comp = Theme.getComponent(name) ?? {};
    if (comp?.css) sections.push(`/* ${name} tokens */\n${comp.css}`);
}

// Structural CSS for the installed components, concatenated into ONE file so the
// consuming app's style list never changes as components are added. Components whose
// CSS lives in another package (e.g. inputicon, scroller) simply contribute nothing.
if (structural.length) {
    const parts = [];
    const missing = [];
    for (const name of structural) {
        try {
            const { style } = await import(`@primeuix/styles/${name}`);
            const computed = Css`${resolveStyle(style, { dt })}`;
            parts.push(`/* ${name} */\n${minifyCSS(Theme.transformCSS(`${name}-style`, computed))}`);
        } catch {
            missing.push(name);
        }
    }
    const compOut = resolvePath(dirname(outPath), 'primus.components.css');
    mkdirSync(dirname(compOut), { recursive: true });
    writeFileSync(compOut, banner + parts.join('\n\n') + '\n');
    console.log(`  ✓ structural css  ${compOut}`);
    console.log(`    ${parts.length} component(s)${missing.length ? `; no own stylesheet: ${missing.join(', ')}` : ''}`);
}

writeFileSync(outPath, banner + sections.join('\n\n') + '\n');
console.log(`  ✓ theme variables ${outPath}`);
console.log(`    ${componentNames.length} components, ${(sections.join('').length / 1024).toFixed(1)} KB`);
