const helpCommands = [
  {
    name: '!cbgreet',
    desc: 'Emit \'hello\' to `@everyone`'
  },
  {
    name: '!cbleaguemh <LOL IGN>',
    desc: 'Display league match history'
  },
  {
    name: '!cbdelete',
    desc: 'Clear bot messages and associated commands'
  },
  {
    name: '!cbdisappear <MESSAGE> [-s <seconds>]',
    desc: 'Send a message and make it disappear specified by -s seconds. Otherwise 5. Limited to 20.'
  },
  {
    name: '!cbmemst',
    desc: 'Check statuses of online server members'
  },
  {
    name: '!cbmeme',
    desc: 'Generate random meme from Reddit'
  },
  {
    name: '!cbhelp',
    desc: 'Display help'
  },
  {
    name: '!cbreact <EMOTES>',
    desc: 'Spam reactions on each message'
  },
  {
    name: '!cbreactoff',
    desc: 'Turn off `!cbreact`'
  }
]

export default helpCommands;
