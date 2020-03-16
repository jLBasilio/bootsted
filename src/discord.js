import dotenv from 'dotenv';
import Discord from 'discord.js';
import commands from './commands/discord_commands';
dotenv.config();

const discordClient = new Discord.Client();
let emjs = [];

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
      && commands.hasOwnProperty(command)) {
      await commands[command](message, params);
    }

    if (emjs.length) await Promise.all(emjs.map(async e => message.react(e))); 
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
});

export const clearEmj = () => emjs = [];
export const setEmj = (ems) => emjs = [...ems];
