'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { Collection } = require('discord.js');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'feat-'));
process.env.QUICKDB_PATH = path.join(tmp, 'json.sqlite');
const qaFile = path.join(tmp, 'qadata.json');
fs.copyFileSync(path.join(__dirname, '..', 'data', 'seed', 'qadata.json'), qaFile);

const db = require('quick.db');
const config = require('../config.json');
const createBus = require('../src/core/bus');
const features = require('../src/features');
const { parseQa } = require('../src/features/isdatamod');
const { vanityCode } = require('../src/features/vanity-guard');
const { hasSwear } = require('../src/features/filters');
const { makeClient, makeGuild, makeMember, makeMessage, makeChannel } = require('./helpers');

const MOD = config.isdatamod.modRole;
const OWNER_ROLE = config.isdatamod.ownerRole;
const tick = () => new Promise((r) => setImmediate(r));

function setup() {
  const client = makeClient();
  client.commands = new Collection();
  client.aliases = new Collection();
  const bus = createBus(client);
  features.register(bus, { client, config, env: { disabledFeatures: new Set() }, paths: { qaFile } });
  const mod = makeMember('mod-1', [MOD, OWNER_ROLE]);
  const user = makeMember('user-1');
  const target = makeMember('target-1');
  const guild = makeGuild(config.Guild.GuildID, [mod, user, target], [MOD]);
  return { client, bus, mod, user, target, guild };
}

const send = async (client, opts) => {
  const msg = makeMessage(opts);
  client.emit('message', msg);
  await tick(); await tick();
  return msg;
};

test('one Discord listener per event, even after many messages (no listener leak)', async () => {
  const { client, guild } = setup();
  const before = client.listenerCount('message');
  for (let i = 0; i < 50; i++) await send(client, { content: 'kick', author: 'user-1', guild });
  assert.strictEqual(before, 1);
  assert.strictEqual(client.listenerCount('message'), 1);
});

test('Bot 2 greetings, invite link and help reply (also in DMs)', async () => {
  const { client, guild } = setup();
  let m = await send(client, { content: 'Salam', author: 'user-1', guild });
  assert.deepStrictEqual(m.channel.sent[0], ['Walaikum assalam']);
  m = await send(client, { content: 'invt', author: 'user-1', guild });
  assert.deepStrictEqual(m.channel.sent[0], [config.isdatamod.inviteLink]);
  m = await send(client, { content: 'constructor', author: 'user-1', guild });
  assert.strictEqual(m.channel.sent.length, 0, 'built-in object names are not greetings');
  for (const word of ['__proto__', 'hasOwnProperty', 'valueOf', 'toString']) {
    m = await send(client, { content: word, author: 'mod-1', guild });
    assert.strictEqual(m.channel.sent.length, 0, `${word} is not a command`);
  }
  m = await send(client, { content: 'help', author: 'dm-user', guild: null });
  assert.strictEqual(m.channel.sent[0][0].title, 'Need help?');
});

test('Bot 2 Q&A: lookup, add (first colon splits), remove, status, permission check', async () => {
  const { client, guild } = setup();
  const [question, answer] = Object.entries(JSON.parse(fs.readFileSync(qaFile, 'utf8')))[0];
  let m = await send(client, { content: question, author: 'user-1', guild });
  assert.ok(m.channel.sent.some((a) => a[0] === answer));

  m = await send(client, { content: '#addqa Prayer time: Fajr is at 5:30', author: 'mod-1', guild });
  assert.match(m.channel.sent[0][0], /Added/);
  await new Promise((r) => setTimeout(r, 50));
  assert.strictEqual(JSON.parse(fs.readFileSync(qaFile, 'utf8'))['Prayer time'], 'Fajr is at 5:30');

  m = await send(client, { content: '#addqa Nope: x', author: 'user-1', guild });
  assert.match(m.channel.sent[0][0], /do not have permission/);

  m = await send(client, { content: '#removeqa Prayer time', author: 'mod-1', guild });
  assert.match(m.channel.sent[0][0], /Removed/);
  assert.deepStrictEqual(parseQa(' Q : A: B '), ['Q', 'A: B']);
});

test('#ta only reacts to the exact word, not to #tagliste/#taginfo', async () => {
  const { client, guild } = setup();
  let m = await send(client, { content: '#tagliste', author: 'mod-1', guild });
  assert.strictEqual(m.channel.sent.length, 0);
  m = await send(client, { content: '#ta hello world', author: 'mod-1', guild });
  assert.ok(m.channel.sent[0][0].files[0].attachment.includes('q=hello%20world&tl=en'));
});

