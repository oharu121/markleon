import { describe, it, expect } from 'vitest';
import { buildHtml } from '../../webview/html-template.js';
import type { Provider } from '../../types.js';

const mockProvider: Provider = {
  id: 'test',
  label: 'Test',
  render: (md: string) => `<p>${md}</p>`,
  css: '.test { color: red; }',
};

describe('buildHtml', () => {
  it('returns valid HTML document', () => {
    const html = buildHtml(mockProvider);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('</html>');
  });

  it('includes CSP meta tag', () => {
    const html = buildHtml(mockProvider);
    expect(html).toContain('Content-Security-Policy');
    expect(html).toContain("default-src 'none'");
  });

  it('includes nonce on style and script tags', () => {
    const html = buildHtml(mockProvider);
    const nonceMatches = html.match(/nonce="([^"]+)"/g);
    expect(nonceMatches).not.toBeNull();
    expect(nonceMatches!.length).toBeGreaterThanOrEqual(3);
  });

  it('injects provider CSS', () => {
    const html = buildHtml(mockProvider);
    expect(html).toContain('.test { color: red; }');
  });

  it('includes provider dropdown', () => {
    const html = buildHtml(mockProvider);
    expect(html).toContain('provider-select');
    expect(html).toContain('<select');
  });

  it('includes content container', () => {
    const html = buildHtml(mockProvider);
    expect(html).toContain('id="content"');
  });

  it('includes postMessage script', () => {
    const html = buildHtml(mockProvider);
    expect(html).toContain('acquireVsCodeApi');
    expect(html).toContain('switchProvider');
  });

  it('generates unique nonces per call', () => {
    const html1 = buildHtml(mockProvider);
    const html2 = buildHtml(mockProvider);
    const nonce1 = html1.match(/nonce="([^"]+)"/)?.[1];
    const nonce2 = html2.match(/nonce="([^"]+)"/)?.[1];
    expect(nonce1).not.toBe(nonce2);
  });
});
