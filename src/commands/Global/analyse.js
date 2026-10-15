const { MessageEmbed } = require("discord.js");
const config = require("../../../config.json")
module.exports = {
    name: 'analyse',
    aliases: ["analyse", "server-analyse"],
    execute: async (client, message, args, embed, author, channel, guild) => {
       if (!message.member.roles.cache.has(config.registration.staff) && !message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("You must have valid authority to use the command"));
        var TotalMember = message.guild.memberCount
        var Online = message.guild.members.cache.filter(off => off.presence.status !== 'offline').size;
        var botlar = message.guild.members.cache.filter(m => m.user.bot).size;
        var Taglı = message.guild.members.cache.filter(u => u.user.username.includes(config.registration.GuilDTag)).size;
        var Voice = message.guild.members.cache.filter(s => s.voice.channel).size;
        var Boost = message.guild.premiumSubscriptionCount;
        var Yetkili = message.guild.members.cache.filter(b => b.roles.cache.has(config.registration.staff)).size;
        var Kayıtlı = message.guild.members.cache.filter(kayıt => !kayıt.roles.cache.has(config.registration.unregistered)).size;
        var boostlevel = message.guild.premiumTier;


        message.channel.send(new MessageEmbed().setFooter("ISLAMIC SERVER", message.guild.iconURL).setColor('RANDOM').setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setDescription(`
        
    \`•\` Total on our server **${TotalMember}** (**${Online}**) there are active users.
    \`•\` on our server **${Kayıtlı}** There is a Registered Member.
    \`•\` in sound **${Voice}**  there is a user.
    \`•\` Total on your server **${Taglı}** with tag  **${Yetkili}** Authorized Member Found
    \`•\` Total to Server **${Boost}** Boost Printed (**${boostlevel}. level**)
    `))
      
    }
}