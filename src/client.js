import { ENDPOINTS } from './endpoints.js';

const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export class PlusVibeApiError extends Error {
  constructor(message, { status, method, url, body, response } = {}) {
    super(message);
    this.name = 'PlusVibeApiError';
    this.status = status;
    this.method = method;
    this.url = url;
    this.body = body;
    this.response = response;
  }
}

export class PlusVibeClient {
  constructor({ apiKey, workspaceId, baseUrl = 'https://api.plusvibe.ai/api/v1', requestsPerSecond = 5, retries = 2, fetchImpl = globalThis.fetch } = {}) {
    if (!apiKey) throw new TypeError('apiKey is required');
    if (!workspaceId) throw new TypeError('workspaceId is required');
    if (typeof fetchImpl !== 'function') throw new TypeError('fetch is unavailable; use Node 18+ or pass fetchImpl');
    this.apiKey = apiKey;
    this.workspaceId = workspaceId;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.requestsPerSecond = Math.max(1, requestsPerSecond);
    this.retries = Math.max(0, retries);
    this.fetchImpl = fetchImpl;
    this._rateChain = Promise.resolve();
    this._lastRequestAt = 0;

    this.campaigns = new CampaignsApi(this);
    this.leads = new LeadsApi(this);
    this.accounts = new AccountsApi(this);
    this.analytics = new AnalyticsApi(this);
    this.unibox = new UniboxApi(this);
    this.webhooks = new WebhooksApi(this);
    this.tags = new TagsApi(this);
    this.workspaceSettings = new WorkspaceSettingsApi(this);
    this.workspaces = new WorkspacesApi(this);
  }

  withWorkspace(workspaceId) {
    return new PlusVibeClient({
      apiKey: this.apiKey,
      workspaceId,
      baseUrl: this.baseUrl,
      requestsPerSecond: this.requestsPerSecond,
      retries: this.retries,
      fetchImpl: this.fetchImpl
    });
  }

  async _throttle() {
    const interval = Math.ceil(1000 / this.requestsPerSecond);
    const previous = this._rateChain;
    let release;
    this._rateChain = new Promise((resolve) => { release = resolve; });
    await previous;
    const wait = Math.max(0, this._lastRequestAt + interval - Date.now());
    if (wait) await sleep(wait);
    this._lastRequestAt = Date.now();
    release();
  }

  async request(method, path, { query, body, headers, workspaceId, signal, injectWorkspace = true, workspaceIn = 'auto' } = {}) {
    const effectiveWorkspaceId = workspaceId ?? this.workspaceId;
    const upper = method.toUpperCase();
    const url = new URL(this.baseUrl + (path.startsWith('/') ? path : `/${path}`));
    const requestHeaders = { 'x-api-key': this.apiKey, ...headers };
    let requestBody = body;
    const resolvedWorkspaceIn = workspaceIn === 'auto' ? ((upper === 'GET' || upper === 'HEAD') ? 'query' : 'body') : workspaceIn;

    if (upper === 'GET' || upper === 'HEAD') {
      if (injectWorkspace && resolvedWorkspaceIn === 'query') url.searchParams.set('workspace_id', effectiveWorkspaceId);
      for (const [key, value] of Object.entries(query ?? {})) {
        if (value === undefined || value === null || value === '') continue;
        url.searchParams.set(key, Array.isArray(value) ? value.join(',') : String(value));
      }
    } else {
      if (injectWorkspace && resolvedWorkspaceIn === 'body' && requestBody && typeof requestBody === 'object' && !(requestBody instanceof FormData)) {
        requestBody = { ...requestBody, workspace_id: effectiveWorkspaceId };
      } else if (injectWorkspace && resolvedWorkspaceIn === 'body' && requestBody == null) {
        requestBody = { workspace_id: effectiveWorkspaceId };
      }
      if (injectWorkspace && resolvedWorkspaceIn === 'query') url.searchParams.set('workspace_id', effectiveWorkspaceId);
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          if (value === undefined || value === null || value === '') continue;
          url.searchParams.set(key, Array.isArray(value) ? value.join(',') : String(value));
        }
      }
    }

    if (requestBody != null && !(requestBody instanceof FormData)) {
      requestHeaders['content-type'] ??= 'application/json';
    }

    let lastError;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      await this._throttle();
      try {
        const response = await this.fetchImpl(url, {
          method: upper,
          headers: requestHeaders,
          body: requestBody == null ? undefined : requestBody instanceof FormData ? requestBody : JSON.stringify(requestBody),
          signal
        });
        const text = await response.text();
        let payload = null;
        if (text) {
          try { payload = JSON.parse(text); } catch { payload = text; }
        }
        if (response.ok) return payload;

        const error = new PlusVibeApiError(`PlusVibe ${upper} ${url.pathname} failed with ${response.status}`, {
          status: response.status, method: upper, url: url.toString(), body: requestBody, response: payload
        });
        if (!RETRYABLE.has(response.status) || attempt === this.retries) throw error;
        const retryAfter = Number(response.headers.get('retry-after'));
        await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 500 * (2 ** attempt));
        lastError = error;
      } catch (error) {
        if (error instanceof PlusVibeApiError) throw error;
        lastError = error;
        if (attempt === this.retries) throw error;
        await sleep(500 * (2 ** attempt));
      }
    }
    throw lastError;
  }

  call(endpoint, options = {}) {
    return this.request(endpoint.method, endpoint.path, options);
  }
}

