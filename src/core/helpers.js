'use strict';
const { TextChannel, MessageEmbed } = require('discord.js');
const config = require('../../config.json');

// Shared helpers used by the original iscllv10allinone commands (was src/helpers/function.js).
module.exports = function installHelpers(client) {
  client.fetchUser = async (userID) => {
    try { return await client.users.fetch(userID); } catch (_) { return undefined; }
  };

  TextChannel.prototype.error = async function error(message, text) {
    const embed = new MessageEmbed()
      .setColor('RANDOM')
      .setAuthor(message.member ? message.member.displayName : message.author.username, message.author.avatarURL({ dynamic: true, size: 2048 }))
      .setFooter(config.bot.footer)
      .setDescription(text);
    const sent = await this.send(embed);
    if (sent.deletable) sent.delete({ timeout: 10000 }).catch(() => {});
  };

  // Kept exactly as the original: tick reacts with "no", ytick with "yes".
  client.tick = async (message) => { if (config.emojis.yes) message.react(config.emojis.no).catch(() => {}); };
  client.ytick = async (message) => { if (config.emojis.no) message.react(config.emojis.yes).catch(() => {}); };

  client.isOwner = (id) => id === config.bot.owner;
};
