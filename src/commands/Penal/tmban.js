const Discord = require("discord.js");
const db = require("quick.db")
const ms = require("ms");
const config = require("../../../config.json")
const moment = require("moment")

module.exports = {
    name: "tmban",
    aliases: [],
   execute: async  (client, message, args) => {
        if(![config.bot.owner].includes(message.author.id) && message.guild.owner.id !== message.author.id) return
        let guild = message.guild
        let member = message.mentions.users.first();
        if (!member) return message.reply("First, you must specify the user to be banned.")
        let reason = args.slice(1).join(' ');
        let süre = args[2]
        if (reason.length < 1) return message.reply('First, you must state a valid reason.');
        if (!süre) return message.reply("First, specify the time.")
        message.guild.members.ban(member, 2)
        message.channel.send(`${member} The user has been successfully temporarily banned!`)
        const embed = new Discord.MessageEmbed()
      .setColor("0x00AE86")
      .setTimestamp()
      .addField('ban blue shore:', `${member.username}#${member.discriminator} (${member} - ${member.id})`)
      .addField('banning:', `${message.author.username}#${message.author.discriminator} (${message.author} - ${message.author.id})`)
      .addField('Ban Reason', reason)
      .addField("Ban Tarihi", `${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}`)
    message.guild.channels.cache.get(config.ban.log).send(embed)
    db.push(`record_${member.id}`, `${message.author} by ${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")} on ${reason} due to [ SURELI-BAN ] sentenced.`)
          db.add(`points_${member}`, config.penals.points.banpoints);
        setTimeout(() => {
            message.guild.members.unban(member)
            message.channel.send(`${member} Ban has been opened because the user's ban has expired!`)
        }, ms(süre))
    
    }
}