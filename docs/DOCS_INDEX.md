# Offline documentation map

Canonical source: `https://developer.plusvibe.ai/llms.txt`, checked 2026-10-15.

This file intentionally lists the **regular-user** product surface and omits the separate **Email Infra Provider** partner-only section.

## Workspace
- Get workspaces
- Add a new workspace
- Copy workspace settings
- Invite a user to a workspace

## Campaign
- Create a new campaign
- Create a new subsequence
- List all campaigns
- Get campaign name
- Get campaign status
- Get campaign email accounts
- Get campaign emails
- Get campaign variation stats
- Set campaign name
- Activate campaign
- Pause campaign
- Update Campaign
- Delete or archive a campaign
- Duplicate campaign
- Bulk assign/remove tags from campaigns

## Lead
- Add leads to a campaign
- Add leads to a subsequence campaign
- Get/search lead
- Delete leads from a campaign
- Lead variable/label update or add
- Fetch workspace leads
- Update lead status
- Get lead counts by status

## Email Account
- List all email accounts
- Get account status
- Check SPF/DKIM/DMARC vitals
- Enable warmup
- Pause warmup
- Delete account
- Per-mailbox warmup stats
- Bulk add regular SMTP accounts
- Bulk update account settings
- Bulk update warmup status
- Bulk assign/remove tags
- Bulk reconnect
- Workspace email stats
- Move accounts between workspaces
- Per-mailbox email stats
- Workspace-level warmup stats

## Analytics
- Campaign summary
- Campaign stats
- Workspaces summary
- All campaigns statistics
- Workspaces performance

## Unibox
- Threads
- Emails
- Others folder
- Unread count
- Reply
- Forward
- Compose
- Mark read
- Send to any address
- Save draft
- Delete thread
- Delete message

## Blocklist
- List entries
- Add entries
- Delete entries

## Webhooks
- Add webhook
- List webhooks
- Delete webhook(s)

## Tags
- List tags
- Create tag
- Update tag
- Delete tags

## Client Access
- Create client
- Edit client
- Update client status
- Delete client
- List clients

## Email Placement Test
- Recipient providers
- Create/update/list/get/delete/duplicate parent test
- List/get child test runs
- Summary and detailed statistics
- Sender-level result

## Workspace Additional Fields
- List fields
- Create field
- Update default value
- Delete field

## DFY
- Search domain availability
- List subscriptions
- Generate sender identities (MS Enterprise)
- Place order
- Cancel subscription

## Email Account Automation
- List rules
- Create rule
- Update rule
- Delete rule
- Get rule
- Enable/disable rule
- Duplicate rule

## Workspace Settings
- Get settings
- Partial settings update
- List lead labels
- Add custom label
- Delete custom labels

## Core schemas available in PlusVibe docs
ScheduleV2, Campaign, EmailAccountId, WarmupStatus, bulk warmup/tag requests, ObjectId, HexColor, tag request schemas, campaign deletion request, reconnect request, client access schemas, email-placement schemas, variation statistics schemas and other endpoint response/request models.

For machine-readable paths used by this SDK, see `src/endpoints.js`. For a sequencer-focused path table, see `docs/API_REFERENCE.md`.
