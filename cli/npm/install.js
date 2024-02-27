#!/usr/bin/env node

const fs = require('fs');
const { join } = require('path');
const { createGunzip } = require('zlib');

// See https://github.com/tree-sitter/tree-sitter/issues/2196
const matrix = {
  platform: {
    'darwin': {
      name: 'macos',
      arch: {
        'arm64': { name: 'arm64' },
        'x64': { name: 'x64' },
      }
    },
    'linux': {
      name: 'linux',
      arch: {
        'arm64': { name: 'arm64' },
        'arm': { name: 'arm' },
        'x64': { name: 'x64' },
        'x86': { name: 'x86' },
        'ppc64': { name: 'powerpc64' },
      }
    },
    'win32': {
      name: 'windows',
      arch: {
        'arm64': { name: 'arm64' },
        'x64': { name: 'x64' },
        'x86': { name: 'x86' },
        'ia32': { name: 'x86' },
      }
    },
  },
};

// Determine the platform of the executable
const platform = matrix.platform[process.platform];
const arch = platform?.arch[process.arch];

if (!platform?.name || !arch?.name) {
  console.error(
    'Cannot install tree-sitter-cli for platform %s, architecture %s',
    process.platform, process.arch
  );
  process.exit(1);
}

const assetName = join('bin', `tree-sitter-${platform.name}-${arch.name}.gz`);
const executableName = process.platform === 'win32' ? 'tree-sitter.exe' : 'tree-sitter';

fs.exists(executableName, (exists) => {
  if (exists) return;
  fs.createReadStream(assetName)
    .pipe(createGunzip())
    .pipe(fs.createWriteStream(executableName))
    .on('finish', () => {
      fs.chmodSync(executableName, 0o755);
      fs.rmSync('bin', { recursive: true });
    });
});
