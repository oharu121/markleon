export interface Provider {
  readonly id: string;
  readonly label: string;
  render(markdown: string): string;
  readonly css: string;
}

export type WebviewToExtMessage =
  | { type: 'switchProvider'; providerId: string }
  | { type: 'ready' };

export type ExtToWebviewMessage =
  | { type: 'update'; html: string }
  | {
      type: 'providerList';
      providers: Array<{ id: string; label: string }>;
      activeId: string;
    };
