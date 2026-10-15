'use strict';
const { EventEmitter } = require('events');

// Minimal stand-ins for discord.js objects, enough to drive the feature handlers offline.
function makeChannel(id = 'chan-1') {
  const sent = [];
  return {
    id, type: 'text', name: `channel-${id}`, sent,
    send: async (...args) => { const m = { args, delete: async () => {}, edit: async () => {} }; sent.push(args); return m; },
  };
}

function makeMember(id, roles = []) {
  const roleSet = new Set(roles);
  return {
    id,
    displayName: `user-${id}`,
    displayHexColor: '#000000',
    nickname: null,
    joinedAt: new Date(0),
    user: { id, bot: false, tag: `user#${id}`, username: `user${id}`, createdAt: new Date(0) },
    presence: { clientStatus: { desktop: 'online' } },
    roles: {
      cache: { has: (r) => roleSet.has(r), map: (fn) => [...roleSet].map((x) => fn({ id: x })) },
      add: async (r) => { roleSet.add(r); },
      remove: async (r) => { roleSet.delete(r); },
    },
    roleSet,
    permissions: { has: () => false },
    hasPermission: () => false,
    setNickname: async function setNickname(n) { this.nickname = n; },
    send: async () => {},
    kick: async () => {},
    ban: async function ban() { return this; },
    toString() { return `<@${id}>`; },
  };
}

function makeGuild(id, members = [], roleIds = []) {
  const cache = new Map(members.map((m) => [m.id, m]));
  return {
    id, name: 'Test Guild', ownerID: 'guild-owner',
    roles: { cache: new Map(roleIds.map((r) => [r, { id: r }])) },
    members: { cache, fetch: async (uid) => cache.get(uid) },
    channels: { cache: new Map() },
    member: (u) => cache.get(u.id),
  };
}

function makeMessage({ content, author, guild, channel, mentions = [], bot = false }) {
  const member = guild ? guild.members.cache.get(author) : null;
  const reactions = [];
  const replies = [];
  const msg = {
    id: `msg-${Math.random()}`,
    content,
    guild,
    member,
    channel: channel || makeChannel(),
    author: member ? Object.assign(member.user, { bot, avatarURL: () => null }) : { id: author, bot, tag: `user#${author}`, avatarURL: () => null },
    mentions: {
      users: { first: () => (mentions[0] ? mentions[0].user : undefined) },
      members: { first: () => mentions[0] },
    },
    reactions,
    replies,
    deleted: false,
    deletable: true,
    createdTimestamp: Date.now(),
    attachments: { first: () => undefined },
    react: async (e) => { reactions.push(e); },
    reply: async (t) => { replies.push(t); return { delete: async () => {} }; },
    delete: async () => { msg.deleted = true; return msg; },
  };
  return msg;
}

function makeClient() {
  const client = new EventEmitter();
  client.setMaxListeners(100);
  client.user = { id: 'bot-id', username: 'bot', avatarURL: () => null, setPresence: () => {} };
  client.channels = { cache: new Map() };
  client.guilds = { cache: new Map() };
  client.isOwner = (id) => id === 'owner-id';
  return client;
}

module.exports = { makeChannel, makeMember, makeGuild, makeMessage, makeClient };
