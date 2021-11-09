require('dotenv/config');
const pg = require('pg');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error.js');
const uploadsMiddleware = require('./uploads-middleware');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.use(staticMiddleware);

app.use(errorMiddleware);

app.post('/api/uploads', uploadsMiddleware, (req, res, next) => {
  const url = `/images/${req.file.filename}`;
  res.status(201).json({ imageUrl: url });
});

app.post('/api/messages', (req, res, next) => {
  const { messageTitle, senderName, recipientName, recipientEmail, playlistId, slides } = req.body;
  if (!messageTitle || !senderName || !recipientName || !recipientEmail || !playlistId || !slides) {
    throw new ClientError(400, 'all fields are required');
  }
  const sql = `
    insert into "bottles" ("messageTitle", "senderName", "recipientName", "recipientEmail", "playlistId", "mementos")
    values ($1, $2, $3, $4, $5, $6)
    returning *
  `;
  const params = [messageTitle, senderName, recipientName, recipientEmail, playlistId, slides];
  db.query(sql, params)
    .then(result => {
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
