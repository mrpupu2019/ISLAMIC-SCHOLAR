
const Permissions = require("../../../config.json");
const Discord = require("discord.js")



module.exports = {
    name: "authorized-call",
    aliases: ["call", "call-official", "authorized-call","call-sound", "ytcall"],
    execute: async (client, message, args, embed, author, channel, guild) => {

       if (!message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("You must have valid authorization to use the command.")); 
        let enAltYetkiliRolü = message.guild.roles.cache.get(Permissions.registration.staff);
        let yetkililer = message.guild.members.cache.filter(uye => !uye.user.bot && uye.roles.highest.position >= enAltYetkiliRolü.position && uye.presence.status !== "offline" && !uye.voice.channel).array();
        if (yetkililer.length == 0) return message.reply('There is no authorized person who is active and not in the voice. Masallah!');
        let mesaj = await message.channel.send(`**${yetkililer.length}** a call is made to the official`);
        var filter = m => m.author.id === message.author.id && m.author.id !== client.user.id && !m.author.bot;
            yetkililer.forEach((yetkili, index) => {
              setTimeout(() => {
                yetkili.send(message.guild.name+' You are authorized on the server but not in audio. If you do not enter the voice, your authorization will be taken into account. Enter https://discord.gg/PNvStcMr95 Channels And Leave Afk Or Leave Afk On Public Channels').then(x => mesaj.edit(new Discord.MessageEmbed().setDescription(`${yetkili} A private message has been sent to the official!`).setColor(message.member.displayHexColor))).catch(err => message.channel.send(`${yetkili}, You are authorized on the server but not in audio. If you do not enter the voice, your authorization will be taken into account. Also, open dm, I can't send a message.`).then(x => mesaj.edit(new Discord.MessageEmbed().setDescription(`${yetkili} Tagged on the channel because you can't send a private message to the official!`).setColor(message.member.displayHexColor))));
              }, index*1000);
            });
    }
}
