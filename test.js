const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { measure } = require('./index');

test('downloads 10 times and counts bytes', async () => {
  const body = Buffer.alloc(100_000);
  let hits = 0;
  const server = http.createServer((req, res) => { hits++; res.end(body); });
  await new Promise((r) => server.listen(0, r));
  const url = `http://localhost:${server.address().port}/`;

  try {
    const result = await measure(url);
    assert.strictEqual(hits, 10);
    assert.strictEqual(result.totalBytes, 1_000_000);
    assert.ok(result.avgMs > 0 && result.mbps > 0);
  } finally {
    server.closeAllConnections();
    server.close();
  }
});
