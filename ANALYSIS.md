# Analysis report: three bots → one unified bot

This report is based on reading the source of all three uploaded projects:
`iscllv10allinone-main` (Bot 1), `isdatamod-main` (Bot 2) and `autorcdc-main` (Bot 3).
All three are **Discord bots written in JavaScript on discord.js v12**. Each bot logged in with its own token
and ran its own Express "keep-alive" web server on port 3000. That server was a workaround for Replit/Glitch hosting.

---

## 1. How each original bot works

### Bot 1: iscllv10allinone ("Wasley" supervisor bot), the large one
* **Entry:** `index.js` creates a `Client({ fetchAllMembers: true })`, installs `discord-buttons`, loads helper prototypes (`src/helpers/function.js`), then
  loads **87 prefix commands** from `src/commands/<Category>/*.js` (prefix `#`, from `config.json`) and **14 event files** from `src/events`.
* **Command handler** (`src/events/comandHandler.js`, on `message`): it replies to `tag`/`.tag`/`!tag` with the server tag. Every 100 messages in the chat channel it posts a random Islamic reminder (Bengali + English). It also handles AFK mentions and AFK return, and resolves `#command`/alias. Commands run as `execute(client, message, args, embed, author, channel, guild)`.
* **Storage:** `quick.db@7` (SQLite file `json.sqlite`, tables `json`, `stats`, `stats_*`, `mstats_*`, `sunucuayar`, `guvenlikisi`, `tag`, `prefix`). The uploaded `json.sqlite` holds **2,222 rows** of real data: 1,103 saved role lists, 1,102 saved names, penalty records/points, voice & message stats.
* **Inline features in `index.js`:** owner button panels (`!buton-rol`, `!buton-bilgi`), `!fakeparticipate`, snipe store, **voice/message statistics**, a "DDoS region switch", staff application approve/reject buttons, ad protection, a swear filter, DM logging, a welcome DM, an empty "tag ping" interval, Truth-or-Dare buttons, vanity URL protection and a **ticket system** (buttons, channel create/close/reopen/delete, cleanup on leave or channel delete).
* **Event files:** `ready` (presence, join voice channel, banned-tag 5-second scan, 5-hour cleanup), `guildMemberAdd` (registration welcome / suspicious-account flow), `guildMemberRemove` (remember roles/name), `guildBanRemove` (re-ban permanent/temp bans), `messageDelete` (snipe + log), `voicelog`, `voiceStateUpdate` (bot self-deaf), `userUpdate` (team role for tagged names), `buttonhandler`, plus `error/warn/disconnect/reconnecting/rateLimit` loggers.
* **Dependencies declared:** 28 packages. Only these are actually used: `discord.js`, `discord-buttons`, `quick.db`, `moment`, `moment-duration-format`, `ms`, `axios` (1 file), `snekfetch` (1 file), `superagent` (required, unused) and `express`.
  `canvas`, `canvacord`, `jimp`, `cron`, `discord-logs`, `chalk`, `node-fetch`, `funny-words` and others are never used. `canvas` alone needs native build tools.

### Bot 2: isdatamod (moderation + Q&A bot)
* **Entry:** `server.js`, one big `client.on("message")` handler with **no prefix**. Commands are matched with `content === …` or `content.startsWith(…)`.
* **Features:** greeting replies, invite link replies, a **Q&A database** (`qadata.json`, 59 entries: `#addqa`, `#removeqa`, automatic answer on exact question text, `#qastatus`), `help`/`Help` embed, `Command`/`cmd` mod help embed, `info`, `nickname`/`Nickname`/`nik` (random Muslim name if none is given), `warn` (DM), `mute`/`unmute` (role), `kick`, `bannow`/`Bannow`, `verifygirl`/`removegirl` (role), `#ta` text-to-speech via the free Google Translate TTS URL.
* **Role IDs** are hard-coded (mod `892761689508954153`, owner `878620211845144636`, mute `905873677122424833`, etc.). They are the same server and mostly the same roles as Bot 1.
* **Dependencies declared:** discord.js 12, dotenv, express, node-fetch (unused), plus fastify, handlebars, sqlite and sqlite3 (all unused, left over from a Glitch template).

