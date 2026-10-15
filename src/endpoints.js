/**
 * PlusVibe regular-user endpoint registry.
 * Source of truth: https://developer.plusvibe.ai/llms.txt
 * Email Infra Provider partner endpoints are deliberately excluded.
 */
export const ENDPOINTS = Object.freeze({
  workspaces: {
    add: { method: 'POST', path: '/workspaces/add', doc: 'https://developer.plusvibe.ai/add-a-new-workspace-38494473e0.md' },
    copySettings: { method: 'POST', path: '/workspaces/copy', doc: 'https://developer.plusvibe.ai/copy-workspace-settings-38494474e0.md' },
    invite: { method: 'POST', path: '/workspaces/invite', doc: 'https://developer.plusvibe.ai/invite-a-user-to-a-workspace-40695617e0.md' },
    additionalFields: { method: 'GET', path: '/workspaces/additional-fields', doc: 'https://developer.plusvibe.ai/list-additional-fields-40806200e0.md' }
  },
  campaigns: {
    create: { method: 'POST', path: '/campaign/add/campaign', doc: 'https://developer.plusvibe.ai/create-a-new-campaign-38494475e0.md' },
    createSubsequence: { method: 'POST', path: '/campaign/add/subsequence', doc: 'https://developer.plusvibe.ai/create-a-new-subsequence-38494476e0.md' },
    list: { method: 'GET', path: '/campaign/list-all', doc: 'https://developer.plusvibe.ai/list-all-campaigns-38494478e0.md' },
    getName: { method: 'GET', path: '/campaign/get/name', doc: 'https://developer.plusvibe.ai/get-campaign-name-38494479e0.md' },
    getStatus: { method: 'GET', path: '/campaign/get/status', doc: 'https://developer.plusvibe.ai/get-campaign-status-38494480e0.md' },
    getAccounts: { method: 'GET', path: '/campaign/get/accounts', doc: 'https://developer.plusvibe.ai/get-campaign-email-accounts-38494481e0.md' },
    getEmails: { method: 'GET', path: '/unibox/campaign-emails', doc: 'https://developer.plusvibe.ai/get-campaign-emails-38494482e0.md' },
    variationStats: { method: 'GET', path: '/campaign/get/variation-stats', doc: 'https://developer.plusvibe.ai/get-campaign-variation-stats-38494483e0.md' },
    setName: { method: 'POST', path: '/campaign/set/name', doc: 'https://developer.plusvibe.ai/set-campaign-name-38494484e0.md' },
    launch: { method: 'POST', path: '/campaign/launch', doc: 'https://developer.plusvibe.ai/activate-campaign-38494486e0.md' },
    pause: { method: 'POST', path: '/campaign/pause', doc: 'https://developer.plusvibe.ai/pause-campaign-38494487e0.md' },
    update: { method: 'PATCH', path: '/campaign/update/campaign', doc: 'https://developer.plusvibe.ai/update-campaign-38494488e0.md' },
    deleteOrArchive: { method: 'DELETE', path: '/campaign/delete', doc: 'https://developer.plusvibe.ai/delete-or-archive-a-campaign-38494489e0.md' },
    duplicate: { method: 'POST', path: '/campaign/duplicate', doc: 'https://developer.plusvibe.ai/duplicate-campaign-42358299e0.md' },
    bulkAssignTags: { method: 'PUT', path: '/campaign/bulk-assign-tags', doc: 'https://developer.plusvibe.ai/bulk-assignremove-tags-from-campaigns-43462388e0.md' }
  },
  leads: {
    add: { method: 'POST', path: '/lead/add', doc: 'https://developer.plusvibe.ai/add-leads-to-a-campaign-38494490e0.md' },
    addToSubsequence: { method: 'POST', path: '/lead/add-lead-in-subseq', doc: 'https://developer.plusvibe.ai/add-leads-to-a-subsequence-campaign-38494491e0.md' },
    get: { method: 'GET', path: '/lead/get', doc: 'https://developer.plusvibe.ai/get-or-search-for-lead-38494492e0.md' },
    delete: { method: 'POST', path: '/lead/delete', doc: 'https://developer.plusvibe.ai/delete-leads-from-a-campaign-38494493e0.md' },
    updateData: { method: 'POST', path: '/lead/data/update', doc: 'https://developer.plusvibe.ai/lead-variablelabel-update-or-add-38494494e0.md' },
    workspaceLeads: { method: 'GET', path: '/lead/workspace-leads', doc: 'https://developer.plusvibe.ai/fetch-workspace-leads-38494495e0.md' },
    updateStatus: { method: 'POST', path: '/lead/update/status', doc: 'https://developer.plusvibe.ai/update-the-status-of-a-lead-38494496e0.md' },
    statusCounts: { method: 'GET', path: '/lead/count/lead-status', doc: 'https://developer.plusvibe.ai/get-lead-counts-by-status-38494497e0.md' }
  },
  accounts: {
    list: { method: 'GET', path: '/account/list', doc: 'https://developer.plusvibe.ai/list-all-email-accounts-in-the-workspace-38494498e0.md' },
    status: { method: 'GET', path: '/account/status', doc: 'https://developer.plusvibe.ai/get-email-account-status-38494499e0.md' },
    testVitals: { method: 'POST', path: '/account/test/vitals', doc: 'https://developer.plusvibe.ai/check-account-vitals-38494500e0.md' },
    delete: { method: 'POST', path: '/account/delete', doc: 'https://developer.plusvibe.ai/delete-email-account-38494503e0.md' },
    warmupStatsBulk: { method: 'GET', path: '/account/warmup-stats/bulk', doc: 'https://developer.plusvibe.ai/get-warmup-stats-per-mailbox-43864836e0.md' },
    warmupStatsOverall: { method: 'GET', path: '/account/warmup-stats/overall', doc: 'https://developer.plusvibe.ai/get-warmup-stats-workspace-level-43871189e0.md' },
    bulkAddSmtp: { method: 'POST', path: '/account/bulk-add-regular-accounts', doc: 'https://developer.plusvibe.ai/bulk-add-smtp-accounts-38494505e0.md' },
    bulkUpdate: { method: 'PUT', path: '/account/bulk-update', doc: 'https://developer.plusvibe.ai/bulk-update-email-accounts-38494506e0.md' },
    bulkUpdateWarmup: { method: 'PATCH', path: '/account/bulk-update-warmup', doc: 'https://developer.plusvibe.ai/bulk-update-email-account-warmup-status-38494507e0.md' },
    bulkAssignTags: { method: 'PUT', path: '/account/bulk-assign-tags', doc: 'https://developer.plusvibe.ai/bulk-assignremove-tags-from-email-accounts-38494508e0.md' },
    bulkReconnect: { method: 'POST', path: '/account/bulk-reconnect', doc: 'https://developer.plusvibe.ai/bulk-reconnect-email-accounts-38494509e0.md' },
    emailStats: { method: 'GET', path: '/account/email-stats', doc: 'https://developer.plusvibe.ai/get-workspace-email-stats-for-a-date-range-38494510e0.md' },
    emailStatsBulk: { method: 'GET', path: '/account/email-stats/bulk', doc: 'https://developer.plusvibe.ai/get-email-account-stats-for-a-date-range-per-mailbox-43054283e0.md' },
    moveWorkspace: { method: 'POST', path: '/account/move-workspace', doc: 'https://developer.plusvibe.ai/move-email-accounts-to-another-workspace-40817914e0.md' }
  },
  analytics: {
    campaignSummary: { method: 'GET', path: '/analytics/campaign/summary', doc: 'https://developer.plusvibe.ai/get-campaign-summary-38494511e0.md' },
    workspacesSummary: { method: 'GET', path: '/analytics/workspaces/summary', doc: 'https://developer.plusvibe.ai/get-workspaces-summary-42549930e0.md' },
    workspacesPerformance: { method: 'GET', path: '/analytics/workspaces/performance', doc: 'https://developer.plusvibe.ai/get-workspaces-performance-42549931e0.md' }
  },
  unibox: {
    threads: { method: 'GET', path: '/unibox/threads', doc: 'https://developer.plusvibe.ai/get-email-threads-conversations-41824471e0.md' },
    emails: { method: 'GET', path: '/unibox/emails', doc: 'https://developer.plusvibe.ai/get-emails-38494515e0.md' },
    unreadCount: { method: 'GET', path: '/unibox/emails/count/unread', doc: 'https://developer.plusvibe.ai/get-count-of-unread-emails-38494517e0.md' },
    reply: { method: 'POST', path: '/unibox/emails/reply', doc: 'https://developer.plusvibe.ai/reply-to-an-email-38494518e0.md' },
    forward: { method: 'POST', path: '/unibox/emails/forward', doc: 'https://developer.plusvibe.ai/forward-an-existing-email-38494519e0.md' },
    compose: { method: 'POST', path: '/unibox/emails/compose', doc: 'https://developer.plusvibe.ai/compose-new-email-38494520e0.md' },
    send: { method: 'POST', path: '/unibox/emails/send', doc: 'https://developer.plusvibe.ai/send-to-any-address-40707674e0.md' }
  },
  webhooks: {
    add: { method: 'POST', path: '/hook/add', doc: 'https://developer.plusvibe.ai/add-a-new-webhook-38494528e0.md' },
    list: { method: 'GET', path: '/hook/list', doc: 'https://developer.plusvibe.ai/list-webhooks-38494529e0.md' },
    delete: { method: 'DELETE', path: '/hook/del', doc: 'https://developer.plusvibe.ai/delete-webhooks-38494530e0.md' }
  },
  tags: {
    list: { method: 'GET', path: '/tags/list', doc: 'https://developer.plusvibe.ai/list-tags-38494531e0.md' },
    create: { method: 'POST', path: '/tags/create', doc: 'https://developer.plusvibe.ai/create-a-new-tag-38494532e0.md' },
    update: { method: 'PUT', path: '/tags/update', doc: 'https://developer.plusvibe.ai/update-an-existing-tag-38494533e0.md' }
  },
  workspaceSettings: {
    get: { method: 'GET', path: '/workspace-settings/', doc: 'https://developer.plusvibe.ai/get-workspace-settings-41824281e0.md' },
    update: { method: 'PATCH', path: '/workspace-settings/update', doc: 'https://developer.plusvibe.ai/update-workspace-settings-41824282e0.md' },
    labels: { method: 'GET', path: '/workspace-settings/lead-labels', doc: 'https://developer.plusvibe.ai/list-lead-labels-41824283e0.md' },
    addLabel: { method: 'POST', path: '/workspace-settings/lead-labels/add', doc: 'https://developer.plusvibe.ai/add-custom-lead-label-41824284e0.md' },
    deleteLabels: { method: 'DELETE', path: '/workspace-settings/lead-labels/delete', doc: 'https://developer.plusvibe.ai/delete-custom-lead-labels-41824285e0.md' }
  }
});

export function flattenEndpoints() {
  return Object.entries(ENDPOINTS).flatMap(([group, items]) =>
    Object.entries(items).map(([name, endpoint]) => ({ group, name, ...endpoint }))
  );
}
