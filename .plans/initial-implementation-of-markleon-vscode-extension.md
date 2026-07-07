# Plan: Initial implementation of Markleon VSCode extension

**Status:** Completed
**Date:** 2026-07-07

## Goal

Build a VSCode extension that provides live, server-less markdown preview with toggleable blog-provider rendering flavors (Zenn and Qiita). Both providers use markdown-it with custom plugins and inline CSS for a lightweight, fast bundle.

## Summary of Changes

- VSCode extension scaffold: package.json manifest, tsconfig, esbuild bundler, launch config
- Provider interface and registry pattern for extensible markdown renderers
- Zenn provider: markdown-it with `:::message`, `:::message alert`, `:::details Title`, `lang:filename` code blocks
- Qiita provider: markdown-it with `:::note info/warn/alert`, `lang:filename` code blocks
- WebviewPanel manager with toolbar dropdown for provider switching
- Debounced live preview on text change with last-editor tracking for focus resilience
- Insert Note Block command that adapts to active provider
- Inline CSS with `var(--vscode-*)` for theme awareness
- 264KB bundle (no heavy dependencies like shiki/cheerio/sanitize-html)

## Files Modified

- [src/extension.ts](src/extension.ts) - Extension entry point, registers 3 commands
- [src/types.ts](src/types.ts) - Provider interface and message types
- [src/providers/zenn.ts](src/providers/zenn.ts) - Zenn markdown renderer with inline CSS
- [src/providers/qiita.ts](src/providers/qiita.ts) - Qiita markdown renderer with inline CSS
- [src/providers/registry.ts](src/providers/registry.ts) - Provider registry
- [src/webview/panel-manager.ts](src/webview/panel-manager.ts) - WebviewPanel lifecycle and content updates
- [src/webview/html-template.ts](src/webview/html-template.ts) - Webview HTML with CSP, toolbar, message handling
- [src/commands/insert-note.ts](src/commands/insert-note.ts) - Insert Note Block command
- [src/util/debounce.ts](src/util/debounce.ts) - Debounce utility
- [src/css.d.ts](src/css.d.ts) - Type declarations for markdown-it-container
- [esbuild.mjs](esbuild.mjs) - esbuild bundler config
- [vitest.config.ts](vitest.config.ts) - Test config
- [package.json](package.json) - VSCode extension manifest
- [tsconfig.json](tsconfig.json) - TypeScript config with bundler resolution

## Breaking Changes

None (initial implementation)

## Deprecations

None
