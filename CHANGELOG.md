# Changelog

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
