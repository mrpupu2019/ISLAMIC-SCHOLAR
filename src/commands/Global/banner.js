const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "banner",
    aliases:  [],
    execute: async (client, message, args, embed, author, channel, guild) => {
  
  const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(m => m.user.username === args[0]) || message.author
let userid = args[0];
  fetch(`https://discord.com/api/v8/users/${user.id}`, { headers: { Authorization: `Bot ${client.token}` } })
      .then((res) => res.json())
      .then((data) =>{
        const {banner, accent_color} = data;
        const member = message.guild.members.cache.get(user.id) || { user };
  
        if(banner){
          const extention = banner.startsWith("a_") ? ".gif" : ".png";
          const url = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extention}?size=4096`;
  
          const embed = new Discord.MessageEmbed()
          .setColor(accent_color)
          .setAuthor(`${member.user.username} Banner`, member.user.avatarURL({ dynamic: true, format: 'png', size: 1024 }))
          .setImage(url);
          message.channel.send(embed)
        }
        else{
          const embed2 = new Discord.MessageEmbed().setDescription('User does not have banners').setColor(accent_color);
          message.reply(embed2)
        }
      })  
}}