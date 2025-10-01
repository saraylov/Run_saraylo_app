#!/usr/bin/env node

/**
 * Development script with enhanced hot reload capabilities
 * This script provides additional debugging information for the hot reload feature
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start Vite development server with enhanced logging
const viteProcess = spawn('npx', ['vite', '--debug', '--mode', 'development'], {
  cwd: join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

console.log('🚀 Starting Saraylo Run Tracker development server...');
console.log(' Hot reload is enabled by default with Vite');
console.log(' Any changes to .svelte, .js, or .css files will be automatically reflected');
console.log(' Server logs will appear below:');
console.log('-------------------------------------------');

viteProcess.on('close', (code) => {
  console.log(`Vite development server exited with code ${code}`);
});

viteProcess.on('error', (error) => {
  console.error('Failed to start Vite development server:', error);
});