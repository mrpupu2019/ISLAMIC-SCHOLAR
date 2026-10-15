const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "voting",
    aliases: ['anket'],
    execute: async (client, message, args, embed, author, channel, guild) => {
if (!message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("You must have valid authorization to use the command."));
   let question = args.join(' ');
   let user = message.author.username
   if (!question) return message.channel.send(
     new Discord.MessageEmbed()
     .setColor("BLUE")
     .setDescription(` you need to write.`)).then(m => m.delete(5000));
     message.channel.send(
       new Discord.MessageEmbed()
       .setColor("BLUE")
       .setThumbnail(client.user.displayAvatarURL())
       .setTimestamp()
       .setFooter('', client.user.displayAvatarURL())
       .addField(`**Voting:**`, `**${question}**`)).then(function(message) {
         message.react('✅');
         message.react('❌');
       });
     }
  }