class BaseApi {
  constructor(client) { this.client = client; }
  call(endpoint, options) { return this.client.call(endpoint, options); }
}

class CampaignsApi extends BaseApi {
  create(campName) { return this.call(ENDPOINTS.campaigns.create, { body: { camp_name: campName } }); }
  createSubsequence({ name, parentCampId, events }) { return this.call(ENDPOINTS.campaigns.createSubsequence, { body: { name, parent_camp_id: parentCampId, events } }); }
  list(query = {}) { return this.call(ENDPOINTS.campaigns.list, { query }); }
  get(campaignId) { return this.list({ campaign_id: campaignId, limit: 1 }); }
  getName(campaignId) { return this.call(ENDPOINTS.campaigns.getName, { query: { campaign_id: campaignId } }); }
  getStatus(campaignId) { return this.call(ENDPOINTS.campaigns.getStatus, { query: { campaign_id: campaignId } }); }
  getAccounts(campaignId) { return this.call(ENDPOINTS.campaigns.getAccounts, { query: { campaign_id: campaignId } }); }
  getEmails({ leadId, campaignId, ...query } = {}) { return this.call(ENDPOINTS.campaigns.getEmails, { query: { lead_id: leadId, campaign_id: campaignId, ...query } }); }
  variationStats(campaignId, query = {}) { return this.call(ENDPOINTS.campaigns.variationStats, { query: { campaign_id: campaignId, ...query } }); }
  rename(campaignId, name) { return this.call(ENDPOINTS.campaigns.setName, { body: { campaign_id: campaignId, name } }); }
  launch(campaignId, { activateSubsequences = 'no' } = {}) { return this.call(ENDPOINTS.campaigns.launch, { body: { campaign_id: campaignId, activate_subsequences: activateSubsequences } }); }
  pause(campaignId) { return this.call(ENDPOINTS.campaigns.pause, { body: { campaign_id: campaignId } }); }
  update(campaignId, patch) { return this.call(ENDPOINTS.campaigns.update, { body: { campaign_id: campaignId, ...patch } }); }
  deleteOrArchive(campaignId, { archive = false, saveLeadData = false } = {}) {
    return this.call(ENDPOINTS.campaigns.deleteOrArchive, { body: { campaign_id: campaignId, is_archive: archive, is_save_lead_data: saveLeadData } });
  }
  duplicate(campaignId, { campName, duplicateSubsequences = 'yes' } = {}) {
    return this.call(ENDPOINTS.campaigns.duplicate, { body: { campaign_id: campaignId, camp_name: campName, duplicate_subsequences: duplicateSubsequences } });
  }
  bulkAssignTags(ids, tagId, action = 'ASSIGN') { return this.call(ENDPOINTS.campaigns.bulkAssignTags, { body: { ids, tag_id: tagId, action } }); }