test('Bot 2 moderation: mute adds the role, non-mods are refused, warning needs a reason', async () => {
  const { client, guild, target } = setup();
  let m = await send(client, { content: 'mute @target', author: 'mod-1', guild, mentions: [target] });
  assert.ok(target.roleSet.has(config.isdatamod.muteRole));
  assert.match(m.channel.sent[0][0], /has been muted/);
  m = await send(client, { content: 'unmute @target', author: 'user-1', guild, mentions: [target] });
  assert.match(m.replies[0], /permission/);
  m = await send(client, { content: 'warning everyone', author: 'mod-1', guild });
  assert.strictEqual(m.channel.sent.length, 0, '"warning" is not the warn command');
});

test('Bot 3 auto-reactions only in configured channels', async () => {
  const { client, guild } = setup();
  let m = await send(client, { content: 'hello', author: 'user-1', guild, channel: makeChannel(config.autoreact.channels[0]) });
  assert.deepStrictEqual(m.reactions, config.autoreact.emojis);
  m = await send(client, { content: 'hello', author: 'user-1', guild, channel: makeChannel('other') });
  assert.strictEqual(m.reactions.length, 0);
});

test('Bot 1 prefix commands get the original arguments; a failing command is contained', async () => {
  const { client, guild } = setup();
  let received;
  client.commands.set('ping', { name: 'ping', aliases: [], execute: async (...a) => { received = a; } });
  client.aliases.set('p', 'ping');
  client.commands.set('boom', { name: 'boom', aliases: [], execute: async () => { throw new Error('kaboom'); } });

  await send(client, { content: '#p one two', author: 'user-1', guild });
  assert.deepStrictEqual(received[2], ['one', 'two']);
  assert.strictEqual(received[4].id, 'user-1');
  assert.ok(received[3].footer, 'embed is the 4th argument');

  const m = await send(client, { content: '#boom', author: 'user-1', guild, channel: makeChannel('stats-check') });
  assert.match(m.channel.sent.at(-1)[0], /something went wrong/);
  const count = new db.table('stats').get(`message.${guild.id}.user-1.channels.${m.channel.id}`);
  assert.strictEqual(count, 1, 'stats feature still ran for the failing command message');
});

test('event bus isolates a crashing feature from the others', async () => {
  const { client, bus } = setup();
  let ran = false;
  bus.on('guildCreate', 'crashes', () => { throw new Error('sync crash'); });
  bus.on('guildCreate', 'crashes-async', async () => { throw new Error('async crash'); });
  bus.on('guildCreate', 'healthy', () => { ran = true; });
  client.emit('guildCreate', {});
  await tick();
  assert.strictEqual(ran, true);
});

test('swear filter deletes swearing when enabled, admins are exempt', async () => {
  const { client, guild, mod } = setup();
  const settings = new db.table('sunucuayar');
  let m = await send(client, { content: 'you fuck', author: 'user-1', guild });
  assert.strictEqual(m.deleted, false, 'off by default');
  settings.set('sunucuayar.kufur_koruma', 'Active');
  m = await send(client, { content: 'you FUCK', author: 'user-1', guild });
  assert.strictEqual(m.deleted, true);
  mod.permissions.has = () => true;
  m = await send(client, { content: 'fuck', author: 'mod-1', guild });
  assert.strictEqual(m.deleted, false);
  settings.delete('sunucuayar.kufur_koruma');
  assert.ok(hasSwear('a SHIT b') && !hasSwear('hello'));
});

test('ad protection deletes edited messages with invite links', async () => {
  const { client, guild } = setup();
  new db.table('sunucuayar').set('sunucuayar.reklam_koruma', 'Active');
  const msg = makeMessage({ content: 'join discord.gg/abc', author: 'user-1', guild });
  client.emit('messageUpdate', msg, msg);
  await tick();
  assert.match(msg.channel.sent[0][0], /cannot share links/);
  new db.table('sunucuayar').delete('sunucuayar.reklam_koruma');
});

test('owner-only test command is ignored for normal users', async () => {
  const { client, guild } = setup();
  let joined = 0;
  client.on('guildMemberAdd', () => { joined += 1; });
  await send(client, { content: '!fakeparticipate', author: 'user-1', guild });
  assert.strictEqual(joined, 0);
});

test('vanity code is extracted from the configured invite URL', () => {
  assert.strictEqual(vanityCode('https://discord.gg/PNvStcMr95'), 'PNvStcMr95');
  assert.strictEqual(vanityCode(''), '');
});

test.after(() => db.close());
