#!/usr/bin/env node
// Measures download speed: makes N sequential GET requests to a URL and reports averages.

const REQUESTS = 10;

async function measure(url, count = REQUESTS) {
  const times = [];
  let totalBytes = 0;

  for (let i = 1; i <= count; i++) {
    const start = performance.now();
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Request ${i} failed: HTTP ${res.status}`);
    // arrayBuffer() resolves only after the whole body is downloaded
    const bytes = (await res.arrayBuffer()).byteLength;
    const ms = performance.now() - start;

    times.push(ms);
    totalBytes += bytes;
    console.log(`#${i}: ${bytes} bytes in ${ms.toFixed(1)} ms`);
  }

  const totalMs = times.reduce((a, b) => a + b, 0);
  return {
    avgMs: totalMs / count,
    totalBytes,
    mbps: (totalBytes * 8) / 1e6 / (totalMs / 1000), // megabits per second
  };
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node index.js <url>');
    process.exit(1);
  }
  try {
    new URL(url);
  } catch {
    console.error(`Invalid URL: ${url}`);
    process.exit(1);
  }

  try {
    const { avgMs, totalBytes, mbps } = await measure(url);
    console.log('---');
    console.log(`Average request time: ${avgMs.toFixed(1)} ms`);
    console.log(`Total downloaded:     ${(totalBytes / 1e6).toFixed(2)} MB (${totalBytes} bytes)`);
    console.log(`Download speed:       ${mbps.toFixed(2)} Mbit/s`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) main();

module.exports = { measure };
