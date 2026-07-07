# Markleon Test Document

## Basic Formatting

This is **bold**, *italic*, and ~~strikethrough~~ text.

Here is some `inline code` and a [link](https://example.com).

## Code Block with Filename (Qiita-style)

```ts:src/hello.ts
export function hello(name: string): string {
  return `Hello, ${name}!`;
}
```

## Regular Code Block

```python
def greet(name):
    return f"Hello, {name}!"
```

## Note Blocks

:::note info
This is an informational note. It should appear with a blue accent.
:::

:::note warn
This is a warning note. It should appear with a yellow accent.
:::

:::note alert
This is an alert note. It should appear with a red accent.
:::

:::note
This is a bare note (defaults to info style).
:::

## Zenn-specific: Message Block

:::message
This is a Zenn-style message block.
:::

## Table

| Provider | Status | Notes |
|----------|--------|-------|
| Zenn     | Done   | Uses zenn-markdown-html |
| Qiita    | Done   | Uses markdown-it + plugins |

## Blockquote

> This is a blockquote.
> It can span multiple lines.

## Lists

### Ordered

1. First item
2. Second item
3. Third item

### Unordered

- Item A
- Item B
  - Nested item
  - Another nested item
- Item C

### Checklist

- [x] Zenn provider
- [x] Qiita provider
- [ ] GitHub provider (future)

## Horizontal Rule

---

## Image (external)

![Placeholder](https://via.placeholder.com/300x100?text=Markleon+Preview)
