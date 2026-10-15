'use strict';
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const moment = require('moment');

module.exports = (bus, { config }, name) => {
  bus.on('messageDelete', name, (message) => {
    if (message.channel.type === 'dm' || !message.guild || !message.author || message.author.bot) return;
    db.set(`snipe.${message.guild.id}`, {
      mesaj: message.content,
      mesajyazan: message.author.id,
      ytarihi: message.createdTimestamp,
      starihi: Date.now(),
      kanal: message.channel.id,
    });

    const channel = message.guild.channels.cache.get(config.logs.messagelog);
    if (!channel) return;
    const embed = new MessageEmbed()
      .setAuthor(message.member ? message.member.displayName : message.author.username, message.author.avatarURL({ dynamic: true }))
      .setColor('RED')
      .setTitle(`${message.channel.name} A message was deleted on the channel.`)
      .setDescription(message.content || '(no text)')
      .setFooter(`ID: ${message.author.id} • ${moment().locale('en-au').calendar()}`);
    if (message.attachments.first()) embed.setImage(message.attachments.first().proxyURL);
    channel.send(embed);
  });
};
