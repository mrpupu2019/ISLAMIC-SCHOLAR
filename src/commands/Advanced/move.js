const { MessageEmbed } = require("discord.js");
const ayar = require("../../../config.json");

module.exports = {
    name: "move",
    aliases: ["topluçek"],
    execute: async (client, message, args, _embed, author, channel, guild) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("ISLAMIC SERVER").setColor("GREEN").setTimestamp();
  if(!ayar.sahipRolu) return message.channel.send("**Roles not set!**").then(x => x.delete({timeout: 5000}));
  if(!message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`You don't have any permissions to use the mass move command.`)).then(x => x.delete({timeout: 5000}));
  let abc = args.slice(0).join(' ');
  let argskanal = message.guild.channels.cache.get(abc) || message.guild.channels.cache.find(a => a.name === abc);
  let kanallar = message.guild.channels.cache.filter(a => a.type === "voice" && a.permissionsFor(message.author).has('CONNECT'));
  let kanalsıra = kanallar.sort((x, y) => x.position-y.position).array();
  if(args[0] === "tüm") {
    try {
      message.guild.members.cache.filter(a => a.voice.channel && !a.user.bot && a.voice.channelID !== message.member.voice.channelID).array().forEach((x, index) => setTimeout(() => { x.voice.setChannel(message.member.voice.channelID ) }, index*1000));
      message.reply(`**Successfully everyone in the audio channel**  \`${message.member.voice.channel.name}\`  **I'm moving it to the audio channel!**`);
	  } catch (err) {
		  return message.channel.send('There is a problem!').then(x => x.delete(5000))
    }//// wasley
  } else if(abc) {
    if(argskanal.type !== "voice" || !argskanal.permissionsFor(message.author).has('CONNECT')) return message.reply(`**Public transport cannot be made to the specified channel or you are not allowed to enter the channel!**`).then(x => x.delete({timeout: 5000}));    message.member.voice.channel.members.array().forEach((x, index) => setTimeout(() => { x.voice.setChannel(argskanal.id) }, index*1000))
    message.reply(`**Successfully everyone in your voice channel**  \`${argskanal.name}\`  **I'm moving it to the audio channel!**`);
  } else {
    if(!message.member.voice) return message.reply('You must be on a voice channel to use this command!').then(x => x.delete({timeout: 5000}))
    if(message.member.voice.channel.members.size < 2) return message.reply('There must be more than one member in the voice channel to use this command!').then(x => x.delete({timeout: 5000}));
    message.channel.send(kanalsıra.map((x, index) => `${index+1}-) ${x.name}`).join('\n') + '\n\nWithin 30 seconds, you must enter the number of the voice channel to which the contacts in your channel will be moved!', {code: "css", split: true})//.then(x => x.delete({timeout: 30000}));
    try {
      var filter = m => m.author.id === message.author.id && Number(m.content) < kanallar.size
      message.channel.awaitMessages(filter, {max: 1, time: 30000, errors: ['time']}).then((collected) => {
        if(isNaN(collected.first().content)) return message.reply(`("uyarı")} **You must specify a valid audio channel number!**`).then(x => x.delete({timeout: 5000}));
        message.member.voice.channel.members.array().forEach((x, index) => setTimeout(() => { x.voice.setChannel(kanalsıra[Number(collected.first().content)-1].id) }, index*1000));
        message.reply(`**Everyone on your voice channel**  \`${kanalsıra[Number(collected.first().content)-1].name}\`  **I'm moving it to the audio channel!**`);
      });
	  } catch (err) {
		  return message.channel.send('The transaction has been canceled because you did not specify a room within 30 seconds!')
    }
  };
}}