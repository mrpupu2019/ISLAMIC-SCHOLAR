'use strict';
const db = require('quick.db');

// Original ran a full member scan every 5 seconds. Now: one scan on start, then only the member that changed.
module.exports = (bus, { client, config }, name) => {
  const bannedTag = () => db.get(`bannedtag_${config.Guild.GuildID}`);
  const jailRole = config.penals.jail.roles;

  async function enforce(member, tag) {
    if (!member || member.guild.id !== config.Guild.GuildID || !tag) return;
    if (!member.user.username.includes(tag) || member.roles.cache.has(jailRole)) return;
    await member.setNickname(member.displayName.replace(tag, '')).catch(() => {});
    await member.roles.add(jailRole).catch(() => {});
  }

  bus.on('ready', name, () => {
    const tag = bannedTag();
    const guild = client.guilds.cache.get(config.Guild.GuildID);
    if (tag && guild) guild.members.cache.forEach((m) => enforce(m, tag));
  });
  bus.on('guildMemberAdd', name, (member) => enforce(member, bannedTag()));
  bus.on('guildMemberUpdate', name, (_old, member) => enforce(member, bannedTag()));
  bus.on('userUpdate', name, (_old, user) => {
    const guild = client.guilds.cache.get(config.Guild.GuildID);
    return enforce(guild && guild.members.cache.get(user.id), bannedTag());
  });
};
