'use strict';
const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');
const log = require('./logger');

const COMMANDS_DIR = path.join(__dirname, '..', 'commands');

// Loads every prefix command (from iscllv10allinone) once, synchronously, at startup.
function load(client) {
  client.commands = new Collection();
  client.aliases = new Collection();
  for (const folder of fs.readdirSync(COMMANDS_DIR)) {
    const dir = path.join(COMMANDS_DIR, folder);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.js'))) {
      try {
        const cmd = require(path.join(dir, file));
        cmd.category = folder;
        client.commands.set(cmd.name, cmd);
        (cmd.aliases || []).forEach((alias) => client.aliases.set(alias, cmd.name));
      } catch (err) {
        log.error(`commands: failed to load ${folder}/${file}:`, err);
      }
    }
  }
  log.info(`commands: ${client.commands.size} prefix commands, ${client.aliases.size} aliases loaded`);
  return client.commands;
}

module.exports = { load, COMMANDS_DIR };
