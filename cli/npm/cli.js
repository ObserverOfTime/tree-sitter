#!/usr/bin/env node

const { join } = require('path');
const { spawn } = require('child_process');

const executable = process.platform === 'win32'
  ? 'tree-sitter.exe' : 'tree-sitter';

spawn(
  join(__dirname, executable),
  process.argv.slice(2),
  { stdio: 'inherit' }
).on('close', process.exit)
