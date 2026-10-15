'use strict';
const db = require('quick.db');
const log = require('../core/logger');

const FIVE_HOURS = 5 * 60 * 60 * 1000;

module.exports = (bus, _ctx, name) => {
  bus.on('ready', name, () => {
    setInterval(() => {
      const keys = db.all().filter((row) => row.ID.endsWith('girişçıkış'));
      keys.forEach((row) => db.delete(row.ID));
      if (keys.length) log.info(`[${name}] cleared ${keys.length} join/leave counters`);
    }, FIVE_HOURS).unref();
  });
};
