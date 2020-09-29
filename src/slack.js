import express from 'express';
import bodyParser from 'body-parser';
import commandList from './commands/slack_commands';
import { PORT, SLACK_PREFIX } from './config';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/slack/events', async (req, res) => {
  try {
    const { challenge, event } = req.body;

    if (challenge) {
      res.status(200).send({ status: 200, challenge });
      return;
    }

    if (!event.bot_id && event.text && event.text.startsWith(SLACK_PREFIX)) {
      const [input, ...params] = event.text.split(' ');
      const message = input.trim();

      if (!commandList.hasOwnProperty(message.substring(3)) || params.length > 1) {
        await commandList['invalid'](event.channel);
        res.status(200).send({ status: 200, message: 'ok' });
        return;
      }

      await commandList[message.substring(3)](event.channel, params);
      res.status(200).send({ status: 200, message: 'ok' });
    }

  } catch (err) {
    console.log(err);
  }
})

app.get('*', (_, res) => {
  res.status(404).send({ status: 404, message: 'Not Found!' })
})

app.set('port', PORT || 3001);
app.listen(app.get('port'), () => {
  console.log(`Server is running on http://localhost:${app.get('port')} in ${app.get('env')} node`);
});
