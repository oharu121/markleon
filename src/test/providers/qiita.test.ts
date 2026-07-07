import { describe, it, expect } from 'vitest';
import { createQiitaProvider } from '../../providers/qiita.js';

describe('Qiita provider', () => {
  const provider = createQiitaProvider();

  it('has correct id and label', () => {
    expect(provider.id).toBe('qiita');
    expect(provider.label).toBe('Qiita');
  });

  it('renders basic markdown to HTML wrapped in .qiita-body', () => {
    const html = provider.render('# Hello\n\nWorld');
    expect(html).toContain('class="qiita-body"');
    expect(html).toContain('Hello');
    expect(html).toContain('World');
  });

  it('renders :::note info block', () => {
    const md = ':::note info\nThis is info\n:::';
    const html = provider.render(md);
    expect(html).toContain('qiita-note');
    expect(html).toContain('qiita-note-info');
    expect(html).toContain('This is info');
  });

  it('renders :::note warn block', () => {
    const md = ':::note warn\nWarning text\n:::';
    const html = provider.render(md);
    expect(html).toContain('qiita-note-warn');
  });

  it('renders :::note alert block', () => {
    const md = ':::note alert\nAlert text\n:::';
    const html = provider.render(md);
    expect(html).toContain('qiita-note-alert');
  });

  it('renders bare :::note as info', () => {
    const md = ':::note\nBare note\n:::';
    const html = provider.render(md);
    expect(html).toContain('qiita-note-info');
  });

  it('renders code fence with lang:filename', () => {
    const md = '```ts:app.ts\nconst x = 1;\n```';
    const html = provider.render(md);
    expect(html).toContain('qiita-code-frame');
    expect(html).toContain('qiita-code-filename');
    expect(html).toContain('app.ts');
  });

  it('renders normal code fence without filename wrapper', () => {
    const md = '```ts\nconst x = 1;\n```';
    const html = provider.render(md);
    expect(html).not.toContain('qiita-code-frame');
  });

  it('has non-empty CSS', () => {
    expect(provider.css.length).toBeGreaterThan(0);
    expect(provider.css).toContain('.qiita-note');
  });
});
