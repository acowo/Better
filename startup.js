

const Discord = require("discord.js");
const { prefix, token } = require("config.json");
const ytdl = require("ytdl-core");

const client = new Discord.Client();

const queue = new Map();

const Pæssmerch = new Discord.MessageEmbed()
	.setColor('##ffc7e5')
	.setTitle('Pæsskids fantastiske merch')
	.setURL('https://teespring.com/stores/psskid')
	.setAuthor('Jesper "Pæsskid" Wisbech', '', 'https://teespring.com/stores/psskid')
	.setDescription('Upult.')
	.setThumbnail('https://dslv9ilpbe7p1.cloudfront.net/86K_BN2avZtjgxOjMTbJCA_store_logo_image.png')
	.setImage('https://vangogh.teespring.com/v3/image/Hrm0zHHHayrDJd1doZ1EyIydveg/480/560.jpg');

client.login(`${token}`)

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

  client.on("message", async message => {

	const serverQueue = queue.get(message.guild.id);

  if (message.author.bot) return;

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
	}

 if (message.content.startsWith(`${prefix}pæssmerch`)) {
    passmerch(message);
    return;
  }

 if (message.content.startsWith(`${prefix}samuel`)) {
    message.channel.send('https://cdn.discordapp.com/attachments/714171326528749689/798237722220953610/video0_15.mp4');
  }

 if (message.content.startsWith(`${prefix}rickroll`)) {
    message.channel.send('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  } else {
    message.channel.send("Hey bitchass, that's not a valid command");
  }

async function passmerch(message) {
  message.channel.send(Pæssmerch)
}

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "Join the voice channel to play music you idiot"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "The creator of this bot obviously didn't require the proper permissions when inviting me. Fuck you."
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };
	}

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      	console.log(err);
      	queue.delete(message.guild.id);
    } return message.channel.send(err);
		 	serverQueue.songs.push(song);
			return message.channel.send(`${song.title} has been added to the queue!`);
		};


function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You need to be in a voice channel to skip the music, dumbass"
    );
  if (!serverQueue)
    return message.channel.send("Hey idiot, how about adding some songs to the queue before trying to ***fucking skip any of them?***");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "Just like every other fucking command, you ***NEED TO BE IN THE VOICE CHANNEL.***"
    );

  if (!serverQueue)
    return message.channel.send("***THERE ARE NO FUCKING SONGS TO STOP YOU DUMBASS***");

  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }
}

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error)); {
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Now playing: **${song.title}**`)
	}
});

client.on("ready", () => {
  console.log("Ready!");
});
