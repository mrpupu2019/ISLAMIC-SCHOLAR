const Discord = require("discord.js")
const ayar = require("../../../config.json")

module.exports = {
    name: "disconnect",
    aliases: ["bağlantıkes", "voicekick"],
    execute: async (client, message, args, embed, author, channel, guild) => {
    if(!ayar.registration.staff.some(rol => message.member.roles.cache.has(rol)) && !message.member.hasPermission('ADMINISTRATOR')) return; 

       const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!member.voice.channel) return message.lineReply("The user you want to disconnect is not in the audio rooms.", message.author, message.channel)
        if(message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) return message.lineReply("You can't disconnect someone whose roles are higher than you on the audio channels.", message.author, message.channel)
        const sestensiktirettim = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true}))
        .setDescription("<@"+member+"> adlı kişinin **"+member.voice.channel.name+"** Removed from audio channel.")
        .setColor("RANDOM")
        member.voice.kick()
        message.lineReply(sestensiktirettim).then(message => { message.delete({ timeout : 7500 }) }).then(m => message.react(this.client.ok))  
  },
};
