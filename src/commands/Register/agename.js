const config = require("../../../config.json")
const db = require("quick.db");

module.exports = {
    name: "agename",
    aliases: ["i", "nickname"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        var member = message.mentions.users.first() || guild.members.cache.get(args[0]);
        var name = args[1]
        var age = args[2]
        if (!message.member.roles.cache.has(config.registration.staff) && !message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("You must have valid authority to use the command"));
        if (!member) return channel.send(embed.setDescription("You must specify a valid user!"))
        if (!name) return channel.send(embed.setDescription("You must specify a valid name!"))
        if (!age) return channel.send(embed.setDescription("You must specify a valid age!"))
        if (isNaN(age)) return channel.send(embed.setDescription("Let age be valid numbers!"))
        if (age < config.registration.minage) return channel.send(embed.setDescription("The age specified for the user is less than the minimum age!"))
        db.push(`names_${member.id}`, ` \`${config.registration.TagSymbol} ${name} ${config.registration.symbol} ${age}\` Name Change`);
        await guild.members.cache.get(member.id).setNickname(`${config.registration.TagSymbol} ${name} ${config.registration.symbol} ${age}`);
        channel.send(embed.setDescription(`User's name \`${config.registration.TagSymbol} ${name} ${config.registration.symbol} ${age}\` changed to !`)).catch(err => console.log(err), client.ytick(message)).then(m => m.delete({timeout: 10000}));
    }
}