'use strict';
const log = require('../core/logger');

module.exports = (bus, { client, config }, name) => {
  bus.on('ready', name, async () => {
    const channel = config.channels.voicechannel && client.channels.cache.get(config.channels.voicechannel);
    if (!channel) return;
    try {
      await channel.join();
      log.info(`[${name}] joined voice channel ${channel.name}`);
    } catch (err) {
      log.warn(`[${name}] could not join voice channel ${channel.id}: ${err.message}`);
    }
  });
};
