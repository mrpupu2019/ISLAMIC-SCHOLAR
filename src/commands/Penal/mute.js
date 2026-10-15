const Discord = require('discord.js');
const db = require('quick.db');
const config = require("../../../config.json")
const limit = new Map();
const moment = require("moment");
moment.locale("en-au");
const ms = require("ms")

module.exports = {
  name: "mute",
  aliases: ["mute", "sustur"],
  execute: async (client, message, args, embed, author, channel, guild) => {
    if (!message.member.roles.cache.has(config.penals.mute.staff) && !message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("You must have valid authorization to use the command."));
    let member = message.mentions.members.first() || guild.members.cache.get(args[0]) 
    let sebep = args.slice(1).join(' ') || `Reason not entered.`
    let reason = args.splice(2).join(" ")
    let sure = args[1]
    if (!member) return channel.send(embed.setDescription(`You must specify a valid user!`))
    if (!sure) return channel.send(embed.setDescription(`You must specify a valid period!`))
    if (!reason) return channel.send(embed.setDescription(`You must provide a valid reason!`))
    sure
      .replace("s", " Second")
      .replace("m", " Minutes")
      .replace("h", " Moment")
      .replace("d", " Day")
      .replace("w", "Week")
    if (config.penals.mute.limit > 0 && limit.has(author.id) && limit.get(author.id) == config.penals.mute.limit) return channel.send("You've crossed the hourly mute limit!")
    if (!message.member.hasPermission(8) && member && member.roles.highest.position >= message.member.roles.highest.position) return channel.send("Same or higher authority!")

    message.channel.send(embed.setDescription(`**${member}** **(${member.id})** user successfully. **"${reason}"** due to **${sure}** silenced throughout!
The mute official: <@${message.author.id}>
Silencing date: \`${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}\`
Penalty Number: \`#${db.fetch(`punishment_${guild.id}`)}\``))
    member.roles.add(config.penals.mute.roles)
    db.add(`punishment_${guild.id}`, 1)
    
    const log = new Discord.MessageEmbed()
      .setColor("RED")
      .setTimestamp()
      .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
      .setFooter("ISLAMIC SERVER")
      .setDescription(`
      ${member ? member.toString() : member.username} person muted!
    
       muted member: ${member} 
       The mute official: <@${message.author.id}>
       Reason for silencing: \`${sebep}\`
       Silencing date: \`${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}\`
       Penalty Number: \`#${db.fetch(`punishment_${guild.id}`)}\`
      `);
    client.channels.cache.get(config.penals.mute.log).send(log);
    db.push(`record_${member.id}`, `${author} by ${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")} on **${reason}** due to **MUTE** sentenced.`)
    db.add(`points_${member.id}`, config.penals.points.mutepoints);
    db.set(`mute_${member.id}`, true);
    setTimeout(() => {
      if (db.get(`mute_${member.id}`)) {
      member.roles.remove(config.penals.mute.roles)
      client.channels.cache.get(config.penals.mute.log).send(new Discord.MessageEmbed().setColor("GREEN").setTimestamp().setDescription(`${member} person's silencing is over!`))}
    }, ms(sure));
    if (config.penals.mute.limit > 0) {
      if (!limit.has(author.id)) limit.set(author.id, 1);
      else limit.set(author.id, limit.get(author.id) + 1);
      setTimeout(() => {
        if (limit.has(author.id)) limit.delete(author.id);
      }, 1000 * 60 * 60)
    }
  }
}