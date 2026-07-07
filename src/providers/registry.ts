import type { Provider } from '../types.js';
import { createZennProvider } from './zenn.js';
import { createQiitaProvider } from './qiita.js';

const providers = new Map<string, Provider>();

export function initProviders(): void {
  const zenn = createZennProvider();
  const qiita = createQiitaProvider();
  providers.set(zenn.id, zenn);
  providers.set(qiita.id, qiita);
}

export function getProvider(id: string): Provider | undefined {
  return providers.get(id);
}

export function getDefaultProviderId(): string {
  return 'zenn';
}

export function getAllProviders(): Provider[] {
  return Array.from(providers.values());
}
