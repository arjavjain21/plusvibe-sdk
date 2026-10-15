# Webhooks, Zapier and Make.com

## Zapier / Make.com setup

1. In Zapier, create a Webhooks trigger such as **Catch Hook**. In Make.com, create a **Custom webhook** trigger.
2. Copy the generated webhook URL.
3. In the PlusVibe application, open **Webhook settings** and create a webhook using that URL.
4. Select the campaigns and event types you need.
5. Trigger a test event and inspect the payload inside Zapier/Make.

Zapier and Make do not require PlusVibe's optional webhook secret. If you use your own HTTP receiver, adding a secret is recommended.

## API registration

```js
const hook = await pv.webhooks.add({
  name: 'Interested replies -> Zapier',
  url: process.env.ZAPIER_WEBHOOK_URL,
  camp_ids: ['CAMPAIGN_ID'],
  event_types: ['LEAD_MARKED_AS_INTERESTED', 'ALL_EMAIL_REPLIES'],
  is_slack: null,
  secret: '',
  ignore_ooo: 1,
  ignore_automatic: 0
});
```

Endpoint: `POST /hook/add`.

## Events documented by PlusVibe

- `FIRST_EMAIL_REPLIES`
- `ALL_EMAIL_REPLIES`
- `ALL_POSITIVE_REPLIES`
- `EMAIL_SENT`
- `BOUNCED_EMAIL`
- `UNIBOX_EMAIL_SENT`
- `LEAD_MARKED_AS_{{LABELNAME}}`
- `SYSTEM_ALERT`

## Signature verification

With a webhook secret, PlusVibe signs the raw JSON request body using HMAC-SHA256 and sends the hexadecimal result in the `Signature` header.

Important: verify against the **raw request body**, before JSON re-serialization.

```js
import { verifyWebhookSignature } from 'plusvibe-sdk';

const ok = await verifyWebhookSignature(rawBody, req.headers.signature, process.env.PLUSVIBE_WEBHOOK_SECRET);
if (!ok) throw new Error('Invalid PlusVibe webhook signature');
```

## Useful event-driven patterns

- `LEAD_MARKED_AS_INTERESTED` -> create/update CRM opportunity, Slack alert, booking follow-up
- `ALL_EMAIL_REPLIES` -> centralized reply classifier or AI draft queue
- `BOUNCED_EMAIL` -> suppression + domain/sender-health monitoring
- `EMAIL_SENT` -> delivery ledger and daily volume telemetry
- `SYSTEM_ALERT` -> sender/infrastructure incident workflow

For follow-up subsequences inside PlusVibe itself, prefer native subsequence triggers when the action does not need an external system. Use webhooks when another system must react.
