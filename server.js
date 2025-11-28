const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

// ✅ ONLY allow specific sites (important for safety)
const allowedSites = [
  'https://example.com',
  'https://yourwebsite.com'
];

app.use('/proxy', (req, res, next) => {
  const target = req.query.url;

  if (!allowedSites.includes(target)) {
    return res.status(403).send('Target not allowed');
  }

  createProxyMiddleware({
    target,
    changeOrigin: true,
    secure: false
  })(req, res, next);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Proxy running on port ' + PORT);
});

