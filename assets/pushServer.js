const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client')));

var publicVapidKey =
  'BFtBVunx6Lg_4ziA6b_Oe-9iqQetudiBzkukb1UOOWItZlbdPXCnMLjTfM6gnbmzrusaGlifwWWaFRWnef_H40Y';
var privateVapidKey = 'F1eZLlbqpH5d8nHetf6xzzBnlgq8WbFlQ2A9jEl9X4E';

webPush.setVapidDetails(
  'mailto:cbernat@makingsense.com',
  publicVapidKey,
  privateVapidKey,
);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.post('/sendNotification', (req, res) => {
  const subscription = req.body.subscription;

  res.status(201).json({});

  const payload = JSON.stringify({
    title: req.body.title,
    message: req.body.message,
  });

  webPush
    .sendNotification(subscription, payload)
    .catch((error) => console.error(error));
});

app.set('port', 5000);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
