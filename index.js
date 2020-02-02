import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import { WebClient } from '@slack/web-api';
import Discord from 'discord.js';
import * as commands from './commands';
dotenv.config();

const discordClient = new Discord.Client();
const app = express();
const web = new WebClient(process.env.SLACK_TOKEN);
let emjs = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

discordClient.once('ready', () => { 
  console.log('Discord bot ready')
})

discordClient.login(process.env.DISCORD_TOKEN);

discordClient.on('message', async message => {
  if (message.author.username === process.env.DISCORD_BOT_NAME) return;
  try {
    const opts = message.content.split(' ');
    const prefix = opts[0].substring(0, 3);
    const command = opts[0].substring(3);
    const params = opts.slice(1);

    if (prefix === '!cb'
      && commands.discord_commands.hasOwnProperty(command)) {
      await commands.discord_commands[command](message, params);
    }

    if (emjs.length) await Promise.all(emjs.map(async e => message.react(e))); 
  } catch (err) {
    throw new Error(err);
    console.log(err);
  }
});

app.post('/slack/events', async (req, res) => {

  if (req.body.challenge) {
    res.send({ status: 200, challenge: req.body.challenge })
  }

  const { event: { bot_id, text, channel, user } } = req.body;
  if (!bot_id && text && text.startsWith('!qw')) {
    const opts = text.split(' ');
    const prefix = opts[0].substring(0, 3);
    const command = opts[0].substring(3);

    if (prefix === '!qw'
      && commands.slack_commands.hasOwnProperty(command)) {
      await commands.slack_commands[command](web, channel);
    }
  }
  res.send({ status: 200, message: 'ok' })
})

app.get('/', (req, res) => {
  res.send({
    message: 'hello',
    status: '200'
  })
})

app.set('port', process.env.PORT || 3001);
app.listen(app.get('port'), () => {
  console.log('Server is running on http://localhost:%d in %s node',
    app.get("port"),
    app.get("env")
  );
});

export const clearEmj = () => emjs = [];
export const setEmj = (ems) => emjs = [...ems];
