const Discord = require('discord.js');
const db = require('quick.db');
const config = require("../../../config.json")
const limit = new Map();
const moment = require("moment");
moment.locale("en-au");
const ms = require("ms")
module.exports = {
  name: "user-reset",
  aliases: ["user-reset"],
  execute: async (client, message, args, embed, author, channel, guild) => {
    
    if (!message.member.roles.cache.has(config.penals.ban.staff) && !message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("You must have valid authorization to use the command."));
  
let member = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
if(!member) channel.send(embed.setDescription(`You must specify a valid user!`))

if (!member) {
let sicil = db.delete(`record_${member.id}`) || [];
channel.send(embed.setDescription(`Your registry data has been deleted.`))
}
  
if(member) {
let sicil = db.delete(`record_${member.id}`) || [];
channel.send(embed.setDescription(`${member}  The user's registry data has been deleted.`))

};
  
}
  

  }
