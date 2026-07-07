import * as vscode from 'vscode';
import { initProviders } from './providers/registry.js';
import { PanelManager } from './webview/panel-manager.js';
import { insertNote } from './commands/insert-note.js';

export function activate(context: vscode.ExtensionContext): void {
  initProviders();

  const panelManager = new PanelManager(context);

  context.subscriptions.push(
    vscode.commands.registerCommand('markleon.showPreview', () => {
      panelManager.showPreview();
    }),
    vscode.commands.registerCommand('markleon.toggleProvider', () => {
      panelManager.toggleProvider();
    }),
    vscode.commands.registerCommand('markleon.insertNote', () => {
      insertNote(panelManager.getActiveProviderId());
    }),
    { dispose: () => panelManager.dispose() },
  );
}

export function deactivate(): void {
  // Cleanup handled by disposables
}
