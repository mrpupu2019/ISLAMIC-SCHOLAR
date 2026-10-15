  const Discord = require("discord.js");
const db = require("quick.db");

module.exports = {
    name: 'oldname',
    aliases: ["names", "oldname"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        var member = message.mentions.users.first() || guild.members.cache.get(args[0])
        if (!member) return channel.error(message, "You must specify a valid user!").catch(err => console.log(err), client.tick(message)).then(m => m.delete({timeout: 10000}));
        let names = db.get(`isimler_${member.id}`);
        if (!names) return channel.error(message, "This user has no name history!").catch(err => console.log(err), client.ytick(message)).then(m => m.delete({timeout: 10000}));
        channel.send(embed.setTitle("User's past names:").setDescription(names.map((data, n) => `**${n + 1}.** ${data}`).join("\n"))).catch(err => console.log(err), client.ytick(message)).then(m => m.delete({timeout: 10000}));
    }
}