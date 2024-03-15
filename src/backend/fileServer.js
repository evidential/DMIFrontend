const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyParser = require('body-parser');
const path = require('path');
const staticPath = path.resolve(__dirname, '..', 'assets');

async function startFileServer(port) {
  return new Promise((resolve, _reject) => {
    app.use(bodyParser.json({limit: '500mb'}));
    app.use(bodyParser.urlencoded({limit: '500mb', extended: true}));

    app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    app.use(express.static(staticPath));

    app.get('/get-test', (req, res) => {
      res.send(`Static server serving from ${staticPath} on ${port}`);
    });

    server.listen(port, () => {
      resolve(`http://localhost:${port}`);
    });

  });
}

function closeFileServer() {
  server.close();
  console.log('File Server Closed');
}

module.exports = { startFileServer, closeFileServer };
