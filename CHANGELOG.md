# Changelog

## [0.2.0] - 2026-07-11

### Added

- Automated release-publish workflow triggered on `release: published`, shipping a
  packaged `.vsix` to the VS Code Marketplace and Open VSX
- npm Trusted Publishing (OIDC, no stored token, automatic provenance)

### Changed

- Publish workflow rewritten for the pnpm-based extension (real typecheck/lint/test
  gates, `--frozen-lockfile`)
- Upgraded to TypeScript 6 and `@types/node` 24 (LTS line); added explicit
  `"types": ["node", "vscode"]` to tsconfig
- Dependabot now pins `@types/node` to its major (stays on the Node LTS line)

### Fixed

- Dependabot auto-merge workflow referenced a non-existent `fetch-metadata@v5`
  (now `@v3`), which failed every Dependabot PR

## [0.1.1] - 2026-07-07

### Added

- VSCode extension with live markdown preview (Cmd+Shift+V / Ctrl+Shift+V)
- Zenn provider: `:::message`, `:::message alert`, `:::details`, `lang:filename` code blocks
- Qiita provider: `:::note info/warn/alert`, `lang:filename` code blocks
- Provider toggle dropdown in preview toolbar
- Insert Note Block command adapts to active provider
- Theme-aware CSS using `var(--vscode-*)` variables
- Debounced live preview on text change
- Provider selection persisted in workspace state