### Bot 3: autorcdc (auto-reactor)
* **Entry:** `index.js`. On every message in 15 hard-coded channel IDs it adds 4 custom emoji reactions in order. `config.json` has a `?` prefix that is never used.
* **Dependencies:** discord.js 12, dotenv, express.

### Shared between the bots
| Shared piece | Bot 1 | Bot 2 | Bot 3 |
|---|---|---|---|
| discord.js v12 client + login | ✓ (`token`) | ✓ (`token`) | ✓ (`TOKEN`) |
| Express keep-alive server on :3000 | ✓ | ✓ | ✓ |
| `message` event processing | ✓ (≈9 separate listeners) | ✓ | ✓ |
| Same server / role IDs | ✓ | ✓ | ✓ (channels) |
| Moderation (warn/mute/unmute/ban/kick) | ✓ (`#` commands, DB records, logs, points) | ✓ (prefix-less, quick role/DM) | |
| Help text | `#help` (paged) | `help`, `Command`/`cmd` | |
| User info | `#info` | `info` | |
| Nickname change | `#agename`/`#nickname` (registration) | `nickname`/`nik` | |
| dotenv | | ✓ | ✓ |

---

## 2. Complete feature list and mapping

Legend: **B1** = iscllv10allinone, **B2** = isdatamod, **B3** = autorcdc.
"Unified" says where the feature lives now and how it works.

### 2.1 Prefix commands `#…` (B1). All 87 kept unchanged in behaviour, in `src/commands/`
| Category | Commands (aliases) |
|---|---|
| Global | `help` (h, hlp), `afk`, `age`, `analyse` (server-analyse), `avatar` (pp), `banner`, `booster`, `device` (chz), `dm`, `fortune`, `info` (profil, my-stats), `link` (server-invite …), `vipisim` (vipnick), `where` (ss, n) |
| Register | `male` (e, boy, man), `woman` (female), `setname` (ke, kboy, kman), `recordwoman` (kk, rwoman), `agename` (i, nickname), `unregistered` (unreg, ks, kayıtsız), `suspicious`, `disconnect` (bağlantıkes, voicekick) |
| Penal | `ban` (yargı, yarra), `unban` (banremove), `tmban`, `jail` (temp-jail, tjail, karantina), `unjail` (uj …), `mute` (sustur), `unmute`, `vmute`, `unvmute`, `warn` (uyarı, uyar), `vckick` (sk, kes), `user-reset` |
| Info | `warns`, `record`, `ban-info` (bansor), `oldname` (names), `top-record` (top-kayıt), `banlist`, `registration-officer`, `register-number` (teyitler) |
| Advanced | `audible`, `delete` (temizle, sil), `delete2`, `powers` (yetkilerim), `authorized-call` (call, ytcall …), `ad-scan`, `snipe`, `tagliste`, `roleless` (rolsuz), `tagal` (tagaldı), `move` (topluçek), `audit` (roleplay, rb), `lock` |
| Talent | `special` (vip), `designer`, `musician`, `sponsor` (sponsored), `streamer` (publisher), `tagged` |
| Owner | `eval`, `reboot`, `voting` (anket), `toplantı`, `audiochk`, `activechk`, `yetkili` (ytv …), `swear`, `adprotection`, `ip`, `limited-role`, `sound-draw` (çekiliş …), `addroleall`, `removeroleall`, `trusted`, `taginfo`, `dmrole-message` |
| Application | `apply` (başvur), `application-status`, `başvuruyardım` (byardım), `apply-ban` |
| Ticket / Support / Fun / Stats | `ticket`, `livesupport`, `td` (truth or dare), `stats` (vme), `top10` |

