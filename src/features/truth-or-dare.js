'use strict';
const Discord = require('discord.js');
const buttons = require('discord-buttons');
const { dares, truths } = require('../content/truth-or-dare.json');

const pick = (list) => list[Math.floor(Math.random() * list.length)];

module.exports = (bus, { client, config }, name) => {
  bus.on('clickButton', name, (btn) => {
    const isDare = btn.id === 'button_dc_c';
    if (!isDare && btn.id !== 'button_dc_d') return undefined;
    const link = new buttons.MessageButton().setEmoji('✅').setStyle('url').setURL(config.bot.guildVanityURL).setLabel('Support Server');
    const embed = new Discord.MessageEmbed()
      .setTitle(isDare ? 'Here is your Dare' : 'Here is your Truth')
      .setDescription(isDare ? `Do it This Dare : **${pick(dares)}**` : `Answer The Truth : **${pick(truths)}**`)
      .setColor('GREEN')
      .setFooter(client.user.username, client.user.avatarURL())
      .setTimestamp();
    return btn.reply.send({ embed, component: new buttons.MessageActionRow().addComponent(link) });
  });
};
