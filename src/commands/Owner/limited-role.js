const Discord = require('discord.js')
const ms = require("ms");
const moment = require("moment")

module.exports = {
    name: "limited-role",
    aliases: [],
  execute: async  (client, message, args) => {
        const embed1 = new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL())
            .setTimestamp()
        const embed2 = new Discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL())
            .setTimestamp()
        if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send(embed1.setDescripton(`You must have Manage Messages Authority to use this command!`))
        let user = message.mentions.users.first()
        let roles = message.mentions.roles.first()
        if (!args[0]) return message.channel.send(embed1.setDescription(`First you must specify a user.`))
        if (!user) return message.channel.send(embed1.setDescription(`**${args[0]}**, The person does not exist on the server!`))
        if (!args[1]) return message.channel.send(embed1.setDescription(`First you have to tag a role.`))
        if (!roles) return message.channel.send(embed1.setDescription(`**${args[1]}**, role does not exist on the server.`))
        if (!args[2]) return message.channel.send(embed1.setDescription(`You must specify how long the role will remain with the user.`))
        let süre = args[2];
        message.guild.members.cache.get(user.id).roles.add(roles.id)
        message.channel.send(embed2.setDescription(`${user} to the person named ${message.author.username} by ${süre.replace(/d/, ' day').replace(/s/, ' second').replace(/m/, ' minute').replace(/h/, ' hour')} along ${roles} The role has been given!`)).then(mesaj => {
            setTimeout(async () => {
                message.guild.members.cache.get(user.id).roles.remove(roles.id)
                mesaj.edit(embed2.setDescription(`${roles}, The role has expired!`))
            }, ms(süre))
        })
    }
}