import dotenv from 'dotenv'
import Discord from 'discord.js';
import commands from './commands';
dotenv.config();

const client = new Discord.Client();
let emjs = [];

client.once('ready', () => { 
  console.log('Bot is ready')
})

client.login(process.env.TOKEN);

client.on('message', async message => {
  if (message.author.username === process.env.BOT_NAME) return;
  try {
    const opts = message.content.split(' ');
    const prefix = opts[0].substring(0, 3);
    const command = opts[0].substring(3);
    const params = opts.slice(1);

    if (prefix === '!cb'
      && commands.hasOwnProperty(command)) {
      await commands[command](message, params);
    }

    if (emjs.length) await Promise.all(emjs.map(async e => await message.react(e))); 
  } catch (err) {
    throw new Error(err);
    console.log(err);
  }
});

export const clearEmj = () => emjs = [];
export const setEmj = (ems) => emjs = [...ems];
