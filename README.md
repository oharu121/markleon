# Markleon

Live, server-less markdown preview for VSCode that toggles between blog-provider rendering flavors (Zenn and Qiita).

## Features

- **Zenn preview**: `:::message`, `:::message alert`, `:::details Title`, code blocks with filenames
- **Qiita preview**: `:::note info/warn/alert`, code blocks with filenames
- **Provider toggle**: Switch between renderers via toolbar dropdown
- **Live preview**: Debounced updates as you type
- **Theme-aware**: Uses VSCode theme variables for consistent look
- **Lightweight**: ~264KB bundle, no heavy dependencies

## Usage

1. Open any Markdown file
2. Press `Cmd+Shift+V` (macOS) / `Ctrl+Shift+V` (Windows/Linux)
3. Preview panel opens beside your editor
4. Use the **Provider** dropdown to switch between Zenn and Qiita rendering

### Commands

| Command | Description |
|---------|-------------|
| `Markleon: Open Preview` | Open preview panel (Cmd+Shift+V) |
| `Markleon: Switch Provider` | Quick pick to change provider |
| `Markleon: Insert Note Block` | Insert provider-specific note syntax at cursor |

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Type check
pnpm run typecheck

# Test
pnpm test

# Lint
pnpm run lint
```

### Debug

Press **F5** in VSCode to launch the Extension Development Host with Markleon loaded.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you encounter any issues, please report them [here](https://github.com/oharu121/markleon/issues).

## License

MIT © oharu121
