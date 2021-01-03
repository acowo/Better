const { prefix, token } = require('config.json');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  client.user.setPresence({ activity: { name: 'The world would be better without Sweden' }, status: 'online' })
    .then(console.log)
    .catch(console.error);
});

client.on('message', message => {
  if (message.content.startsWith(`${prefix}pæssmerch`)) {
  	message.channel.send('https://teespring.com/stores/jesperssexymerch');
  } else if (message.content.startsWith(`${prefix}rickroll`)) {
  	message.channel.send('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  }
});


client.login(token);
console.log('Better is ready for takeoff');
