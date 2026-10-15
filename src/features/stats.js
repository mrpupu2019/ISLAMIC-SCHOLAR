'use strict';
const qdb = require('quick.db');

const PERIODS = ['daily', 'week', 'two_week', 'three_week', 'month'];

module.exports = (bus, { client }, name) => {
  const totals = new qdb.table('stats');
  const settings = new qdb.table('sunucuayar');
  const voice = PERIODS.map((p) => [`stats_${p}`, new qdb.table(`stats_${p}`)]);
  const text = PERIODS.map((p) => [`message_${p}`, new qdb.table(`mstats_${p}`)]);
  const joinedAt = new Map();

  function recordVoice(state, duration) {
    const base = `${state.guild.id}.${state.id}`;
    const parent = state.channel ? state.channel.parentID : null;
    totals.add(`stats.${base}.channels.${state.channelID}`, duration);
    totals.add(`stats.${base}.category.${parent}`, duration);
    for (const [key, table] of voice) {
      table.add(`${key}.${base}.category.${parent}`, duration);
      table.add(`${key}.${base}.channels.${state.channelID}`, duration);
    }
  }

  bus.on('voiceStateUpdate', name, (oldState, newState) => {
    if ((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
    if (!oldState.channelID && newState.channelID) joinedAt.set(oldState.id, Date.now());
    if (!joinedAt.has(oldState.id)) joinedAt.set(oldState.id, Date.now());
    const duration = Date.now() - joinedAt.get(oldState.id);
    const sleep = settings.get('sunucuayar.sleep_kanal');
    const sleepKey = `sleep_room.${oldState.guild.id}.${oldState.id}.${sleep}`;

    if (oldState.channelID && !newState.channelID) {
      joinedAt.delete(oldState.id);
      if (oldState.channelID === sleep) return totals.add(sleepKey, duration);
      return recordVoice(oldState, duration);
    }
    if (oldState.channelID && newState.channelID) {
      joinedAt.set(oldState.id, Date.now());
      if (newState.channelID === sleep || oldState.channelID === sleep) return totals.add(sleepKey, duration);
      return recordVoice(oldState, duration);
    }
    return undefined;
  });

  bus.on('message', name, (msg) => {
    if (!msg.guild || msg.author.id === client.user.id || msg.author.bot) return;
    const base = `${msg.guild.id}.${msg.author.id}.channels.${msg.channel.id}`;
    totals.add(`message.${base}`, 1);
    for (const [key, table] of text) table.add(`${key}.${base}`, 1);
  });
};
