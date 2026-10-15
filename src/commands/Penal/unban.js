const Discord = require("discord.js");
const moment = require("moment");
const config = require("../../../config.json")
moment.locale("en-au")
module.exports = {
  name: "unban",
  aliases: ["banremove"],
  execute: async (client, message, args, embed, author, channel, guild) => {
    const permError = new Discord.MessageEmbed()
      .setColor('#ed455a')
      .setTitle('Even')
          .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
      .setFooter("ISLAMIC SERVER")
      .setDescription('You must have valid authorization to use the command.')
    const userError = new Discord.MessageEmbed()
      .setColor('#ed455a')
      .setTitle('Even')
          .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
      .setFooter("ISLAMIC SERVER")
      .setDescription('You must specify a valid ID!')
    const userError2 = new Discord.MessageEmbed()
      .setColor('#ed455a')
      .setTitle('Even')
          .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
      .setFooter("ISLAMIC SERVER")
      .setDescription("Don't type!")
    const userError3 = new Discord.MessageEmbed()
      .setColor('#ed455a')
      .setTitle('Even')
          .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
      .setFooter("ISLAMIC SERVER")
      .setDescription('User not banned!')
    const levelError = new Discord.MessageEmbed()
      .setColor('#ed455a')
      .setTitle('Even')
          .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
      .setFooter("ISLAMIC SERVER")
      .setDescription('Same or higher authority!')
    if (!message.member.hasPermission("BAN_MEMBERS")) return channel.send
      (permError)
    let user = args[0];
    if (!user) return channel.send
      (userError).catch(console.error)
    if (isNaN(args[0])) return channel.send
      (userError2).catch(console.error)
    if (user.highestRole >= author.highestRole) return channel.send
      (levelError)
    const banList = await guild.fetchBans();
    if (!user.id === banList) return channel.send
      (userError3)

    guild.members.unban(user);
    channel.send(embed.setDescription(`<@!${user}> **(${user})** User's ban ${author} Removed successfully!
     Remover: ${author} \`(${author.id})\`
     Removal Date: \`${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}\`
`))
                
    const log = new Discord.MessageEmbed()
      .setColor("GREEN")
      .setTimestamp()
      .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
      .setFooter("ISLAMIC SERVER")
      .setDescription(`
      <@!${user}> Member's ban lifted!
      
      Removed User: <@!${user}> \`(${user})\`
      Remover: ${author} \`(${author.id})\`
      Removal Date: \`${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}\`
      `)
    client.channels.cache.get(config.penals.ban.log).send(log);
  }
}