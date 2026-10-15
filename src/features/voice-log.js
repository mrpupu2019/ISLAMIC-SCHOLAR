'use strict';

module.exports = (bus, { client, config }, name) => {
  bus.on('voiceStateUpdate', name, (oldState, newState) => {
    const log = client.channels.cache.get(config.logs.voicelog);
    if (!log || !newState.member) return undefined;
    const who = `${newState.member.displayName} user`;
    const oldCh = oldState.channel;
    const newCh = newState.channel;
    if (!oldCh && newCh) return log.send(`${who} \`${newCh.name}\` He entered the voice channel!`);
    if (oldCh && !newCh) return log.send(`${who} \`${oldCh.name}\` Left the voice channel!`);
    if (!oldCh || !newCh) return undefined;
    if (oldCh.id !== newCh.id) return log.send(`${newState.member.displayName} user changed audio channel! (\`${oldCh.name}\` => \`${newCh.name}\`)`);
    const at = `\`${newCh.name}\``;
    if (oldState.selfMute && !newState.selfMute) return log.send(`${who} ${at} She removed her own mute on the voice channel!`);
    if (!oldState.selfMute && newState.selfMute) return log.send(`${who} ${at} She silenced herself on the voice channel!`);
    if (oldState.selfDeaf && !newState.selfDeaf) return log.send(`${who} ${at} She removed her own deafening on the voice channel!`);
    if (!oldState.selfDeaf && newState.selfDeaf) return log.send(`${who} ${at} She deafened herself on the voice channel called!`);
    if (!oldState.streaming && newState.streaming) return log.send(`${who} ${at} Broadcast on the voice channel!`);
    if (oldState.streaming && !newState.streaming) return log.send(`${who} ${at} She closed the broadcast on the voice channel!`);
    if (!oldState.selfVideo && newState.selfVideo) return log.send(`${who} ${at} She opened her camera on the voice channel!`);
    if (oldState.selfVideo && !newState.selfVideo) return log.send(`${who} ${at} She turned off her camera on the voice channel!`);
    return undefined;
  });
};
