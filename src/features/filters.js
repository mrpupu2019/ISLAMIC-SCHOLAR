'use strict';
const qdb = require('quick.db');
const { kufurler } = require('../kufurler.json');

const INVITES = ['discord.gg', 'discord.me', 'discordapp.com', 'discord.io', 'discord.tk'];
const LINK = /(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}?\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi;
const SWEARS = new Set(kufurler.map((w) => w.toLowerCase()));

const hasSwear = (content) => content.split(' ').some((word) => SWEARS.has(word.toLowerCase()));
const isAdmin = (msg) => msg.member && msg.member.permissions.has(8);

module.exports = (bus, { client, config }, name) => {
  const settings = new qdb.table('sunucuayar');

  function adProtection(msg) {
    if (!msg.guild || !msg.author || msg.author.id === client.user.id) return;
    if (!settings.get('sunucuayar.reklam_koruma') || !msg.member || isAdmin(msg)) return;
    if (INVITES.some((ad) => msg.content.includes(ad))) {
      msg.channel.send(`Hey ${msg.author}, You cannot share links on the server!`);
      if (msg.deletable) msg.delete({ timeout: 200 }).catch(() => {});
      return;
    }
    if (!msg.content.match(LINK)) return;
    if (msg.deletable) msg.delete({ timeout: 200 }).catch(() => {});
    msg.channel.send(`Hey ${msg.author}, You cannot share links on the server!`).then((x) => x.delete({ timeout: 5000 })).catch(() => {});
  }

  function swearFilter(msg, reply) {
    if (!msg.guild || !msg.author || msg.author.id === client.user.id) return;
    if (!settings.get('sunucuayar.kufur_koruma') || !msg.member || isAdmin(msg)) return;
    if (!hasSwear(msg.content)) return;
    msg.delete()
      .then(() => msg.reply(reply))
      .then((m) => m.delete({ timeout: 2000 }))
      .catch(() => {});
  }

  bus.on('message', name, (msg) => {
    if (config.bot.adProtectionOnNewMessages) adProtection(msg);
    swearFilter(msg, " don't do it.");
  });
  bus.on('messageUpdate', name, (_old, msg) => {
    adProtection(msg);
    swearFilter(msg, " don't act");
  });
};

module.exports.hasSwear = hasSwear;
