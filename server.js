const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
app.use(cors());

app.use('/proxy', (req, res, next) => {
  const target = req.query.url;

  if (!target) return res.status(400).send('No URL specified');

  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { '^/proxy': '' },
    secure: false
  })(req, res, next);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Proxy running on port ' + PORT));
