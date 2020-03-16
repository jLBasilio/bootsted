import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { WebClient } from '@slack/web-api';
import commands from './commands/slack_commands';
dotenv.config();

const app = express();
const web = new WebClient(process.env.SLACK_TOKEN);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/slack/events', async (req, res) => {
  if (req.body.challenge) {
    res.send({ status: 200, challenge: req.body.challenge });
    return;
  }
  const { event: { text, channel } } = req.body;
  if (!req.body.event.bot_id && text && text.startsWith('!qw')) {
    const opts = text.split(' ');
    const prefix = opts[0].substring(0, 3);
    const command = opts[0].substring(3);

    if (prefix === '!qw'
      && commands.hasOwnProperty(command)) {
      await commands[command](web, channel);
    }
  }
  res.send({ status: 200, message: 'ok' })
})

app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'), () => {
  console.log(`Server is running on http://localhost:${app.get('port')} in ${app.get('env')} node`);
});
