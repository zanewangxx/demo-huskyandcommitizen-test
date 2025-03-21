#!/usr/bin/env node
import fs from 'fs';

const commitMsgFile = process.argv[2];

if (!commitMsgFile) {
  console.error('No commit message file provided.');
  process.exit(1);
}

let commitMsg = fs.readFileSync(commitMsgFile, { encoding: 'utf8' });

// For example, prepend an emoji if not already present
if (!commitMsg.startsWith('✨')) {
  commitMsg = '✨ ' + commitMsg;
}

fs.writeFileSync(commitMsgFile, commitMsg, { encoding: 'utf8' });

