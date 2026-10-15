const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "device",
    aliases:  ['device',"chz"],
    execute: async (client, message, args, embed, author, channel, guild) => {

let member;
if(message.mentions.members.first()) {
member = message.mentions.members.first()
} else {
member = message.member;

}

let lightmind = {
  web: 'Internet Browser',
  desktop: 'Computer (Application)',
  mobile: 'Mobile'
}

let durum = (member.user.presence.status).replace('dnd', 'Do not bother.').replace('idle', 'idle.').replace('online', 'Online.').replace('offline', 'Offline.');
let uyy;
if(member.user.presence.status !== 'offline') {
uyy = ` Connected device: ${lightmind[Object.keys(member.user.presence.clientStatus)[0]]}` } else { uyy = '' }
message.channel.send(new Discord.MessageEmbed().setColor('RANDOM').setTimestamp().setFooter(`The time the command was used:`).setAuthor(message.author.tag, message.author.avatarURL ({ dynamic : true })).setDescription(`<@${member.user.id}> **user's status**: \`${durum}${uyy}\``))

}
}