import axios from 'axios';

const commands = {
  'greet': (message) => {
    message.channel.send('@everyone Hello');
  },
  'leaguemh': async (message, params) => {
    const findChamp = (champs, id) => {        
      for (const key in champs) {
        if (id === parseInt(champs[key].key, 10)) return champs[key].name
      }
    }
    try {
      const user = params.join(' ');
      const { data: { data: champs } } = await axios.get(process.env.LEAGUE_CHAMPS);
      const { data: { accountId } } = await axios.get(`${process.env.LEAGUE_PLAYER}?name=${encodeURI(user)}&region=PH`);
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
  'help': () => {

  }
}

export default commands;
