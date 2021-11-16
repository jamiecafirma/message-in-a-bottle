require('dotenv/config');
const pg = require('pg');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error.js');
const uploadsMiddleware = require('./uploads-middleware');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fetch = require('node-fetch');

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

app.get('/api/messages/:bottleId', (req, res, next) => {
  const bottleId = parseInt(req.params.bottleId);
  if (!Number.isInteger(bottleId) || bottleId < 1) {
    throw new ClientError(400, 'bottleId must be a positive integer');
  }
  const sql = `
    select *
        from "bottles"
      where "bottleId" = $1;
  `;
  const params = [bottleId];
  db.query(sql, params)
    .then(result => {
      const [bottle] = result.rows;
      const { mementos } = bottle;
      const messageMementos = mementos.mementos;
      const message = { ...bottle };
      message.mementos = messageMementos;
      if (!bottle) {
        throw new ClientError(404, `cannot find bottle with bottleId ${bottleId}`);
      } else {
        res.json(message);
      }
    })
    .catch(err => next(err));
});

app.post('/api/uploads', uploadsMiddleware, (req, res, next) => {
  const url = req.file.location;
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

app.post('/api/send', (req, res, next) => {
  const { bottleId } = req.body;
  if (!Number.isInteger(bottleId) || bottleId < 1) {
    throw new ClientError(400, 'bottleId must be a positive integer');
  }
  const sql = `
    select *
        from "bottles"
      where "bottleId" = $1;
  `;
  const params = [bottleId];
  db.query(sql, params)
    .then(result => {
      const [bottle] = result.rows;
      if (!bottle) {
        throw new ClientError(404, `cannot find bottle with bottleId ${bottleId}`);
      } else {
        const { messageTitle, senderName, recipientName, recipientEmail } = bottle;
        const messageUrl = `${process.env.APP_ORIGIN}/recipient`;
        const msg = {
          to: recipientEmail, // Change to your recipient
          from: 'messageforamatey@gmail.com', // Change to your verified sender
          subject: messageTitle,
          html: `
          <p>Ahoy ${recipientName}, you have a message in a bottle from ${senderName}!</p>
          <p>Bottle ID: <strong>${bottleId}</strong>.</p>
          <a href=${messageUrl}>View your message!</a>
          `
        };
        sgMail
          .send(msg)
          .then(() => {
            res.status(200).json({ message: 'Email sent' });
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
});

app.put('/api/playlist', (req, res, next) => {
  const { playlistId, token } = req.body;
  const init = {
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    method: 'PUT'
  };
  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, init)
    .then(result => {
      return result.text();
    })
    .then(message => {
      res.status(200).json({ message: 'Playlist followed' });
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
