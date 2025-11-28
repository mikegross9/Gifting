import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

console.log('==== Frontend Server Starting ====');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Port:', PORT);
console.log('Current directory:', __dirname);

const distPath = path.join(__dirname, 'dist');
console.log('Looking for dist at:', distPath);

// Check if dist folder exists
if (!fs.existsSync(distPath)) {
  console.error('ERROR: dist folder not found! Build may have failed.');
  console.error('Expected path:', distPath);
  console.error('Current directory contents:');
  fs.readdirSync(__dirname).forEach(file => console.log(' -', file));
  process.exit(1);
}

console.log('✓ dist folder found!');
console.log('dist contents:');
fs.readdirSync(distPath).forEach(file => {
  const filePath = path.join(distPath, file);
  const stats = fs.statSync(filePath);
  console.log(` - ${file} (${stats.isDirectory() ? 'dir' : stats.size + ' bytes'})`);
});

// Serve static files from the dist directory
app.use(express.static(distPath));

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Handle React Router - send all requests to index.html
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log('Serving index.html for:', req.path);
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('index.html not found at:', indexPath);
    res.status(500).send('index.html not found in dist folder');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('==================================');
  console.log(`✓ Frontend server running on port ${PORT}`);
  console.log(`✓ Serving files from: ${distPath}`);
  console.log(`✓ Ready to accept connections`);
  console.log('==================================');
});
