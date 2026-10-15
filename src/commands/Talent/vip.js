const config = require("../../../config.json")
const db = require("quick.db");
const moment = require("moment");
moment.locale("en-au");

module.exports = {
    name: "special",
    aliases: ["vip"],
    execute: async (client, message, args, embed, author, channel, guild) => {
      if (!message.member.roles.cache.has(config.registration.staff) && !message.member.roles.cache.has(config.registration.staff) && !message.member.hasPermission("ADMINISTRATOR")) return channel.error(message, "You must have valid authorization to use the command.")
        var member = message.mentions.users.first() || guild.members.cache.get(args[0]);
        if (!member) return channel.error(message, "You must specify a valid user!")
        if (member.id === author.id) return channel.error(message, "You can't cast yourself a role!")
        guild.members.cache.get(member.id).roles.add(config.roles.viprole)
        channel.send(embed.setDescription(`${member} to the user <@&${config.roles.viprole}> given the role.`));
    }
}