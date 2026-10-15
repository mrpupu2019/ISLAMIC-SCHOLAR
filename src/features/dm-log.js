'use strict';
const { MessageEmbed } = require('discord.js');

module.exports = (bus, { client, config }, name) => {
  bus.on('message', name, (message) => {
    if (message.guild || message.author.id === client.user.id) return undefined;
    const channel = client.channels.cache.get(config.channels.botdmlog);
    if (!channel) return undefined;
    return channel.send(new MessageEmbed()
      .setAuthor('Message Sent From Bot Dm!')
      .setFooter('Dm Log!')
      .setDescription(`Posted by:   ${message.author.tag}`)
      .setTimestamp()
      .setThumbnail(client.user.avatarURL())
      .addField('Mesajı;', (message.content || '(no text)').slice(0, 1024))
      .setColor('GOLD'));
  });
};
