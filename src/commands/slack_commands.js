import axios from 'axios';

const slack_commands = {
  'meme': async (client, channel) => {
    try {
      const { data: { url: meme } } = await axios.get(process.env.MEME)
      await client.chat.postMessage({ channel, text: meme })
    } catch (err) {
      console.log(err)
      throw new Error(err);
    }
  }
};

export default slack_commands;
