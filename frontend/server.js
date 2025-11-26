const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5173;

const distPath = path.join(__dirname, 'dist');

// Check if dist folder exists
if (!fs.existsSync(distPath)) {
  console.error('ERROR: dist folder not found! Build may have failed.');
  console.error('Expected path:', distPath);
  console.error('Current directory contents:');
  fs.readdirSync(__dirname).forEach(file => console.log(' -', file));
  process.exit(1);
}

console.log('dist folder found, contents:');
fs.readdirSync(distPath).forEach(file => console.log(' -', file));

// Serve static files from the dist directory
app.use(express.static(distPath));

// Handle React Router - send all requests to index.html
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(500).send('index.html not found in dist folder');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Serving files from: ${distPath}`);
});
