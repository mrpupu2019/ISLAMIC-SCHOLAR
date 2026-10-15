const Discord = require("discord.js");
const db = require("quick.db");
const config = require("../../../config.json")
const limit = new Map()
const moment = require("moment")
moment.locale("en-au")

module.exports = {
    name: "jail",
    aliases: ["temp-jail", "tjail", "karantina"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        if (!message.member.roles.cache.has(config.penals.jail.staff) && !message.member.hasPermission("BAN_MEMBERS")) return channel.send("You must have valid authorization to use the command.");
        let member = message.mentions.members.first() || guild.members.cache.get(args[0]);
        if (!member) return channel.send("You must specify a valid user!")
        if (!message.member.hasPermission(8) && member && member.roles.highest.position >= message.member.roles.highest.position) return channel.send("Same or higher authority!")
        let sebep = args.slice(1).join(' ') || `Reason not entered.`
        db.set(`roles.${member.id}`, member.roles.cache.map(x => x.id))
        db.set(`isim.${member.id}`, member.displayName)
        member.setNickname(`[CRIMINAL] ${member.displayName}`)
        member.roles.set([config.penals.jail.roles])
        channel.send(embed.setDescription(`**${member}** **(${member.id})**user "**${sebep}**" She was thrown into jail because of it! 
        Assigning Authority: ${author} - ${author.id}
        Arrested date: \`${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}\`
        Penalty Number: \`#${db.fetch(`punishment_${guild.id}`)}\``))
        db.add(`punishment_${guild.id}`, 1)
        const log = new Discord.MessageEmbed()
            .setColor("RED")
            .setTimestamp()
            .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
            .setFooter("ISLAMIC SERVER")
            .setDescription(`
            ${member ? member.toString(): member.username}  Was Arrested He Is A Criminal;
     
            Arrested member: ${member ? member.toString(): member.username} 
            Assigning Authority: ${author} - ${author.id}
            Reason for Arrested: \`${sebep}\`
            Arrested date: \`${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}\`
            Penalty Number: \`#${db.fetch(`punishment_${guild.id}`)}\`
            `);
                 
        client.channels.cache.get(config.penals.jail.log).send(log);
        db.push(`record_${member.id}`, `${message.author} By ${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")} on **${sebep}** due to **JAIL** she was sentenced.`)
        db.add(`points_${member}`, config.penals.points.jailpoints);
        if (config.penals.jail.limit > 0) {
            if (!limit.has(message.author.id)) limit.set(message.author.id, 1);
            else limit.set(message.author.id, limit.get(message.author.id) + 1);
            setTimeout(() => {
                if (limit.has(message.author.id)) limit.delete(message.author.id);
            }, 1000 * 60 * 60)
        };
    }
}