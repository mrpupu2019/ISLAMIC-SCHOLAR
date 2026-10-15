const { MessageEmbed } = require('discord.js');
const moment = require('moment')
require("moment-duration-format");
const emojis = require("../../../config.json")

module.exports = {
    name: "info",
    aliases:  ['info', 'profil', 'my-stats'],
    execute: async (client, message, args, embed, author, channel, guild) => {
  if (!message.guild) return;
  const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author
  const member = message.guild.member(user);

var emojidurum = {"idle": ""+emojis.emojis.idle+" **(idle)**", "offline": ""+emojis.emojis.offline+" **(Offline)**", "online": ""+emojis.emojis.online+" **(Online)**", "dnd": ""+emojis.emojis.dnd+" **(Do not disturb)**"}

var lightmind = {
  web: 'Internet Browser',
  desktop: 'Computer (Application)',
  mobile: 'Mobile Phone'
}

require("moment-duration-format");
moment.locale("en-au");
const status = emojidurum[user.presence.status]
let yuksek = member.roles.highest
message.channel.send(embed.setThumbnail(member.user.avatarURL({dynamic:true})).setDescription(`
❯ User name: **\`${member.user.tag}\`**
❯ Nickname: **\`${member.displayName}\`**
❯ Id Number: **\`${member.id}\`**
❯ Status: ${status}
❯ Connected device: **${lightmind[Object.keys(member.user.presence.clientStatus)[0]]}**

❯ Account Created Date: \`${moment(user.createdAt).format(`Do MMMM YYYY (HH:mm)`)}\`
❯ Server Join Date: \`${moment(member.joinedAt).format(`Do MMMM YYYY (HH:mm)`)}\`

❯ Roles: ${member.roles.cache.filter(a => a.name !== '@everyone').map(a => a).join(' ') ? member.roles.cache.filter(a => a.name !== '@everyone').map(a => a).join(' ') : 'It doesnt have any role.'}
`))
}}