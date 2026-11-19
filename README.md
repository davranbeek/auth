# Speed Test

A console script that measures internet download speed.

It sends **10 sequential GET requests** to the given URL, waits for each full response body,
then prints the average request time, total downloaded data and download speed.

## Requirements

- Node.js **18+** (uses the built-in `fetch`, no dependencies)

## Run

```bash
git clone <repo-url>
cd <repo-folder>
node index.js <url>
```

Example:

```bash
node index.js https://proof.ovh.net/files/1Mb.dat
```

Sample output:

```
#1: 1048576 bytes in 2215.0 ms
...
#10: 1048576 bytes in 1266.3 ms
---
Average request time: 710.3 ms
Total downloaded:     10.49 MB (10485760 bytes)
Download speed:       11.81 Mbit/s
```

## Units

| Value                | Unit                                   |
|----------------------|----------------------------------------|
| Average request time | milliseconds (ms)                      |
| Total downloaded     | megabytes (MB, 1 MB = 1 000 000 bytes) |
| Download speed       | **megabits per second (Mbit/s)**, 1 Mbit = 1 000 000 bits |

Speed = total bytes × 8 / total time of all 10 requests.

Request time is measured from sending the request until the whole body is received,
so it includes DNS, connection setup and server response time.

## Tests

```bash
npm test
```

Starts a local HTTP server and checks that the script makes 10 requests and counts bytes correctly.