  async _one(campaignId) {
    const result = await this.get(campaignId);
    const candidates = Array.isArray(result) ? result : result?.campaigns ?? result?.data ?? [];
    const campaign = candidates.find?.((x) => x.id === campaignId || x._id === campaignId) ?? candidates[0] ?? (result?.id ? result : null);
    if (!campaign) throw new Error(`Campaign ${campaignId} not found in /campaign/list-all response`);
    return campaign;
  }

  async setStepDelay(campaignId, step, waitTime) {
    const campaign = await this._one(campaignId);
    const sequences = structuredClone(campaign.sequences ?? []);
    const target = sequences.find((s) => Number(s.step) === Number(step));
    if (!target) throw new Error(`Step ${step} not found`);
    target.wait_time = waitTime;
    return this.update(campaignId, { sequences });
  }

  async setVariation(campaignId, { step, variation, subject, body, name }) {
    const campaign = await this._one(campaignId);
    const sequences = structuredClone(campaign.sequences ?? []);
    const targetStep = sequences.find((s) => Number(s.step) === Number(step));
    if (!targetStep) throw new Error(`Step ${step} not found`);
    const targetVariation = (targetStep.variations ?? []).find((v) => String(v.variation) === String(variation));
    if (!targetVariation) throw new Error(`Variation ${variation} not found in step ${step}`);
    if (subject !== undefined) targetVariation.subject = subject;
    if (body !== undefined) targetVariation.body = body;
    if (name !== undefined) targetVariation.name = name;
    return this.update(campaignId, { sequences });
  }

  setEmailAccounts(campaignId, emailAccountIds) { return this.update(campaignId, { email_accounts: emailAccountIds }); }
  replaceSequences(campaignId, sequences, extraPatch = {}) { return this.update(campaignId, { ...extraPatch, sequences }); }
}

class LeadsApi extends BaseApi {
  add(campaignId, leads, options = {}) { return this.call(ENDPOINTS.leads.add, { body: { campaign_id: campaignId, ...options, leads } }); }
  addToSubsequence(subseqId, parentLeadIds) { return this.call(ENDPOINTS.leads.addToSubsequence, { body: { subseq_id: subseqId, parent_lead_ids: parentLeadIds } }); }
  get(query) { return this.call(ENDPOINTS.leads.get, { query }); }
  delete(campaignId, payload) { return this.call(ENDPOINTS.leads.delete, { body: { campaign_id: campaignId, ...payload } }); }
  updateData(campaignId, email, variables) { return this.call(ENDPOINTS.leads.updateData, { body: { campaign_id: campaignId, email, variables } }); }
  list(query = {}) { return this.call(ENDPOINTS.leads.workspaceLeads, { query }); }
  updateStatus(campaignId, leadId, newStatus) { return this.call(ENDPOINTS.leads.updateStatus, { body: { campaign_id: campaignId, lead_id: leadId, new_status: newStatus } }); }
  statusCounts(query = {}) { return this.call(ENDPOINTS.leads.statusCounts, { query }); }
}

class AccountsApi extends BaseApi {
  list(query = {}) { return this.call(ENDPOINTS.accounts.list, { query }); }
  status(email) { return this.call(ENDPOINTS.accounts.status, { query: { email } }); }
  testVitals(accounts) { return this.call(ENDPOINTS.accounts.testVitals, { body: { accounts } }); }
  delete(email) { return this.call(ENDPOINTS.accounts.delete, { body: { email } }); }
  bulkAddSmtp(accounts) { return this.call(ENDPOINTS.accounts.bulkAddSmtp, { body: { accounts } }); }
  bulkUpdate(ids, patch) { return this.call(ENDPOINTS.accounts.bulkUpdate, { body: { ids, ...patch } }); }
  setWarmup(ids, warmupStatus) { return this.call(ENDPOINTS.accounts.bulkUpdateWarmup, { body: { ids, warmup_status: warmupStatus } }); }
  bulkAssignTags(ids, tagId, action = 'ASSIGN') { return this.call(ENDPOINTS.accounts.bulkAssignTags, { body: { ids, tag_id: tagId, action } }); }
  bulkReconnect(ids) { return this.call(ENDPOINTS.accounts.bulkReconnect, { body: { ids } }); }
  moveWorkspace(ids, toWorkspaceId) { return this.call(ENDPOINTS.accounts.moveWorkspace, { body: { ids, to_workspace_id: toWorkspaceId } }); }
  workspaceStats(query) { return this.call(ENDPOINTS.accounts.emailStats, { query }); }
  mailboxStats(query) { return this.call(ENDPOINTS.accounts.emailStatsBulk, { query }); }
  workspaceWarmupStats(query) { return this.call(ENDPOINTS.accounts.warmupStatsOverall, { query }); }
  mailboxWarmupStats(query) { return this.call(ENDPOINTS.accounts.warmupStatsBulk, { query }); }
}

