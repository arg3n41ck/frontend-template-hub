#!/usr/bin/env node
import { runCli } from '../src/cli.mjs';
import { formatCliError, shouldUseColor } from '../src/terminal-ui.mjs';

try {
  await runCli(process.argv.slice(2));
} catch (error) {
  console.error(formatCliError(error.message, { color: shouldUseColor({ isTTY: process.stderr.isTTY, json: process.argv.includes('--json'), noColor: !!process.env.NO_COLOR }) }));
  process.exitCode = 1;
}
