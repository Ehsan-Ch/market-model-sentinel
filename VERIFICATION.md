# Local verification — 16 November 2026

11 Node tests pass, including all 16 day/scenario combinations, future-label masking, arrival delays, invalid/duplicate records and incident recovery.

Local preview: http://127.0.0.1:8797/. Desktop interface inspected. In the corrupt drill on 7 January, advancing eight minutes produced a quality OPEN at 00:12:50 UTC. The exported JSON matched an independently recomputed replay: 49 checks, one incident transition, one duplicate and one invalid vector. The delivery-delay drill opened freshness at 00:12:40 UTC.

Mobile viewport overrides did not apply in the available browser session (the measured viewport remained 1265 pixels); responsive CSS is present, but a narrow-device visual check is not claimed.

Publication is pending because GitHub's browser session is signed out. No repository, remote CI or public deployment has been verified for Sentinel yet. Update this note after publication.
