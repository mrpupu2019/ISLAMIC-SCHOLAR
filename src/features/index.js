'use strict';
const log = require('../core/logger');

// Order matters only for readability; every feature is isolated by the event bus.
const FEATURES = [
  'presence',       // Bot 1 + Bot 2: presence on ready
  'commands',       // Bot 1: # prefix commands, AFK, tag reply, Islamic reminders
  'stats',          // Bot 1: voice + message statistics
  'message-log',    // Bot 1: snipe + deleted-message log
  'voice-log',      // Bot 1: voice activity log
  'bot-voice',      // Bot 1: bot joins a voice channel on start
  'members',        // Bot 1: welcome/registration, leave memory, ban enforcement
  'tag-tracking',   // Bot 1: team role for tagged usernames
  'banned-tag',     // Bot 1: jail members using a banned tag
  'role-buttons',   // Bot 1: giveaway/activity + self-info buttons
  'applications',   // Bot 1: staff application approve/reject buttons
  'truth-or-dare',  // Bot 1: truth or dare buttons
  'tickets',        // Bot 1: ticket buttons and cleanup
  'filters',        // Bot 1: ad + swear protection
  'dm-log',         // Bot 1: forwards bot DMs to a log channel
  'vanity-guard',   // Bot 1: vanity URL protection
  'maintenance',    // Bot 1: periodic cleanup of join/leave keys
  'owner-tools',    // Bot 1: owner test command
  'isdatamod',      // Bot 2: greetings, Q&A database, quick mod commands, TTS
  'autoreact',      // Bot 3: auto reactions in selected channels
];

function register(bus, ctx) {
  for (const name of FEATURES) {
    if (ctx.env.disabledFeatures.has(name)) {
      log.info(`feature "${name}" disabled by DISABLED_FEATURES`);
      continue;
    }
    try {
      require(`./${name}`)(bus, ctx, name);
    } catch (err) {
      log.error(`feature "${name}" failed to start:`, err);
    }
  }
}

module.exports = { register, FEATURES };
