# Release verification — 16 November 2026

11 Node tests pass, including all 16 day/scenario combinations, future-label masking, arrival delays, invalid/duplicate records and incident recovery.

Local preview: http://127.0.0.1:8797/. Desktop interface inspected. In the corrupt drill on 7 January, advancing eight minutes produced a quality OPEN at 00:12:50 UTC. The exported JSON matched an independently recomputed replay: 49 checks, one incident transition, one duplicate and one invalid vector. The delivery-delay drill opened freshness at 00:12:40 UTC.

Mobile viewport overrides did not apply in the available browser session (the measured viewport remained 1265 pixels); responsive CSS is present, but a narrow-device visual check is not claimed.

## Public release

Code/data release: `6dfb1c9e793197243ec50015790c96f12736bc89`. All 16 uploaded file hashes matched local Git blobs.

- [GitHub tests](https://github.com/Ehsan-Ch/market-model-sentinel/actions/runs/43863452654) succeeded on Node 22 and Node 24.
- [Pages deployment](https://github.com/Ehsan-Ch/market-model-sentinel/actions/runs/43863480635) succeeded for the same release.
- The [public lab](https://ehsan-ch.github.io/market-model-sentinel/) loaded, and the corrupt drill reproduced the quality OPEN at 00:12:50 UTC.
- The public audit download matched an independently recomputed replay exactly: 49 checks, one incident transition, one duplicate and one invalid record.

These checks establish observed application behavior and publication, not production monitoring effectiveness. The source comprises four short historical slices; injected failures are simulated.
