const db = require("quick.db");

module.exports = {
    name: 'registration-officer',
    aliases: ["registration-officer"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        var member = message.mentions.users.first() || guild.members.cache.get(args[0])
        if (!member) return channel.error(message, "You must specify a valid user!")
        let kke = db.get(`kke_${member.id}`);
        if (!kke) return channel.error(message, "This user has no registration history!")
    channel.send(embed.setTitle("The registrar of the user you specified:").setDescription(`${kke.join("\n")}`))
    }
}