class AnalyticsApi extends BaseApi {
  campaignSummary(campaignId) { return this.call(ENDPOINTS.analytics.campaignSummary, { query: { campaign_id: campaignId } }); }
  workspacesSummary(query = {}) { return this.call(ENDPOINTS.analytics.workspacesSummary, { query }); }
  workspacesPerformance(query = {}) { return this.call(ENDPOINTS.analytics.workspacesPerformance, { query }); }
}

class UniboxApi extends BaseApi {
  threads(query = {}) { return this.call(ENDPOINTS.unibox.threads, { query }); }
  emails(query = {}) { return this.call(ENDPOINTS.unibox.emails, { query }); }
  unreadCount() { return this.call(ENDPOINTS.unibox.unreadCount); }
  reply(payload) { return this.client.request(ENDPOINTS.unibox.reply.method, ENDPOINTS.unibox.reply.path, { body: payload, workspaceIn: 'query' }); }
  forward(payload) { return this.client.request(ENDPOINTS.unibox.forward.method, ENDPOINTS.unibox.forward.path, { body: payload, workspaceIn: 'query' }); }
  compose(payload) { return this.client.request(ENDPOINTS.unibox.compose.method, ENDPOINTS.unibox.compose.path, { body: payload, workspaceIn: 'query' }); }
  send(payload) { return this.client.request(ENDPOINTS.unibox.send.method, ENDPOINTS.unibox.send.path, { body: payload, workspaceIn: 'query' }); }
}

class WebhooksApi extends BaseApi {
  add(payload) { return this.call(ENDPOINTS.webhooks.add, { body: payload }); }
  list() { return this.call(ENDPOINTS.webhooks.list); }
  delete(ids) { return this.call(ENDPOINTS.webhooks.delete, { body: { ids } }); }
}

class TagsApi extends BaseApi {
  list(query = {}) { return this.call(ENDPOINTS.tags.list, { query }); }
  create({ name, color, description }) { return this.call(ENDPOINTS.tags.create, { body: { name, color, description } }); }
  update(tagId, patch) { return this.call(ENDPOINTS.tags.update, { body: { tag_id: tagId, ...patch } }); }
}

class WorkspaceSettingsApi extends BaseApi {
  get() { return this.call(ENDPOINTS.workspaceSettings.get); }
  update(patch) { return this.call(ENDPOINTS.workspaceSettings.update, { body: patch }); }
  labels() { return this.call(ENDPOINTS.workspaceSettings.labels); }
  addLabel(name, sentiment) { return this.call(ENDPOINTS.workspaceSettings.addLabel, { body: { name, sentiment } }); }
  deleteLabels(ids) { return this.call(ENDPOINTS.workspaceSettings.deleteLabels, { body: { ids } }); }
}

class WorkspacesApi extends BaseApi {
  add(workspaceName) { return this.call(ENDPOINTS.workspaces.add, { body: { workspace_name: workspaceName } }); }
  copySettings(payload) { return this.call(ENDPOINTS.workspaces.copySettings, { body: payload }); }
  invite(email, roleName) { return this.call(ENDPOINTS.workspaces.invite, { body: { email, role_name: roleName } }); }
  additionalFields(query = {}) { return this.call(ENDPOINTS.workspaces.additionalFields, { query }); }
}

export async function verifyWebhookSignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const normalized = signature.trim().toLowerCase().replace(/^sha256=/, '');
  if (!/^[0-9a-f]{64}$/.test(normalized)) return false;
  const sig = new Uint8Array(normalized.match(/.{2}/g).map((byte) => parseInt(byte, 16)));
  const data = typeof rawBody === 'string' ? encoder.encode(rawBody) : rawBody;
  return crypto.subtle.verify('HMAC', key, sig, data);
}
