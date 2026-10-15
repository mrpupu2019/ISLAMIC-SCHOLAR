const Discord = require('discord.js');
const db = require('quick.db');
const config = require("../../../config.json")
const moment = require("moment");
moment.locale("en-au");

module.exports = {
  name: "unvmute",
  aliases: [],
  execute: async (client, message, args, embed, author, channel, guild) => {
    if (!message.member.roles.cache.has(config.penals.mute.staff) && !message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("You must have valid authorization to use the command."))
    let member = message.member
    let user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
    if (!user) return channel.send(embed.setDescription('You must specify a valid user!'))
    member.roles.remove(config.penals.mute.roles);
    message.channel.send(embed.setDescription(`${user} member's mute has been successfully removed!
    Remover: ${author} \`(${author.id})\`
    Removal Date: \`${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}\`
`))
    const log = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setTimestamp()
      .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
      .setFooter("ISLAMIC SERVER")
      .setDescription(`
      ${user} user's mute on Audio Channels has been removed!

      Removed User: ${user} \`(${user})\`
      Remover: ${author} \`(${author.id})\`
      Removal Date: \`${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}\`
      `)
      db.set(`mute_${member.id}`, false)
    client.channels.cache.get(config.penals.mute.log).send(log);
  }
};