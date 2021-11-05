require('dotenv/config');
const express = require('express');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

const app = express();

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.use(staticMiddleware);

app.use(errorMiddleware);

app.post('/api/messages', (req, res, next) => {
  // const formArr = req.body.mementos;
  // console.log(JSON.parse(req.body.mementos));
  res.send({ hello: 'world' });
  // const arrItems = [];
  // for (let i = 0; i < formArr.length; i++) {
  //   arrItems.push(formArr[i]);
  // }
  // res.status(201).json(formArr);
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
