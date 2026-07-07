import * as vscode from 'vscode';

export function insertNote(activeProviderId: string): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'markdown') return;

  let snippet: string;
  if (activeProviderId === 'zenn') {
    snippet = ':::message\n$0\n:::';
  } else {
    snippet = ':::note info\n$0\n:::';
  }

  void editor.insertSnippet(new vscode.SnippetString(snippet));
}
