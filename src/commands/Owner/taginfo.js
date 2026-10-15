const Discord = require("discord.js")
module.exports = {
    name: "tag-info",
    aliases: ["taginfo","tagbilgi"],
  execute: async  (client, message, args ,embed, author, channel) => {
if (!message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("Komutu kullanabilmek için geçerli yetkin olmalı."));
const cst = args.slice(0).join(" ")
if(!cst) return message.reply("Bir Tag Belirt!")
const sonuc = message.guild.members.cache.filter(mr => mr.user.username.includes(cst)).size

message.reply("Belirtilen Taga Sahip Bu Sunucuda `"+sonuc+"` Kişi Var!")
}}