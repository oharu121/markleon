import type { Provider } from '../types.js';

export function buildHtml(provider: Provider): string {
  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src 'nonce-${nonce}' 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src https: data:;">
  <title>Markleon Preview</title>
  <style nonce="${nonce}">
    body {
      margin: 0;
      padding: 0;
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      font-family: var(--vscode-font-family);
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: var(--vscode-editorWidget-background);
      border-bottom: 1px solid var(--vscode-panel-border);
      font-size: 12px;
    }
    .toolbar select {
      background: var(--vscode-dropdown-background);
      color: var(--vscode-dropdown-foreground);
      border: 1px solid var(--vscode-dropdown-border);
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 12px;
      cursor: pointer;
    }
    .toolbar label {
      color: var(--vscode-descriptionForeground);
    }
    #content {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
  </style>
  <style nonce="${nonce}">
    ${provider.css}
  </style>
</head>
<body>
  <div class="toolbar">
    <label for="provider-select">Provider:</label>
    <select id="provider-select"></select>
  </div>
  <div id="content"></div>
  <script nonce="${nonce}">
    (function() {
      const vscode = acquireVsCodeApi();
      const content = document.getElementById('content');
      const select = document.getElementById('provider-select');

      window.addEventListener('message', function(event) {
        const msg = event.data;
        switch (msg.type) {
          case 'update':
            content.innerHTML = msg.html;
            break;
          case 'providerList':
            select.innerHTML = '';
            msg.providers.forEach(function(p) {
              const opt = document.createElement('option');
              opt.value = p.id;
              opt.textContent = p.label;
              if (p.id === msg.activeId) opt.selected = true;
              select.appendChild(opt);
            });
            break;
        }
      });

      select.addEventListener('change', function() {
        vscode.postMessage({ type: 'switchProvider', providerId: select.value });
      });

      vscode.postMessage({ type: 'ready' });
    })();
  </script>
</body>
</html>`;
}

function getNonce(): string {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
