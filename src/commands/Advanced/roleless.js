const Discord = require("discord.js");
const config = require("../../../config.json");

module.exports = {
    name: "roleless",
    aliases: ["rolsuz"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        if(!message.member.hasPermission("ADMINISTRATOR")) return 


        let user = guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== guild.id).size == 0)

        if (args[0] == "ver") {
            user.forEach(r => {
                r.roles.add(config.registration.unregistered)
            })
            const info = new Discord.MessageEmbed()
                .setAuthor(" " + author.username + " ", author.avatarURL())
                .setColor("RANDOM")
                .setFooter("ISLAMIC SERVER", message.guild.iconURL())
                .setDescription(`No role on our server " **` + user.size + `** " The person was given the role of indifferent!`)
            return channel.send(info)
        } else {
            const use = new Discord.MessageEmbed()
                .setAuthor("" + author.username + " ", author.avatarURL())
                .setColor("RANDOM")
                .setFooter("ISLAMIC SERVER", message.guild.iconURL())
                .setDescription("No role on our server \`" + user.size + "\` There are people. Execute the \`give without role\` command to give these people the member role!")
            return channel.send(use)
        }
    }
}