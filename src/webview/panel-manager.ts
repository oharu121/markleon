import * as vscode from 'vscode';
import type {
  Provider,
  WebviewToExtMessage,
  ExtToWebviewMessage,
} from '../types.js';
import {
  getProvider,
  getDefaultProviderId,
  getAllProviders,
} from '../providers/registry.js';
import { buildHtml } from './html-template.js';
import { debounce } from '../util/debounce.js';

const PROVIDER_STATE_KEY = 'markleon.providerId';

export class PanelManager {
  private panel: vscode.WebviewPanel | undefined;
  private activeProviderId: string;
  private disposables: vscode.Disposable[] = [];
  private debouncedUpdate: () => void;
  private lastMarkdownEditor: vscode.TextEditor | undefined;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.activeProviderId =
      context.workspaceState.get<string>(PROVIDER_STATE_KEY) ??
      getDefaultProviderId();
    this.debouncedUpdate = debounce(() => this.updateContent(), 300);
  }

  public showPreview(): void {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.Beside);
      this.updateContent();
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      'markleon.preview',
      'Markleon Preview',
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [],
      },
    );

    this.panel.webview.onDidReceiveMessage(
      (msg: WebviewToExtMessage) => {
        switch (msg.type) {
          case 'switchProvider':
            this.switchProvider(msg.providerId);
            break;
          case 'ready':
            this.updateContent();
            this.sendProviderList();
            break;
        }
      },
      undefined,
      this.disposables,
    );

    this.panel.onDidDispose(
      () => {
        this.panel = undefined;
        for (const d of this.disposables) {
          d.dispose();
        }
        this.disposables = [];
      },
      null,
      this.disposables,
    );

    this.lastMarkdownEditor = vscode.window.activeTextEditor?.document.languageId === 'markdown'
      ? vscode.window.activeTextEditor
      : undefined;

    this.disposables.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor?.document.languageId === 'markdown') {
          this.lastMarkdownEditor = editor;
          this.debouncedUpdate();
        }
      }),
    );

    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument((e) => {
        const activeDoc = vscode.window.activeTextEditor?.document;
        if (
          activeDoc &&
          e.document === activeDoc &&
          activeDoc.languageId === 'markdown'
        ) {
          this.debouncedUpdate();
        }
      }),
    );

    this.panel.webview.html = buildHtml(this.getActiveProvider());
  }

  public toggleProvider(): void {
    const providers = getAllProviders();
    const items = providers.map((p) => ({
      label: p.label,
      description: p.id === this.activeProviderId ? '(active)' : '',
      id: p.id,
    }));

    void vscode.window
      .showQuickPick(items, { placeHolder: 'Select preview provider' })
      .then((selected) => {
        if (selected) {
          this.switchProvider((selected as (typeof items)[number]).id);
        }
      });
  }

  public getActiveProviderId(): string {
    return this.activeProviderId;
  }

  private switchProvider(providerId: string): void {
    if (!getProvider(providerId)) return;
    this.activeProviderId = providerId;
    void this.context.workspaceState.update(PROVIDER_STATE_KEY, providerId);
    if (this.panel) {
      this.panel.webview.html = buildHtml(this.getActiveProvider());
      this.updateContent();
      this.sendProviderList();
    }
  }

  private updateContent(): void {
    const editor =
      vscode.window.activeTextEditor?.document.languageId === 'markdown'
        ? vscode.window.activeTextEditor
        : this.lastMarkdownEditor;
    if (!this.panel || !editor || editor.document.languageId !== 'markdown')
      return;

    const markdown = editor.document.getText();
    const provider = this.getActiveProvider();
    const renderedHtml = provider.render(markdown);

    const msg: ExtToWebviewMessage = {
      type: 'update',
      html: renderedHtml,
    };
    void this.panel.webview.postMessage(msg);
  }

  private sendProviderList(): void {
    if (!this.panel) return;
    const msg: ExtToWebviewMessage = {
      type: 'providerList',
      providers: getAllProviders().map((p) => ({ id: p.id, label: p.label })),
      activeId: this.activeProviderId,
    };
    void this.panel.webview.postMessage(msg);
  }

  private getActiveProvider(): Provider {
    return (
      getProvider(this.activeProviderId) ??
      getProvider(getDefaultProviderId())!
    );
  }

  public dispose(): void {
    this.panel?.dispose();
  }
}
