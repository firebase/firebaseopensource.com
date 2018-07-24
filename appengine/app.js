const express = require('express');
const PubSub = require('@google-cloud/pubsub');

const pubsubClient = new PubSub({
  projectId: process.env.GOOGLE_CLOUD_PROJECT
});

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello, world!').end();
});

app.get('/publish/:topic', async (req, res) => {
  const topic = req.params['topic'];

  await pubsubClient.topic(topic)
    .publisher()
    .publish(Buffer.from('data'));

  res.status(200).send('Published to ' + topic).end();
});

// Start the server
const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
