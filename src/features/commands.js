'use strict';
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const ms = require('ms');
const log = require('../core/logger');
const reminders = require('../content/reminders.json');

const SPAM_WINDOW_MS = 5 * 60 * 1000;
const pick = (list) => list[Math.floor(Math.random() * list.length)];

module.exports = (bus, { client, config }, name) => {
  let chatCount = 0;
  const usage = new Map();
  const blocked = new Set();

  function handleAfk(message) {
    const { guild, author, member } = message;
    const afkEmbed = () => new MessageEmbed()
      .setColor(member.displayHexColor)
      .setAuthor(member.displayName)
      .setFooter(config.bot.footer)
      .setTimestamp();
    const tagged = message.mentions.users.first();
    if (tagged) {
      const reason = db.fetch(`sebep_${tagged.id}_${guild.id}`);
      const afkUser = db.fetch(`user_${tagged.id}_${guild.id}`);
      if (afkUser && message.content.includes(afkUser)) {
        const since = ms(Date.now() - db.fetch(`afktime_${guild.id}`));
        message.channel.send(afkEmbed().setDescription(`${tagged} member of **${reason}** due to \`${since}\` throughout afk.`).setColor('RANDOM'));
      }
    }
    if (author.id === db.fetch(`user_${author.id}_${guild.id}`)) {
      member.setNickname(db.fetch(`nick_${author.id}_${guild.id}`)).catch(() => {});
      ['sebep', 'user', 'nick'].forEach((k) => db.delete(`${k}_${author.id}_${guild.id}`));
      db.delete(`afktime_${guild.id}`);
      message.channel.send(afkEmbed().setDescription('You have successfully logged out of afk mode.'));
    }
  }

  // Optional anti-abuse block (the original tried this but its check never matched; off by default).
  function isSpamBlocked(message) {
    const { author, guild, channel } = message;
    if (blocked.has(author.id)) return true;
    if (!config.bot.antiSpamBlock || client.isOwner(author.id) || guild.ownerID === author.id) return false;
    const now = Date.now();
    const entry = usage.get(author.id);
    if (!entry || entry.resetAt < now) { usage.set(author.id, { count: 1, resetAt: now + SPAM_WINDOW_MS }); return false; }
    entry.count += 1;
    if (entry.count > config.bot.cooldown) {
      blocked.add(author.id);
      usage.delete(author.id);
      channel.send(new MessageEmbed().setColor('RED').setDescription(`${author} You've been blocked for abusing commands.`));
      return true;
    }
    return false;
  }

  bus.on('message', name, async (message) => {
    if (!message.guild || message.author.bot || !message.member) return;
    const { content, channel, author, guild } = message;

    if (content === '.tag' || content === '!tag' || content === 'tag') channel.send(`\`${config.registration.GuilDTag}\``);

    if (channel.id === config.channels.chat && ++chatCount >= config.bot.iltifatsize) {
      chatCount = 0;
      message.reply(`**${pick(reminders)}**`);
    }

    handleAfk(message);

    if (!content.startsWith(config.bot.prefix)) return;
    const args = content.slice(config.bot.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;
    if (cmd.owner && !client.isOwner(author.id)) return;
    if (cmd.guildowner && !client.isOwner(author.id) && guild.ownerID !== author.id) return;
    if (isSpamBlocked(message)) return;

    const embed = new MessageEmbed()
      .setColor(message.member.displayHexColor)
      .setAuthor(message.member.displayName, author.avatarURL({ dynamic: true, size: 2048 }))
      .setFooter(config.bot.footer);
    try {
      await cmd.execute(client, message, args, embed, author, channel, guild);
    } catch (err) {
      log.error(`[commands] ${config.bot.prefix}${cmd.name} failed:`, err);
      channel.send('Sorry, something went wrong while running that command.')
        .then((m) => m.delete({ timeout: 10000 })).catch(() => {});
    }
  });
};
