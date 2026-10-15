'use strict';
const env = require('./src/core/env');
const log = require('./src/core/logger');
const storage = require('./src/core/storage');

const paths = storage.prepare(env.dataDir);
if (process.env.RAILWAY_ENVIRONMENT && !process.env.DATA_DIR) {
  log.warn('DATA_DIR is not set: data will be lost on every redeploy. Attach a Railway volume and set DATA_DIR to its mount path.');
}

const Discord = require('discord.js');
const db = require('quick.db');
const config = require('./config.json');

const client = (global.client = new Discord.Client({
  fetchAllMembers: true,
  messageCacheMaxSize: env.messageCacheSize,
  messageCacheLifetime: 6 * 60 * 60,
  messageSweepInterval: 30 * 60,
}));
require('discord-buttons')(client);
client.config = config;
require('./src/core/helpers')(client);
require('./src/core/commands').load(client);

const bus = require('./src/core/bus')(client);
require('./src/features').register(bus, { client, config, env, paths });

client.on('error', (e) => log.error('discord client error:', e));
client.on('warn', (w) => log.warn('discord warning:', w));
client.on('shardDisconnect', (e) => log.warn(`discord disconnected (code ${e && e.code})`));
client.on('shardReconnecting', () => log.info('discord reconnecting...'));
client.on('rateLimit', (r) => log.warn('rate limited:', { route: r.route, timeout: r.timeout, limit: r.limit }));
client.once('ready', () => log.info(`logged in as ${client.user.tag} in ${client.guilds.cache.size} server(s)`));

process.on('unhandledRejection', (err) => log.error('unhandled promise rejection:', err));
process.on('uncaughtException', (err) => log.error('uncaught exception:', err));

let stopping = false;
function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  log.info(`${signal} received, saving data and shutting down`);
  try { db.close(); } catch (err) { log.error('failed to save data on shutdown:', err); }
  client.destroy();
  process.exit(0);
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

if (!env.token) {
  log.error('DISCORD_TOKEN is not set. Add it in Railway > Variables (see .env.example).');
  process.exit(1);
}

client.login(env.token).catch((err) => {
  log.error('login failed:', err.message);
  try { db.close(); } catch (_) { /* nothing saved yet */ }
  process.exit(1);
});
