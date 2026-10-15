# PlusVibe SDK

Agent-friendly, zero-runtime-dependency JavaScript SDK and offline reference for PlusVibe's regular-user API.

**Canonical docs source:** `https://developer.plusvibe.ai/llms.txt`

**Deliberately excluded:** the `Email Infra Provider` partner-only section and its provider OAuth/upload endpoints.

## What this repository is for

Use it when an agent needs to inspect or modify PlusVibe without rediscovering the API every time:

- create, list, rename, launch, pause, duplicate, archive, or delete campaigns
- inspect parent campaigns and subsequences
- create subsequences from reply/label triggers
- edit sequence steps, variants, subjects, bodies, and follow-up delays
- attach or replace campaign sender accounts
- list and bulk-update sender accounts, limits, names, signatures, warmup/ramp-up/rest-cycle settings
- move/reconnect/tag senders and inspect mailbox/workspace stats
- add/search/update/pause leads and push parent leads into subsequences
- read/reply/forward/compose/send through Unibox
- create/list/delete webhooks and verify signed webhook requests
- read/update workspace settings and lead labels
- use any not-yet-wrapped endpoint through `client.request()`

## Install

```bash
npm install github:arjavjain21/plusvibe-sdk
```

Or clone the repository and import `src/index.js` directly. No runtime packages are required on Node 18+.

## Authentication

```js
import { PlusVibeClient } from 'plusvibe-sdk';

const pv = new PlusVibeClient({
  apiKey: process.env.PLUSVIBE_API_KEY,
  workspaceId: process.env.PLUSVIBE_WORKSPACE_ID
});
```

The client automatically adds `x-api-key` and injects `workspace_id` into every request. For GET requests it is a query parameter. For write requests it is placed in the JSON body. The built-in limiter defaults to 5 requests/second and retries 429/5xx responses.

## Campaign sequencing

```js
const created = await pv.campaigns.create('Retailers - US');
const campaignId = created.id ?? created._id;

await pv.campaigns.update(campaignId, {
  sequences: [
    {
      step: 1,
      wait_time: 0,
      variations: [
        { variation: 'A', subject: 'quick question', body: '<p>Hi {{first_name}}...</p>' },
        { variation: 'B', subject: '{{company_name}}', body: '<p>Hi {{first_name}}...</p>' }
      ]
    },
    {
      step: 2,
      wait_time: 3,
      variations: [{ variation: 'A', subject: 'Re: quick question', body: '<p>Following up...</p>' }]
    }
  ]
});
```

For surgical edits, use read-modify-write helpers:

```js
await pv.campaigns.setStepDelay(campaignId, 2, 5);
await pv.campaigns.setVariation(campaignId, {
  step: 2,
  variation: 'A',
  subject: 'Re: quick question',
  body: '<p>New follow-up body</p>'
});
```

These helpers first read `/campaign/list-all`, preserve the rest of the sequence structure, then PATCH `/campaign/update/campaign`.

## Subsequence discovery and creation

```js
const tree = await pv.campaigns.list({ parent_camp_id: campaignId });

const subseq = await pv.campaigns.createSubsequence({
  name: 'Interested - no booking',
  parentCampId: campaignId,
  events: [{ type: 'LEAD_LABEL_UPDATED', val: ['LEAD_MARKED_AS_INTERESTED'] }]
});
```

The list response is the main state snapshot. It exposes `id`, `camp_name`, `parent_camp_id`, `campaign_type`, sender accounts, campaign settings and sequence details.

## Sender operations

```js
const senders = await pv.accounts.list({ limit: 100 });

await pv.accounts.bulkUpdate(['ACCOUNT_ID_1', 'ACCOUNT_ID_2'], {
  first_name: 'Arjav',
  daily_limit: 25,
  interval_limit_in_min: 8,
  signature: '<p>Arjav</p>',
  bulk_is_slow_rampup: true,
  bulk_rampup_daily_limit: 8,
  bulk_rampup_daily_inc: 2
});

await pv.accounts.setWarmup(['ACCOUNT_ID_1'], 'ACTIVE');
```

`bulkUpdate` intentionally accepts passthrough fields so agents can use every setting documented by PlusVibe without waiting for this SDK to add a new TypeScript property.

## Webhooks

For Zapier or Make.com:

1. Create the webhook/catch-hook trigger in Zapier or Make.
2. Copy the generated webhook URL.
3. In PlusVibe, open Webhook settings and add that URL.
4. Select the events/campaigns you want PlusVibe to deliver.

Programmatically:

```js
await pv.webhooks.add({
  name: 'Zapier interested replies',
  url: process.env.ZAPIER_WEBHOOK_URL,
  camp_ids: [campaignId],
  event_types: ['LEAD_MARKED_AS_INTERESTED', 'ALL_EMAIL_REPLIES'],
  ignore_ooo: 1,
  ignore_automatic: 0,
  secret: ''
});
```

If you control the receiver, set a webhook secret and verify the `Signature` header with `verifyWebhookSignature(rawBody, signature, secret)`.

## Raw escape hatch

Any regular-user endpoint can be called without adding a wrapper:

```js
const data = await pv.request('PATCH', '/workspace-settings/update', {
  body: { domain_daily_cap: { enabled: true, max_leads_per_day: 3 } }
});
```

## Agent workflow

Agents should read in this order:

1. `docs/AGENTS.md`
2. `docs/API_REFERENCE.md`
3. `docs/WEBHOOKS.md` when handling event-driven flows
4. `docs/DOCS_INDEX.md` for the complete documentation map
5. `src/endpoints.js` for machine-readable endpoint metadata

For mutations, prefer **read -> diff -> mutate -> verify**. Never rewrite campaign sequences from memory when modifying one step or variation.
