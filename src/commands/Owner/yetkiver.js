const Discord = require("discord.js")
const config = require("../../../config.json");
const db = require("quick.db");
const moment = require("moment");
module.exports = {
    name: "yetkili",
    aliases:['yetkiliv', "yetkibaşlat", "yetkibaslat","ytver","ytv"],
    execute: async (client, message, args) => { 
      
  let member = message.guild.member(message.mentions.members.first() || message.guild.members.cache.get(args[0]));
        let embed = new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor('#4c0000').setTimestamp()
        let embed2 = new Discord.MessageEmbed().setFooter(message.guild.name, message.guild.iconURL({ dynamic: true })).setColor('#621e02')
        const logChannel = client.channels.cache.get(config.ytv.yetkililog) || message.guild.channels.cache.find(c => c.name === "yetki-ver-log")
        const channel = { send: (m) => logChannel ? logChannel.send(m) : undefined }
        if (!message.member.roles.cache.some(r => [config.ytv.yetkilialım].includes(r.id)) && (!message.member.hasPermission("ADMINISTRATOR")))  {return message.channel.send(embed.setDescription('The user using the command does not have authorization!')).then(x => x.delete({ timeout: 3000 }))} 
        if (!member) return message.channel.send(embed.setDescription("User not tagged or found!")).then(x => x.delete({ timeout: 5000 }))
        if (!member.user.username.includes(config.registration.GuilDTag)) {return message.channel.send(embed.setDescription("The user to be authorized must have a tag")).then(x => x.delete({ timeout: 5000 }))}
        if (db.get(`staff_${member.id}`)) return message.channel.send(embed.setDescription("The specified user is already authorized on the server!").setFooter("If there is a mishap, reach the top management!"))
        if(args[1] === "yetki1") {
                db.set(`staff_${member.id}`, true)
                await message.guild.members.cache.get(member.id).roles.add(config.ytv.ilkrol)
                await message.guild.members.cache.get(member.id).roles.add(config.registration.staff)
                message.channel.send(embed.setDescription(`User promoted to 1st authority. to the user <@&>, <@&> roles assigned!`))
                channel.send(embed.setDescription(` ${member} username: ${message.author}  by 1st authority \`${moment().format('LLL')}\` upgraded on`))          
          }
        if(args[1] === "yetki2") {
                await message.guild.members.cache.get(member.id).roles.remove(config.yetkili.yetkirol)
                await message.guild.members.cache.get(member.id).roles.add(config.yetkili.yetkirol2)
                message.channel.send(embed.setDescription(`User has been promoted to 2nd authority. to the user <@&>, <@&>, <@&> roles assigned!`))
                channel.send(embed.setDescription(` ${member} username: ${message.author}  tarafından 2. yetkiye \`${moment().format('LLL')}\` upgraded on`))
          }
        if(args[1] === "yetki3") {
                await message.guild.members.cache.get(member.id).roles.remove(config.yetkili.yetkirol2)
                await message.guild.members.cache.get(member.id).roles.add(config.yetkili.yetkirol3)
                message.channel.send(embed.setDescription(`User has been promoted to 3rd authority. to the user <@&>, <@&>, <@&> roles assigned!`))
                channel.send(embed.setDescription(` ${member} username: ${message.author}  tarafından 3. yetkiye \`${moment().format('LLL')}\` upgraded on`))
          }
      if(args[1] === "yetki4") {
                await message.guild.members.cache.get(member.id).roles.remove(config.yetkili.yetkirol3)
                await message.guild.members.cache.get(member.id).roles.add(config.yetkili.yetkirol4)
                await message.guild.members.cache.get(member.id).roles.add(config.penals.mute.staff)
                message.channel.send(embed.setDescription(`User has been promoted to 3rd authority. to the user <@&>, <@&>, <@&> roles assigned!`))
                channel.send(embed.setDescription(` ${member} username: ${message.author}  tarafından 3. yetkiye \`${moment().format('LLL')}\` upgraded on`))
          }
}
}