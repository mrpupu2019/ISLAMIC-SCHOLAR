const config = require("../../../config.json");
const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("en-au");

module.exports = {
    name: "warn",
    aliases: ["uyarı", "uyar"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        if (!message.member.roles.cache.has(config.penals.warn.staff) && !message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("You must have valid authorization to use the command."))
        const member =  message.mentions.users.first() || message.guild.members.cache.get(args[0]);
        const reason = args.splice(1).join(" ")
        if (!member) return channel.send(embed.setDescription("You must specify a valid user!"))
        if (!reason) return channel.send(embed.setDescription("You must provide a valid reason!"))
        if (!message.member.hasPermission(8) && member && member.roles.highest.position >= message.member.roles.highest.position) return channel.send("Same or higher authority!")
        db.push(`warns_${member.id}`, `${author} by ${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")} on **${reason}** been warned!`)
        db.push(`record_${member.id}`, `${author} by ${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")} on **${reason}** been warned!`)
        db.add(`punishment_${guild.id}`, 1)
        channel.send(embed.setDescription(`${member} **(${member.id})** person **"${reason}"** got a warning! 
        **stimulus:** (${author} - ${author.id})
        **Arousal Date :** ${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}
        **Penalty Number:** \`#${db.fetch(`punishment_${guild.id}`)}\``))

        const user = client.users.cache.get(member)
        const log = new MessageEmbed()
        .addField("Criminal ID", `#${db.fetch(`punishment_${guild.id}`)}`)
        .addField('warned:', `${member} - ${member.id}`)
        .addField('stimulus:', `${author.username}#${author.discriminator} (${author} - ${author.id})`)
        .addField('Warning reason', reason)
        .addField("Arousal Date", `${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}`)
        client.channels.cache.get(config.penals.warn.log).send(log)
    }
}