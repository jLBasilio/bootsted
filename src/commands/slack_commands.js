import axios from 'axios';
import { WebClient } from '@slack/web-api';
import { MEME, MEMETYPES, SLACK_PREFIX, SLACK_TOKEN } from '../config';

const client = new WebClient(SLACK_TOKEN);

async function meme(channel, param) {
  try {
    const { valid, paramRes, result } = parseParam(param);
    if (valid) {
      const { data: { title, url: text } } = await axios.get(`${MEME}/${result}`);
      await client.chat.postMessage({ channel, text: `_${title}_ \`${paramRes}\`\n${text}` });
    } else await invalid(channel);
  } catch (err) {
    console.log(err);
  }
}

async function invalid(channel) {
  try {
    await client.chat.postMessage({
      channel,
      text: `Invalid command, please use \`${SLACK_PREFIX}help\` for available commands.`
    });
  } catch (err) {
    console.log(err);
  }
}

async function help(channel) {
  try {
    const types = Object.keys(MEMETYPES).map((k, idx) => (
      `${idx === 0 ? '' : ' '}\`${k === 'WTF' ? `${k} (Might be NSFW)` : k}\``)
    ).join();

    await client.chat.postMessage({
      channel,
      text: `Commands:\n\`${SLACK_PREFIX}meme [type]\`\n[type]: ${types}`
    });
  } catch (err) {
    console.log(err);
  }
}

function parseParam(param) {
  if (!param.length) {
    const { WTF, ...rest } = MEMETYPES;
    const typeKeys = Object.keys(rest);
    const outerIdx = Math.floor(Math.random() * (typeKeys.length-1));
    const typeContents = rest[typeKeys[outerIdx]];
    const innerIdx = Math.floor(Math.random() * (typeContents.length-1));
    return { valid: true, result: typeContents[innerIdx], paramRes: typeKeys[outerIdx] };
  }

  const type = param[0].toUpperCase();
  if (!MEMETYPES.hasOwnProperty(type)) return { valid: false };

  const typeContents = MEMETYPES[type];
  const innerIdx = Math.floor(Math.random() * (typeContents.length-1));
  return { valid: true, result: typeContents[innerIdx], paramRes: type };
}

export default {
  help,
  invalid,
  meme
};
