const Discord = require("discord.js");
const disbut = require("discord-buttons");
const db = require('quick.db');
const ayar = require('../../../config.json')
module.exports = {
    name: "başvuruyardım",
    aliases: ["Başvuru-yardım","bşvr-yardım","byardım"],
    enabled: true,
    guildOnly: false,
    execute: async (client, message, args, _embed, author, channel, guild) => { 
   const embed = new Discord.MessageEmbed()
   .setTitle("Görko Başvuru Botu Yardım Menüsü")
   .addField("Yetkili Başvurusunda bulun",`\`${ayar.bot.prefix}başvur\``)
  .addField("Başvuru sistemini aç/kapat",`\`${ayar.bot.prefix}başvur-durum aç/kapat\``)
  .addField("Başvuramıyacak kişileri engelle",`\`${ayar.bot.prefix}başvur-ban @kişi\``)
   .setThumbnail(client.user.avatarURL({dynamic:true}))
   .setFooter(`${message.author.tag} tarafından istendi`,message.author.avatarURL({dynamic:true,size:1024}));
  message.channel.send(embed);
}}