### 2.2 Background features
| Feature | From | Unified module | How it works now |
|---|---|---|---|
| Command handler, AFK, `tag` reply, Islamic reminder every 100 chat messages | B1 | `features/commands.js` | Same logic. Reminder list moved to `src/content/reminders.json`. |
| Voice + message statistics (total, daily, weekly, 2-week, 3-week, monthly) | B1 | `features/stats.js` | Same keys/tables. Tables are created once (not on every message), and writes are batched in memory. |
| Snipe + deleted-message log | B1 (index.js **and** events/messageDelete.js) | `features/message-log.js` | One handler instead of two. Writes the snipe format `#snipe` reads. |
| Voice activity log | B1 | `features/voice-log.js` | Same messages. Crash guards added. |
| Bot joins a voice channel on start | B1 | `features/bot-voice.js` | Same. A failure is logged instead of crashing (see limitations). |
| Registration welcome / suspicious-account flow | B1 | `features/members.js` | Same. A duplicated role-add was removed and missing channels are guarded. |
| Welcome DM embed | B1 | `features/members.js` | Same text. Links to channels come from `config.json`. Closed DMs are ignored. |
| Remember roles/name on leave; re-ban on unban | B1 | `features/members.js` | Same. |
| Team role when the server tag is added to or removed from a username | B1 | `features/tag-tracking.js` | Same. |
| Jail members who use the banned tag | B1 | `features/banned-tag.js` | **Event-driven** instead of a full member scan every 5 s. |
| Giveaway/Event role buttons, 5 "info about me" buttons | B1 | `features/role-buttons.js` | Same (owner-only `!buton-rol`, `!buton-bilgi`). |
| Staff application approve/reject | B1 | `features/applications.js` | Same flow. |
| Truth or Dare buttons | B1 | `features/truth-or-dare.js` | Same lists (`src/content/truth-or-dare.json`). |
| Ticket system (create/lock/close/reopen/delete + cleanup) | B1 | `features/tickets.js` | Same buttons and texts. |
| Ad protection (edited messages) + swear filter (new & edited) | B1 | `features/filters.js` | Same. Swear words checked through a Set (faster). |
| DM log to a channel | B1 | `features/dm-log.js` | Same. |
| Vanity URL protection | B1 | `features/vanity-guard.js` | Same intent. The broken URL-restore call now actually works. |
| 5-hour cleanup of `*girişçıkış` keys | B1 | `features/maintenance.js` | Same. |
| `!fakeparticipate` (simulate a join) | B1 | `features/owner-tools.js` | Now **owner-only**. |
| Presence | B1 + B2 | `features/presence.js` | One presence. Uses B1's (`dnd`, `bot.BotStatus`), configurable as `bot.presenceStatus`. |
| Greetings, invite replies | B2 | `features/isdatamod.js` | Same exact-text triggers. |
| Q&A database (`#addqa`, `#removeqa`, auto-answers, `#qastatus`) | B2 | `features/isdatamod.js` | Same file format (`qadata.json`), kept in memory, saved safely. |
| `help`/`Help`, `Command`/`cmd` | B2 | `features/isdatamod.js` | Same embeds. The two duplicate embeds are merged into one. |
| `info`, `nickname`/`Nickname`/`nik`, `warn`, `mute`, `unmute`, `kick`, `bannow`/`Bannow`, `verifygirl`, `removegirl` | B2 | `features/isdatamod.js` | Same permissions and replies. The three duplicated nickname blocks and two duplicated ban blocks are now one each. |
| `#ta` text-to-speech (English / Bangla) | B2 | `features/isdatamod.js` | Same free Google TTS URL. |
| Auto-reactions in 15 channels | B3 | `features/autoreact.js` | Same channels and emojis, now in `config.json` → `autoreact`. |
| Keep-alive web servers | B1, B2, B3 | **removed** | Not needed on Railway (a worker without a public port). Saves memory and a dependency. |

