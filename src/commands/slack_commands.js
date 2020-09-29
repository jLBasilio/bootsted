import axios from 'axios';
import { WebClient } from '@slack/web-api';
import { SLACK_PREFIX, SLACK_TOKEN } from '../config';

const client = new WebClient(SLACK_TOKEN);

const meme = async (channel) => {
  try {
    const { data: { url: text } } = await axios.get(process.env.MEME);
    await client.chat.postMessage({ channel, text });
  } catch (err) {
    console.log(err);
  }
}

const invalid = async (channel) => {
  try {
    await client.chat.postMessage({
      channel,
      text: `Invalid command, please use \`${SLACK_PREFIX}help\` for available commands.`
    });
  } catch (err) {
    console.log(err);
  }
}


export default {
  meme,
  invalid
};
