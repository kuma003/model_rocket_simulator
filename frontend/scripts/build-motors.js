#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Define paths
const motorsDir = path.join(__dirname, '../app/motors');
const publicMotorsDir = path.join(__dirname, '../build/client/motors');
const manifestPath = path.join(publicMotorsDir, 'motors-manifest.json');

console.log('🚀 Building motors data...');

// Create public motors directory
if (!fs.existsSync(publicMotorsDir)) {
  fs.mkdirSync(publicMotorsDir, { recursive: true });
  console.log(`📁 Created directory: ${publicMotorsDir}`);
}

// Read motor files
const motorFiles = fs.readdirSync(motorsDir)
  .filter(file => file.toLowerCase().endsWith('.eng'))
  .sort();

console.log(`📋 Found ${motorFiles.length} motor files:`, motorFiles);

// Copy motor files
let copiedCount = 0;
motorFiles.forEach(file => {
  const src = path.join(motorsDir, file);
  const dest = path.join(publicMotorsDir, file);
  
  try {
    fs.copyFileSync(src, dest);
    copiedCount++;
    console.log(`✅ Copied: ${file}`);
  } catch (error) {
    console.error(`❌ Failed to copy ${file}:`, error.message);
  }
});

// Generate manifest
const manifest = {
  files: motorFiles,
  generated: new Date().toISOString(),
  count: motorFiles.length,
  buildTime: Date.now()
};

try {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`📄 Generated manifest: motors-manifest.json`);
} catch (error) {
  console.error('❌ Failed to write manifest:', error.message);
  process.exit(1);
}

// Also copy manifest to app/motors for development
try {
  const devManifestPath = path.join(motorsDir, 'motors-manifest.json');
  fs.writeFileSync(devManifestPath, JSON.stringify(manifest, null, 2));
  console.log(`📄 Updated development manifest`);
} catch (error) {
  console.warn('⚠️  Could not update development manifest:', error.message);
}

console.log(`🎯 Motors build complete! Copied ${copiedCount}/${motorFiles.length} files`);