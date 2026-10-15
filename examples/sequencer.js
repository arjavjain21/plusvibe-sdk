import { PlusVibeClient } from '../src/index.js';

const plusvibe = new PlusVibeClient({
  apiKey: process.env.PLUSVIBE_API_KEY,
  workspaceId: process.env.PLUSVIBE_WORKSPACE_ID
});

const campaigns = await plusvibe.campaigns.list({ limit: 100 });
console.log(campaigns);

const created = await plusvibe.campaigns.create('US Retailers - October');
const campaignId = created.id ?? created._id;

await plusvibe.campaigns.update(campaignId, {
  sequences: [
    {
      step: 1,
      wait_time: 0,
      variations: [
        { variation: 'A', subject: 'quick question', body: '<p>Hi {{first_name}}, ...</p>' },
        { variation: 'B', subject: '{{company_name}} wholesale', body: '<p>Hi {{first_name}}, ...</p>' }
      ]
    },
    {
      step: 2,
      wait_time: 3,
      variations: [{ variation: 'A', subject: 'Re: quick question', body: '<p>Wanted to follow up...</p>' }]
    }
  ],
  email_accounts: ['EMAIL_ACCOUNT_OBJECT_ID']
});

await plusvibe.campaigns.setStepDelay(campaignId, 2, 4);
await plusvibe.campaigns.setVariation(campaignId, {
  step: 2,
  variation: 'A',
  subject: 'Re: quick question',
  body: '<p>One more thought...</p>'
});

const subseq = await plusvibe.campaigns.createSubsequence({
  name: 'Interested - no booking',
  parentCampId: campaignId,
  events: [{ type: 'LEAD_LABEL_UPDATED', val: ['LEAD_MARKED_AS_INTERESTED'] }]
});
console.log(subseq);
