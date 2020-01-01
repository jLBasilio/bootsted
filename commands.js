import axios from 'axios';

const error_command = (message) => message.channel.send('Incomplete command.');
const commands = {
  'greet': (message) => {
    message.channel.send('@everyone Hello');
  },
  'leaguemh': async (message, params) => {
    if (!params.length) {
      error_command();
      return;
    }
    const findChamp = (champs, id) => {        
      for (const key in champs) {
        if (id === parseInt(champs[key].key, 10)) return champs[key].name
      }
    }
    try {
      const user = params.join(' ');
      const [
        { data: { data: champs } },
        { data: { accountId } }
      ] = await Promise.all([
        axios.get(process.env.LEAGUE_CHAMPS),
        axios.get(`${process.env.LEAGUE_PLAYER}?name=${encodeURI(user)}&region=PH`)
      ]);
      const { data: { games: { games } } } = await axios.get(`${process.env.LEAGUE_HISTORY}/${accountId}?beginIndex=0&endIndex=10`);
      message.channel.send(`${user}'s last 10 games`)
      let toSend = "";
      games.reverse().forEach(game => {
        toSend += ('\n====\n')
        toSend += (`CHAMPION ID: ${parseInt(game.participants[0].championId, 10)}\n`)
        toSend += (`CHAMPION: ${findChamp(champs, parseInt(game.participants[0].championId, 10))}\n`)
        toSend += (`STATUS: ${game.participants[0].stats.win ? 'VICTORY' : 'DEFEAT'}\n`)
        toSend += (`MODE: ${game.gameMode}\n`)
      })
      message.channel.send(toSend);
    } catch (err) {
      console.log(err)
      return new Error(err);
    }
  },
  'delete': async (message) => {
    message.channel.send('Deleting cancer_bot messages and commands...');
    let messages = [...(await message.channel.fetchMessages({ limit: 99 }))]
      .filter(m => m[1].channel.name === message.channel.name
        && (m[1].author.username === process.env.BOT_NAME
          || m[1].content.startsWith('!cb')
        )
      );
    messages.forEach(m => m[1].delete())
  },
  'disappear': async (message, params) => {
    if (!params.length) {
      error_command();
      return;
    }
    await message.delete()
    const indexS = params.indexOf('-s')
    let reply = null;
    if (indexS > 0 && params.length > indexS+1) {
      reply = await message.reply(` said: ${params.slice(0, indexS).join(' ')}\t\t[ Disappears in ${params[indexS+1] <= 20 ? params[indexS+1] : '20' }s ]`)
      setTimeout(() => reply.delete(), (params[indexS+1] <= 20 ? params[indexS+1] : 20) * 1000);
    } else {
      reply = await message.reply(` said: ${params.join(' ')}\t\t[ Disappears in 5s ]`)
      setTimeout(() => reply.delete(), 5000);
    }
  },
  'help': (message) => {
    message.channel.send(
      'Made by @jeff_\
      \n====\nCan only use the following commands using the prefix `!cb`:\n\
      \t-`!cbgreet` - Emit hello to `@everyone`\n\
      \t-`!cbleaguemh <LOL IGN>` - Display league match history\n\
      \t-`!cbdelete` - Clear bot messages and associated commands \n\
      \t-`!cbdisappear <MESSAGE> [-s <seconds>]` - Send a message and make it disappear specified by -s seconds. Otherwise 5. Limited to 20. \n\
      \t-`!cbhelp` - Display help \n\n'
    );
  }
}

export default commands;
