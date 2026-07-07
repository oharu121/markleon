import MarkdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';
import type { Provider } from '../types.js';

const ZENN_CSS = `
.zenn-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  line-height: 1.8;
  color: var(--vscode-editor-foreground);
}

.zenn-body h1,
.zenn-body h2,
.zenn-body h3,
.zenn-body h4,
.zenn-body h5,
.zenn-body h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 700;
}

.zenn-body h1 { font-size: 1.8em; }
.zenn-body h2 {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--vscode-panel-border, #e5e7eb);
}
.zenn-body h3 { font-size: 1.25em; }

.zenn-body a {
  color: var(--vscode-textLink-foreground, #3ea8ff);
  text-decoration: none;
}
.zenn-body a:hover { text-decoration: underline; }

.zenn-body code {
  padding: 0.2em 0.4em;
  font-size: 85%;
  background-color: var(--vscode-textCodeBlock-background, rgba(27, 31, 35, 0.05));
  border-radius: 4px;
  font-family: var(--vscode-editor-font-family, monospace);
}

.zenn-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.5;
  background-color: var(--vscode-textCodeBlock-background, #1e1e1e);
  border-radius: 8px;
}

.zenn-body pre code {
  padding: 0;
  font-size: 100%;
  background-color: transparent;
  border-radius: 0;
}

.zenn-body blockquote {
  margin: 16px 0;
  padding: 0 1em;
  color: var(--vscode-descriptionForeground, #6a737d);
  border-left: 3px solid var(--vscode-panel-border, #dfe2e5);
}

.zenn-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}
.zenn-body table th,
.zenn-body table td {
  padding: 8px 16px;
  border: 1px solid var(--vscode-panel-border, #dfe2e5);
}
.zenn-body table th {
  font-weight: 600;
  background-color: var(--vscode-editorWidget-background, #f6f8fa);
}

.zenn-body img { max-width: 100%; height: auto; }

.zenn-body hr {
  border: none;
  border-top: 1px solid var(--vscode-panel-border, #e5e7eb);
  margin: 24px 0;
}

/* :::message block */
.zenn-message {
  padding: 16px 20px;
  margin: 24px 0;
  border-radius: 8px;
  background-color: rgba(59, 130, 246, 0.08);
  border-left: 4px solid #3ea8ff;
}
.zenn-message > *:first-child { margin-top: 0; }
.zenn-message > *:last-child { margin-bottom: 0; }

/* :::message alert */
.zenn-message-alert {
  background-color: rgba(234, 179, 8, 0.08);
  border-left-color: #f5a623;
}

/* :::details block */
.zenn-body details {
  margin: 24px 0;
  border: 1px solid var(--vscode-panel-border, #e5e7eb);
  border-radius: 8px;
  overflow: hidden;
}
.zenn-body details summary {
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 600;
  background-color: var(--vscode-editorWidget-background, #f6f8fa);
  user-select: none;
}
.zenn-body details summary:hover {
  background-color: var(--vscode-list-hoverBackground, #eaeaea);
}
.zenn-body details > :not(summary) {
  padding: 0 16px;
}

/* Code block with filename */
.zenn-code-frame {
  margin: 16px 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vscode-panel-border, #e5e7eb);
}
.zenn-code-filename {
  padding: 6px 16px;
  font-size: 12px;
  font-family: var(--vscode-editor-font-family, monospace);
  background-color: var(--vscode-editorWidget-background, #f3f4f6);
  border-bottom: 1px solid var(--vscode-panel-border, #e5e7eb);
  color: var(--vscode-descriptionForeground, #6b7280);
}
.zenn-code-frame pre {
  margin: 0;
  border-radius: 0;
  border: none;
}

/* Task list */
.zenn-body ul li input[type='checkbox'] {
  margin-right: 0.5em;
}
`;

function createMarkdownIt(): MarkdownIt {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: false,
  });

  // :::message / :::message alert
  md.use(markdownItContainer, 'message-alert', {
    validate(params: string) {
      return params.trim() === 'message alert';
    },
    render(tokens: { nesting: number }[], idx: number) {
      if (tokens[idx].nesting === 1) {
        return '<div class="zenn-message zenn-message-alert">\n';
      }
      return '</div>\n';
    },
  });

  md.use(markdownItContainer, 'message', {
    validate(params: string) {
      return params.trim() === 'message';
    },
    render(tokens: { nesting: number }[], idx: number) {
      if (tokens[idx].nesting === 1) {
        return '<div class="zenn-message">\n';
      }
      return '</div>\n';
    },
  });

  // :::details Title
  md.use(markdownItContainer, 'details', {
    validate(params: string) {
      return params.trim().startsWith('details');
    },
    render(tokens: { nesting: number; info: string }[], idx: number) {
      if (tokens[idx].nesting === 1) {
        const title = tokens[idx].info.trim().slice('details'.length).trim();
        const escapedTitle = md.utils.escapeHtml(title || 'Details');
        return `<details><summary>${escapedTitle}</summary>\n`;
      }
      return '</details>\n';
    },
  });

  // Override fence renderer for lang:filename pattern
  const defaultFence =
    md.renderer.rules.fence ||
    function (tokens, idx, options, _env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = token.info ? token.info.trim() : '';
    const colonIndex = info.indexOf(':');

    if (colonIndex > 0) {
      const lang = info.slice(0, colonIndex);
      const filename = info.slice(colonIndex + 1);
      token.info = lang;
      const rendered = defaultFence(tokens, idx, options, env, self);
      return `<div class="zenn-code-frame"><div class="zenn-code-filename">${md.utils.escapeHtml(filename)}</div>${rendered}</div>`;
    }

    return defaultFence(tokens, idx, options, env, self);
  };

  return md;
}

export function createZennProvider(): Provider {
  const md = createMarkdownIt();

  return {
    id: 'zenn',
    label: 'Zenn',
    render(markdown: string): string {
      return `<div class="zenn-body">${md.render(markdown)}</div>`;
    },
    css: ZENN_CSS,
  };
}
