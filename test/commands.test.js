'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cmds-'));
process.env.QUICKDB_PATH = path.join(tmp, 'json.sqlite');
const { load } = require('../src/core/commands');
const db = require('quick.db');

test('every original prefix command loads with a name, aliases and execute()', () => {
  const client = {};
  const commands = load(client);
  assert.strictEqual(commands.size, 87);
  for (const cmd of commands.values()) {
    assert.ok(cmd.name, 'command has a name');
    assert.ok(Array.isArray(cmd.aliases), `${cmd.name} has aliases`);
    assert.strictEqual(typeof cmd.execute, 'function', `${cmd.name} has execute()`);
  }
  db.close();
});

test('no command file still requires a removed dependency', () => {
  const removed = ['snekfetch', 'superagent', 'axios', 'canvas', 'jimp', 'canvacord', 'express'];
  const dir = path.join(__dirname, '..', 'src');
  const files = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.js') && files.push(path.join(d, e.name))));
  walk(dir);
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    removed.forEach((dep) => assert.ok(!src.includes(`require('${dep}')`) && !src.includes(`require("${dep}")`), `${f} requires ${dep}`));
    assert.ok(!src.includes('ADMİNİSTRATOR'), `${f} uses an invalid permission name`);
  }
});
