const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

app.use('/proxy', createProxyMiddleware({
  target: '', // dynamic target below
  changeOrigin: true,
  secure: false,
  selfHandleResponse: true, // we'll handle the response
  onProxyReq: (proxyReq, req, res) => {
    // dynamically set target from query param
    proxyReq.setHeader('host', new URL(req.query.url).host);
  },
  onProxyRes: async (proxyRes, req, res) => {
    let body = [];
    proxyRes.on('data', (chunk) => body.push(chunk));
    proxyRes.on('end', () => {
      body = Buffer.concat(body).toString('utf8');

      // Remove X-Frame-Options and CSP headers
      proxyRes.headers['x-frame-options'] = '';
      proxyRes.headers['content-security-policy'] = '';

      // Send the response to the browser
      res.set(proxyRes.headers);
      res.send(body);
    });
  },
  pathRewrite: {
    '^/proxy': '',
  },
  router: (req) => {
    return req.query.url; // dynamically route to the URL in query param
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy running on port ' + PORT));
