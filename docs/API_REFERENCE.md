# PlusVibe API reference for sequencer operations

Source index: `https://developer.plusvibe.ai/llms.txt`

All calls require `workspace_id`. Authentication uses the `x-api-key` header.

## Campaigns

| Operation | Method | Path |
|---|---|---|
| Create campaign | POST | `/campaign/add/campaign` |
| Create subsequence | POST | `/campaign/add/subsequence` |
| List/discover campaign tree | GET | `/campaign/list-all` |
| Get name | GET | `/campaign/get/name` |
| Get status | GET | `/campaign/get/status` |
| Get sender accounts | GET | `/campaign/get/accounts` |
| Get campaign emails | GET | `/unibox/campaign-emails` |
| Variation stats | GET | `/campaign/get/variation-stats` |
| Rename | POST | `/campaign/set/name` |
| Launch | POST | `/campaign/launch` |
| Pause | POST | `/campaign/pause` |
| Update sequences/settings | PATCH | `/campaign/update/campaign` |
| Delete/archive | DELETE | `/campaign/delete` |
| Duplicate | POST | `/campaign/duplicate` |
| Assign/remove campaign tag | PUT | `/campaign/bulk-assign-tags` |

`PATCH /campaign/update/campaign` is the core sequencer mutation endpoint. It can update campaign name/status, schedules, sequence steps, `wait_time`, variations, subjects/bodies, first wait time, sender accounts and numerous sending/safety settings. Top-level omitted fields are retained. For nested sequence edits, use a fresh read and send the preserved sequence array with the desired changes.

## Leads

| Operation | Method | Path |
|---|---|---|
| Add campaign leads | POST | `/lead/add` |
| Add parent leads into subsequence | POST | `/lead/add-lead-in-subseq` |
| Get/search lead | GET | `/lead/get` |
| Delete leads | POST | `/lead/delete` |
| Update lead variables/label | POST | `/lead/data/update` |
| List workspace leads | GET | `/lead/workspace-leads` |
| Update lead status | POST | `/lead/update/status` |
| Count by status | GET | `/lead/count/lead-status` |

## Email accounts

| Operation | Method | Path |
|---|---|---|
| List accounts | GET | `/account/list` |
| Get status | GET | `/account/status` |
| SPF/DKIM/DMARC vitals | POST | `/account/test/vitals` |
| Delete account | POST | `/account/delete` |
| Bulk add SMTP/IMAP accounts | POST | `/account/bulk-add-regular-accounts` |
| Bulk update account settings | PUT | `/account/bulk-update` |
| Bulk warmup status | PATCH | `/account/bulk-update-warmup` |
| Bulk assign/remove tags | PUT | `/account/bulk-assign-tags` |
| Bulk reconnect | POST | `/account/bulk-reconnect` |
| Move accounts to workspace | POST | `/account/move-workspace` |
| Workspace sending stats | GET | `/account/email-stats` |
| Per-mailbox sending stats | GET | `/account/email-stats/bulk` |
| Workspace warmup stats | GET | `/account/warmup-stats/overall` |
| Per-mailbox warmup stats | GET | `/account/warmup-stats/bulk` |

The account list response is useful for inventory agents because it exposes IDs, addresses, status/warmup state, names, daily limits, intervals, warmup/ramp-up configuration, rest cycles, signatures, tags, campaign associations and health/analytics fields.

## Unibox

| Operation | Method | Path |
|---|---|---|
| List threads | GET | `/unibox/threads` |
| Read emails | GET | `/unibox/emails` |
| Unread count | GET | `/unibox/emails/count/unread` |
| Reply | POST | `/unibox/emails/reply` |
| Forward | POST | `/unibox/emails/forward` |
| Compose to a lead | POST | `/unibox/emails/compose` |
| Send to any address | POST | `/unibox/emails/send` |

When replying, fetch the thread first and use the latest message ID as `reply_to_id`.

## Webhooks

| Operation | Method | Path |
|---|---|---|
| Add webhook | POST | `/hook/add` |
| List webhooks | GET | `/hook/list` |
| Delete webhook(s) | DELETE | `/hook/del` |

Supported webhook families documented by PlusVibe include first/all replies, positive replies, campaign email sent, bounce, Unibox email sent, label events and system alerts.

## Workspace settings and labels

| Operation | Method | Path |
|---|---|---|
| Get settings | GET | `/workspace-settings/` |
| Partial settings update | PATCH | `/workspace-settings/update` |
| List labels | GET | `/workspace-settings/lead-labels` |
| Add custom label | POST | `/workspace-settings/lead-labels/add` |
| Delete custom labels | DELETE | `/workspace-settings/lead-labels/delete` |

Workspace settings include blocklist enforcement, per-domain daily lead caps, AI lead labeling and automatic follow-up configuration.

## Raw endpoint use

If a PlusVibe endpoint is listed in `docs/DOCS_INDEX.md` but does not yet have a convenience method, call it through:

```js
await pv.request('METHOD', '/api-path', { query: {...} });
await pv.request('METHOD', '/api-path', { body: {...} });
```

The client still adds authentication, workspace scope, rate limiting, retries and JSON parsing.
