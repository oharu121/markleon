import { describe, it, expect } from 'vitest';
import { createZennProvider } from '../../providers/zenn.js';

describe('Zenn provider', () => {
  const provider = createZennProvider();

  it('has correct id and label', () => {
    expect(provider.id).toBe('zenn');
    expect(provider.label).toBe('Zenn');
  });

  it('renders markdown to HTML wrapped in .zenn-body', () => {
    const html = provider.render('# Hello\n\nWorld');
    expect(html).toContain('class="zenn-body"');
    expect(html).toContain('Hello');
    expect(html).toContain('World');
  });

  it('renders bold and italic', () => {
    const html = provider.render('**bold** and *italic*');
    expect(html).toContain('<strong>');
    expect(html).toContain('<em>');
  });

  it('renders :::message block', () => {
    const md = ':::message\nInfo text\n:::';
    const html = provider.render(md);
    expect(html).toContain('zenn-message');
    expect(html).toContain('Info text');
  });

  it('renders :::message alert block', () => {
    const md = ':::message alert\nAlert text\n:::';
    const html = provider.render(md);
    expect(html).toContain('zenn-message');
    expect(html).toContain('zenn-message-alert');
    expect(html).toContain('Alert text');
  });

  it('renders :::details block', () => {
    const md = ':::details Click me\nHidden content\n:::';
    const html = provider.render(md);
    expect(html).toContain('<details>');
    expect(html).toContain('<summary>Click me</summary>');
    expect(html).toContain('Hidden content');
  });

  it('renders code fence with lang:filename', () => {
    const md = '```ts:app.ts\nconst x = 1;\n```';
    const html = provider.render(md);
    expect(html).toContain('zenn-code-frame');
    expect(html).toContain('zenn-code-filename');
    expect(html).toContain('app.ts');
  });

  it('renders normal code fence without filename wrapper', () => {
    const md = '```ts\nconst x = 1;\n```';
    const html = provider.render(md);
    expect(html).not.toContain('zenn-code-frame');
  });

  it('has non-empty CSS', () => {
    expect(provider.css.length).toBeGreaterThan(0);
    expect(provider.css).toContain('.zenn-message');
  });
});
