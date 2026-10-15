# Agent operating guide

This file is the shortest path for an autonomous agent using PlusVibe.

## Non-negotiable API rules

- Base URL used by the regular-user API: `https://api.plusvibe.ai/api/v1`
- Authentication header: `x-api-key: <API_KEY>`
- Every request is workspace-scoped. Always include `workspace_id`.
- SDK constructor requires both `apiKey` and `workspaceId` and injects them automatically.
- Default throttle: 5 requests/second.
- Do not use the Email Infra Provider partner endpoints. They are intentionally absent from this SDK.

## Safe mutation protocol

1. Read the current object.
2. Identify the exact IDs. Never infer IDs from names when duplicates are possible.
3. Prepare the smallest top-level PATCH/body possible.
4. If editing nested `sequences`, preserve all untouched steps/variations from the fresh read.
5. Write the change.
6. Read again and verify the exact fields changed.
7. Log IDs, old values, new values, endpoint and response.

## Campaign tree model

Use `GET /campaign/list-all` as the canonical discovery call.

Important fields to retain locally:

- `id`: campaign or subsequence ID
- `camp_name`: campaign/subsequence name
- `parent_camp_id`: parent ID for a subsequence
- `campaign_type`: distinguishes parent/subsequence
- `status`
- `email_accounts`
- schedule + sending settings
- `first_wait_time`
- `sequences[]`
  - `step`
  - `wait_time`
  - `variations[]`
    - `variation`
    - `subject`
    - `body`
    - optional variation metadata

Subsequences inherit the parent campaign's sending accounts when queried through the campaign-account endpoint.

## High-frequency recipes

### Rename a campaign/subsequence

```js
await pv.campaigns.rename(campaignId, 'New name');
```

### Change one follow-up delay

```js
await pv.campaigns.setStepDelay(campaignId, 3, 4);
```

### Change one subject/body variant safely

```js
await pv.campaigns.setVariation(campaignId, {
  step: 2,
  variation: 'B',
  subject: 'Re: {{company_name}}',
  body: '<p>...</p>'
});
```

### Change sending accounts

```js
await pv.campaigns.setEmailAccounts(campaignId, accountIds);
```

### Add a follow-up subsequence

```js
const sub = await pv.campaigns.createSubsequence({
  name: 'Interested follow-up',
  parentCampId,
  events: [{ type: 'LEAD_LABEL_UPDATED', val: ['LEAD_MARKED_AS_INTERESTED'] }]
});
```

Then configure its sequences through the campaign update endpoint using the returned subsequence ID.

### Push existing parent leads into a subsequence

```js
await pv.leads.addToSubsequence(subseqId, parentLeadIds);
```

### Bulk change mailbox limits/settings

```js
await pv.accounts.bulkUpdate(accountIds, {
  daily_limit: 25,
  interval_limit_in_min: 8,
  signature: '<p>...</p>'
});
```

## Destructive operations

Treat these as high-risk and verify identifiers immediately before execution:

- campaign delete/archive
- lead delete
- email account delete
- webhook delete
- custom-label delete
- moving accounts between workspaces

Prefer archive over delete when the goal is simply to stop using a campaign and historical state matters.
