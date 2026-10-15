import test from 'node:test';
import assert from 'node:assert/strict';
import { PlusVibeClient } from '../src/index.js';

function response(body = { status: 'success' }, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...headers } });
}

test('GET injects workspace_id and x-api-key', async () => {
  let seen;
  const client = new PlusVibeClient({ apiKey: 'key', workspaceId: 'ws', requestsPerSecond: 1000, fetchImpl: async (url, options) => { seen = { url: String(url), options }; return response(); } });
  await client.campaigns.list({ limit: 25 });
  const url = new URL(seen.url);
  assert.equal(url.searchParams.get('workspace_id'), 'ws');
  assert.equal(url.searchParams.get('limit'), '25');
  assert.equal(seen.options.headers['x-api-key'], 'key');
});

test('write endpoints inject workspace_id into JSON body', async () => {
  let seen;
  const client = new PlusVibeClient({ apiKey: 'key', workspaceId: 'ws', requestsPerSecond: 1000, fetchImpl: async (url, options) => { seen = { url: String(url), options }; return response({ id: 'c1' }); } });
  await client.campaigns.create('Test');
  assert.deepEqual(JSON.parse(seen.options.body), { camp_name: 'Test', workspace_id: 'ws' });
});

test('Unibox write endpoints place workspace_id in query as documented', async () => {
  let seen;
  const client = new PlusVibeClient({ apiKey: 'key', workspaceId: 'ws', requestsPerSecond: 1000, fetchImpl: async (url, options) => { seen = { url: String(url), options }; return response(); } });
  await client.unibox.reply({ reply_to_id: 'm1', from: 'a@example.com', to: 'b@example.com', subject: 'Re', body: 'hello' });
  const url = new URL(seen.url);
  assert.equal(url.searchParams.get('workspace_id'), 'ws');
  assert.equal(JSON.parse(seen.options.body).workspace_id, undefined);
});