### 2.3 Same-name commands: merged or renamed?
| Name | B1 | B2 | Decision |
|---|---|---|---|
| warn / mute / unmute / ban / info / help / nickname | `#warn` … (with `#` prefix) | `warn` … (no prefix) | The two bots do **different jobs** (B1 keeps records/points/logs, B2 is a quick action). The triggers never clashed because B1 needs `#`, so **both are kept under their original triggers and nothing is renamed**. Users type exactly what they typed before. |
| `#ta` | none | `#ta` (startsWith) | B2 matched anything starting with `#ta`, so `#tagliste`, `#tagal`, `#taginfo` (B1) also fired the TTS for mods. Now `#ta` must be its own word. **This is the only trigger collision found, and it is fixed.** |
| B2 `help` text ("Command") listed `ban`, but B2 has no `ban` | | | The merged help lists `bannow` (the real command). |
| No command or alias collisions inside B1 | | | Checked: 186 triggers, 0 collisions. |

`#help` has a new page that lists the prefix-less B2 commands and the B3 auto-reactions.

---

## 3. Bugs and issues found (and what was done)

### Fixed: these broke features or wasted resources
| # | Where | Problem | Fix |
|---|---|---|---|
| 1 | B2 `kick` | A new `client.on('message')` listener was added **inside** the message handler, so one listener leaked per message. Memory grew forever and one `kick` eventually ran N times. | A single handler. A test checks the listener count stays at 1. |
| 2 | B1 `livesupport` | Each accepted session added a permanent `message` listener that was never removed. | The listener is removed on `close` or after 24 h. |
| 3 | B1 `help` | Reaction collectors used `timer` (invalid) so they **never ended**, and page state was shared by all users. | `time: 120000`, page is per call. |
| 4 | B1 13 commands | `hasPermission("ADMİNİSTRATOR")` (Turkish İ) throws, so those commands always crashed. | Spelled `ADMINISTRATOR`. |
| 5 | B1 `swear` | Toggled `serverayar.kufur_koruma` but the filter reads `sunucuayar.kufur_koruma`, so the swear filter could never be switched on. | Same key everywhere. |
| 6 | B1 edit swear filter | `let kufur = …` shadowed the word list, so the filter on edited messages always failed silently. | Fixed. |
| 7 | B1 vanity guard | Called `request()` (never imported) with an undefined token and a wrong endpoint, so it crashed on every vanity change. | Uses the built-in `fetch` with `PATCH /guilds/{id}/vanity-url`. |
| 8 | B1 `dm` | `if (id === "a", "b")` (comma operator) is always true, so **anyone** could make the bot DM anyone. | Real check: owner or `770552876937248768`. |
| 9 | B1 `ip`, `reboot`, `yetkili`, `toplantı` | Wrong parameter order / undefined variables (`embed` used before declaration, `db`/`moment` taken from parameters, `.wsend`, `client.unloadCommand`, config paths that don't exist, owner id `""`). These commands could never work. | Minimal fixes so each works as written. |
| 10 | B1 12 commands | Declared `(client, message, args, author, channel, guild)` but received `embed` as 4th argument. | Signatures aligned (`_embed`). |
| 11 | B1 `apply` | Application answers were read from the wrong positions (answer 2 skipped, last one empty). The "applications closed" check read `base verbs` while `application-status` wrote `basvurbilgi`. | Correct positions and key. |
| 12 | B1 applications | Deleted `basvuru.<id>` while the data was stored as `basvur.<id>` (never cleaned up). | Cleans the right key after a decision. |
| 13 | B1 tickets | Leave cleanup deleted `destekkanal_${data.id}` (always undefined). | Correct key. |
| 14 | B1 banned tag | `.replace(tag)` puts the text "undefined" into nicknames. It also scanned all members every 5 s. | `.replace(tag, '')`, event-driven. |
| 15 | B1 button "Activity" | Removing the Event role removed the **Giveaway** role instead. | Removes the Activity role. |
| 16 | B1 `addroleall` | One missing member made the 1.5 s interval retry the same member forever. | Skips and continues. |
| 17 | B1 DM log | `setThumbnail(client.user.avatarURL)` passed a function, and an empty message (attachment only) throws. | Fixed. |
| 18 | B2 `#qastatus` | Used `require('./qadata.json')` (cached), so counts never updated after `#addqa`. The file was also re-read from disk on **every message**. | In-memory store, live counts. |
| 19 | B2 `#addqa` | Split on every colon, so the answer "Fajr is at 5:30" was saved as "Fajr is at 5". | Splits on the first colon only. An empty answer is refused. |
| 20 | B2 prefix-less matching | `startsWith` meant "warning…", "information…", "muted" and "kicked" triggered commands. | The first word must match. Exact-text triggers stay exact. |
| 21 | B2 crashes in DMs | `message.member` is null in DMs. | Guild-only commands are skipped in DMs (`help` still works in DMs, as before). |
| 22 | All | Three tokens, three Express servers, about 9 `message` listeners in B1 alone, and errors thrown inside handlers became unhandled rejections. | One client, no web server, one listener per event, every feature isolated. |
| 23 | B1 `!fakeparticipate` | Any user could re-run the welcome flow on themselves (resets roles/nickname). | Owner-only. |

### Removed, and why (none of these did anything)
* **"DDoS region switch"**: it relied on `client.ping` (undefined in v12) and `guild.channels.find` (v11 API). Discord also removed server regions. It never ran.
* **Bot self-deaf loop** (`events/voiceStateUpdate.js`): it set self-deaf to `false` only when it was already `false`, a no-op that could also trigger itself again.
* **Hourly "tag ping"**: the channel and role IDs were empty strings, so it never sent anything.
* **Per-channel snipe copy**: stored but never read by any command. The format `#snipe` reads is kept.

### Behaviour kept on purpose (Phase 2 candidates, only with your approval)
* The command anti-abuse block (`bot.cooldown`) never worked in the original (it compared a boolean to `8`). It is now implemented correctly but **off by default** (`bot.antiSpamBlock: false`), so nothing changes for users.
* Ad protection only checked **edited** messages in the original. Checking new messages too is available as `bot.adProtectionOnNewMessages` (off by default).
* AFK time is stored per server, not per user (`afktime_<guild>`). This is original behaviour.
* Several config values are empty in the original `config.json` (e.g. `buttons.giveaway`, `roles.ticketdestek`, `ytv.basvurkategori`, `ytv.onayred`, `registration.GuilDTag`). The related features stay inactive until you fill them in.
* New keys (empty by default) were added for commands that referenced missing config: `ytv.ilkrol`, `yetkili.*`, `channels.mazaretliLogChannel`, `sahipRolu`.
* The `#help` text lists a few commands that do not exist in the code (e.g. `alarm`, `say`). This is original text.

### Known limitations / risks
* **discord.js v12** was kept so that all 87 commands behave exactly as before; moving to a newer version means rewriting every command.
  I checked live on Discord's servers today: gateway and REST **v6/v7 still accept connections**. But they are deprecated and Discord can switch them off without notice. Migrating to discord.js v14 is the recommended Phase 2 item.
* **Voice:** Discord now requires newer voice encryption that v12 does not support, so "bot sits in voice channel" will most likely log a warning and not join. Nothing else depends on it.
* **Privileged intents:** in the Discord Developer Portal enable **Server Members**, **Presence** and **Message Content** for the bot, or member/presence features and prefix-less commands will not work.
* `discord-buttons` is an old, unmaintained package. It works with v12 and is kept as-is.
* The local `quick.db` replacement was checked against the real quick.db 7.1.3: reads match on all 2,234 seed rows, and the stored format is the same, including double-encoded strings.
  Remaining small differences don't affect any current command: `set`/`add`/`push` with a dotted key return the changed value, not the whole record, and `type()` returns `"array"` for arrays.
  Writes are saved at most 10 s later (`DB_FLUSH_MS`). A hard crash, such as a power loss, can lose up to that much. A normal stop, redeploy or `#reboot` saves everything first.
