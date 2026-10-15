export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type YesNo = 'yes' | 'no';
export type TagAction = 'ASSIGN' | 'UNASSIGN';
export type WarmupStatus = 'ACTIVE' | 'INACTIVE';
export type LeadStatus = 'COMPLETED' | 'PAUSED' | 'UNPAUSED' | string;
export type WebhookEvent = 'FIRST_EMAIL_REPLIES' | 'ALL_EMAIL_REPLIES' | 'ALL_POSITIVE_REPLIES' | 'EMAIL_SENT' | 'BOUNCED_EMAIL' | 'UNIBOX_EMAIL_SENT' | 'SYSTEM_ALERT' | `LEAD_MARKED_AS_${string}`;

export interface Variation { variation: string | number; subject?: string; name?: string; body?: string; is_active?: YesNo | boolean; [key: string]: unknown }
export interface SequenceStep { step: number; wait_time: number; variations: Variation[]; [key: string]: unknown }
export interface CampaignPatch { camp_name?: string; status?: string; schedules?: unknown[]; sequences?: SequenceStep[]; first_wait_time?: number; email_accounts?: string[]; send_priority?: string | number; ignore_mailbox_limit?: boolean | YesNo; [key: string]: unknown }
export interface PlusVibeClientOptions { apiKey: string; workspaceId: string; baseUrl?: string; requestsPerSecond?: number; retries?: number; fetchImpl?: typeof fetch }
export interface RequestOptions { query?: Record<string, unknown>; body?: unknown; headers?: Record<string, string>; workspaceId?: string; signal?: AbortSignal; injectWorkspace?: boolean; workspaceIn?: 'auto' | 'query' | 'body' }
export interface Endpoint { method: HttpMethod; path: string; doc: string }

export class PlusVibeApiError extends Error { status?: number; method?: string; url?: string; body?: unknown; response?: unknown }
export class PlusVibeClient {
  constructor(options: PlusVibeClientOptions);
  apiKey: string; workspaceId: string; baseUrl: string;
  campaigns: any; leads: any; accounts: any; analytics: any; unibox: any; webhooks: any; tags: any; workspaceSettings: any; workspaces: any;
  withWorkspace(workspaceId: string): PlusVibeClient;
  request<T = unknown>(method: HttpMethod | string, path: string, options?: RequestOptions): Promise<T>;
  call<T = unknown>(endpoint: Endpoint, options?: RequestOptions): Promise<T>;
}
export function verifyWebhookSignature(rawBody: string | Uint8Array, signature: string, secret: string): Promise<boolean>;
export const ENDPOINTS: Readonly<Record<string, Record<string, Endpoint>>>;
export function flattenEndpoints(): Array<Endpoint & { group: string; name: string }>;
