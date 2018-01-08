const express = require('express');
const path = require('path');
const next = require('next');
const { generatePDF } = require('./pdf/pdfGenerator');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = express();

    server.get('/:id', (req, res) => {
      generatePDF({ req, res });
    });

    server.get('*', (req, res) => {
      res.send('Forbidden');
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log('> Ready'); // eslint-disable-line no-console
    });
  });
