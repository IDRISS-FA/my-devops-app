const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Simple in-memory counter for testing version changes
let counter = 0;

app.get('/', (req, res) => {
  counter++;
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>DevOps Test App</title>
        <style>
            body { font-family: Arial; text-align: center; padding: 50px; }
            .version { color: blue; font-weight: bold; }
            .counter { color: green; }
        </style>
    </head>
    <body>
        <h1>🚀 DevOps CI/CD Pipeline Test</h1>
        <p class="version">Version: 1.0.0</p>
        <p class="counter">Request counter: ${counter}</p>
        <p>Status: <span style="color:green">✅ Running</span></p>
        <hr>
        <small>Deployed via GitOps (ArgoCD) on K3s</small>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/version', (req, res) => {
  res.json({ version: '1.0.0', app: 'my-devops-app' });
});

app.listen(port, () => {
  console.log(`✅ App running on port ${port}`);
  console.log(`🌐 Access at: http://localhost:${port}`);
});
