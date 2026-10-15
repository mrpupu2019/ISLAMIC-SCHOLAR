const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "ip",
  aliases: ["ipsorgu"],
  enabled: true,
  guildOnly: false,
  permLevel: 0,
  execute: async (client, message, args, _embed, author, channel, guild) => {
let embed = new MessageEmbed()
.setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
.setFooter(`ISLAMIC SERVER`)
.setColor("GREEN")
.setTimestamp()
if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("You must have valid authorization to use the command."));

if(!args[0]) 
return message.channel.send(embed.setDescription(`You must specify the IP!`)).then(w => w.delete({timeout: 7500}));
fetch(`http://ip-api.com/json/${encodeURIComponent(args[0])}`).then(res => res.json()).then(body => {
 const r = { body };
 message.channel.send(embed.setThumbnail(message.author.avatarURL({dynamic: true}))
 .setImage("https://media.giphy.com/media/R1bJi4UpRwKC9Va4xU/giphy.gif")
 .setDescription(`IP: \`${args[0]}\`\nISP: \`${r.body.isp}\`\nASN: \`${r.body.as}\`\nCountry: \`${r.body.country}\`\nCity: \`${r.body.city}\`\nZip Code: \`${r.body.zip}\``))
});

message.channel.send("**IP Tracking Successfully Completed**")
}}