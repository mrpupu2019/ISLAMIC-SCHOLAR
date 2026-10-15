const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js")

module.exports = {
    name: "removeroleall",
    aliases: [],
    owner: true,
    execute: async (client, message, args, embed, author, channel, guild) => {

if (!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("❌ **You Must Have 'Manage Roles' Authority to Use This Command!**")
  
  let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) 
  if (!rol) return message.channel.send("❌ **You Have To Tag A Role For Everyone To Take A Role!**")

  const data = message.guild.members.cache.filter(cs => cs.roles.cache.has(rol.id))
  if(!data.size > 0){
    return message.reply("**NO ONE HAS THIS ROLE!**")
  } else {
    
   const embed = new Discord.MessageEmbed()
    .setDescription(`**${rol} Named Role Begins to Be Taken From Everyone...**`)
    .setColor(rol.hexColor)
  message.channel.send(embed).then(async ms => {

  data.map(async cs => {
    setTimeout(async() => {
      await cs.roles.remove(rol.id)
 ms.edit(new Discord.MessageEmbed()
    .setDescription(`**<@${cs.id}> Role Taken from Named!\nROLE SUCCESSFULLY TAKEN BY EVERYONE!**`)
    .setColor(rol.hexColor))
    }, 1000)
  })
    
  })
  }
}}