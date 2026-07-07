import MarkdownIt from 'markdown-it';
import markdownItContainer from 'markdown-it-container';
import type { Provider } from '../types.js';

const QIITA_CSS = `
.qiita-body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  line-height: 1.7;
  color: var(--vscode-editor-foreground);
}

.qiita-body h1,
.qiita-body h2,
.qiita-body h3,
.qiita-body h4,
.qiita-body h5,
.qiita-body h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.qiita-body h1 {
  font-size: 1.8em;
  border-bottom: 1px solid var(--vscode-panel-border, #e5e7eb);
  padding-bottom: 0.3em;
}

.qiita-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid var(--vscode-panel-border, #e5e7eb);
  padding-bottom: 0.3em;
}

.qiita-body a {
  color: var(--vscode-textLink-foreground, #4078c0);
  text-decoration: none;
}
.qiita-body a:hover { text-decoration: underline; }

.qiita-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: var(--vscode-textCodeBlock-background, rgba(27, 31, 35, 0.05));
  border-radius: 3px;
  font-family: var(--vscode-editor-font-family, monospace);
}

.qiita-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: var(--vscode-textCodeBlock-background, #f6f8fa);
  border-radius: 6px;
}

.qiita-body pre code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  background-color: transparent;
  border-radius: 0;
}

.qiita-body blockquote {
  margin: 16px 0;
  padding: 0 1em;
  color: var(--vscode-descriptionForeground, #6a737d);
  border-left: 4px solid var(--vscode-panel-border, #dfe2e5);
}

.qiita-body table {
  border-collapse: collapse;
  width: 100%;
  margin: 16px 0;
}
.qiita-body table th,
.qiita-body table td {
  padding: 8px 16px;
  border: 1px solid var(--vscode-panel-border, #dfe2e5);
}
.qiita-body table th {
  font-weight: 600;
  background-color: var(--vscode-editorWidget-background, #f6f8fa);
}

.qiita-body img { max-width: 100%; height: auto; }

.qiita-body hr {
  border: none;
  border-top: 1px solid var(--vscode-panel-border, #e5e7eb);
  margin: 24px 0;
}

/* Note blocks */
.qiita-note {
  padding: 16px 20px;
  margin: 16px 0;
  border-radius: 6px;
  border-left: 4px solid;
}
.qiita-note > *:first-child { margin-top: 0; }
.qiita-note > *:last-child { margin-bottom: 0; }

.qiita-note-info {
  background-color: rgba(59, 130, 246, 0.1);
  border-left-color: #3b82f6;
}
.qiita-note-warn {
  background-color: rgba(234, 179, 8, 0.1);
  border-left-color: #eab308;
}
.qiita-note-alert {
  background-color: rgba(239, 68, 68, 0.1);
  border-left-color: #ef4444;
}

/* Code block with filename */
.qiita-code-frame {
  margin: 16px 0;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--vscode-panel-border, #e5e7eb);
}
.qiita-code-filename {
  padding: 6px 16px;
  font-size: 12px;
  font-family: var(--vscode-editor-font-family, monospace);
  background-color: var(--vscode-editorWidget-background, #f3f4f6);
  border-bottom: 1px solid var(--vscode-panel-border, #e5e7eb);
  color: var(--vscode-descriptionForeground, #6b7280);
}
.qiita-code-frame pre {
  margin: 0;
  border-radius: 0;
  border: none;
}

/* Task list */
.qiita-body ul li input[type='checkbox'] {
  margin-right: 0.5em;
}
`;

function createMarkdownIt(): MarkdownIt {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: false,
  });

  // :::note info / :::note warn / :::note alert
  const noteTypes = ['info', 'warn', 'alert'];
  for (const noteType of noteTypes) {
    md.use(markdownItContainer, `note-${noteType}`, {
      validate(params: string) {
        return params.trim() === `note ${noteType}`;
      },
      render(tokens: { nesting: number }[], idx: number) {
        if (tokens[idx].nesting === 1) {
          return `<div class="qiita-note qiita-note-${noteType}">\n`;
        }
        return '</div>\n';
      },
    });
  }

  // Bare :::note (defaults to info)
  md.use(markdownItContainer, 'note', {
    validate(params: string) {
      return params.trim() === 'note';
    },
    render(tokens: { nesting: number }[], idx: number) {
      if (tokens[idx].nesting === 1) {
        return '<div class="qiita-note qiita-note-info">\n';
      }
      return '</div>\n';
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
      return `<div class="qiita-code-frame"><div class="qiita-code-filename">${md.utils.escapeHtml(filename)}</div>${rendered}</div>`;
    }

    return defaultFence(tokens, idx, options, env, self);
  };

  return md;
}

export function createQiitaProvider(): Provider {
  const md = createMarkdownIt();

  return {
    id: 'qiita',
    label: 'Qiita',
    render(markdown: string): string {
      return `<div class="qiita-body">${md.render(markdown)}</div>`;
    },
    css: QIITA_CSS,
  };
}
