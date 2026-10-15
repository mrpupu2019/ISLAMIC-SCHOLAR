const Discord = require("discord.js");
const moment = require("moment");
const config = require("../../../config.json")

module.exports = {
    name: "vckick",
    aliases: ["vckick", "sk", "kes"],
    execute: async (client, message, args, embed, author, channel, guild) => {
  
if (!message.member.roles.cache.has(config.penals.ban.staff) && !message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("You must have valid authorization to use the command."));
  
const kanal = message.member.voiceChannel
const member = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
if (!member) return channel.send(embed.setDescription(`You must specify a valid user!`))
if(!member.voice.channel) return channel.send(embed.setDescription(`The user is not on voice channels!`))
if(message.member.roles.highest.position <= member.roles.highest.position) return channel.send(embed.setDescription(`Same or higher authority!`))
message.guild.member(member.id).voice.setChannel(null)
 
   channel.send(embed.setDescription(`${member} User disconnected.`))
}

 }

