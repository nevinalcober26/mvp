export type PosStatus = 'active' | 'error' | 'syncing' | 'disconnected';

export interface PosConnection {
  id: string;
  brand: string;
  label: string;
  status: PosStatus;
  lastSync: string;
  terminalId: string;
  location?: string;
  revenueCenter?: string;
  providerId?: string;
}
