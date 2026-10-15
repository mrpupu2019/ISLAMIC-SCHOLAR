const db = require("quick.db");
const config = require("../../../config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
    name: "warns",
    aliases: ["uyarılar"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        if (message.member.roles.cache.has(config.penals.warn.staff) && !message.member.hasPermission("BAN_MEMBERS")) return channel.error(message, "You must have valid authority to use the command.")
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return channel.error(message, "You must specify a valid user!")
        const warns = await db.fetch(`warns_${member.id}`)
        if (!warns) return channel.send(embed.setDescription("User has no previous warning history!"))
        channel.send(embed.setDescription(`${warns.map((data) => `${data}`).join("\n")}`))
    }
}