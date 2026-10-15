'use strict';
const log = require('../core/logger');

const vanityCode = (url) => (url || '').replace(/\/+$/, '').split('/').pop();

module.exports = (bus, { client, config }, name) => {
  bus.on('guildUpdate', name, async (oldGuild, newGuild) => {
    if (oldGuild.vanityURLCode === newGuild.vanityURLCode) return;
    const entry = (await newGuild.fetchAuditLogs({ type: 'GUILD_UPDATE' })).entries.first();
    if (!entry || !entry.executor || entry.executor.id === client.user.id) return;

    const text = `${entry.executor} The person named lavira was banned for trying to steal the url and the url has been restored.`;
    const channel = client.channels.cache.get(config.channels.urlguardlog);
    if (channel) channel.send(text);
    else if (newGuild.owner) newGuild.owner.send(text).catch(() => {});

    await newGuild.members.ban(entry.executor.id, { reason: `${entry.executor.tag} person has been banned by protection for trying to steal lavira url.` });

    const code = vanityCode(config.bot.guildVanityURL);
    if (!code) return;
    const res = await fetch(`https://discord.com/api/v8/guilds/${newGuild.id}/vanity-url`, {
      method: 'PATCH',
      headers: { Authorization: `Bot ${client.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (!res.ok) log.warn(`[${name}] restoring vanity URL failed: HTTP ${res.status}`);
  });
};

module.exports.vanityCode = vanityCode;
