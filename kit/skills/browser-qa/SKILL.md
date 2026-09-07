---
name: browser-qa
description: Use when verifying user-facing behavior, layout, accessibility or UI regressions.
---

# Browser Qa

Read the task criteria and changed consumers. Obtain the URL from the running server or project docs; use an available authorized browser tool, not a fixed provider. Test the actual changed route/flow, desktop and narrow mobile, keyboard/focus, loading/empty/error, back/reload when routed, console and relevant network responses. Include a negative scenario and affected shared-component consumers. Use dev/test accounts and safe fixtures; no production mutation, billing or emails without authorization. Record exact route, scenario, expected/actual result and observed evidence; screenshots alone do not prove interaction or API correctness. Clean up only resources/test data created by this task. If browser/auth/server is unavailable, give manual scenarios and mark browser QA unverified. Never install a browser tool or claim playback merely by reading source.
