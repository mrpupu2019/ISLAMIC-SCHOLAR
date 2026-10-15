# Unified ISLAMIC SERVER Discord Bot: complete guide (A to Z)

This one document explains **everything** about this project:
what it is, how it works inside, how to set it up, how to host it (Railway, a VPS, or your own PC),
how to configure it, how to test it, how to troubleshoot it, and **how a developer or an AI assistant should safely change, add to or fix it**.

> Companion document: **[ANALYSIS.md](ANALYSIS.md)**. It covers how the three original bots worked, the full feature-to-bot map, every bug that was fixed during the merge and the known limitations.

---

## Table of contents

1. [What this project is](#1-what-this-project-is)
2. [Quick start (5 minutes)](#2-quick-start-5-minutes)
3. [Requirements](#3-requirements)
4. [Discord Developer Portal setup](#4-discord-developer-portal-setup)
5. [Project structure (every file explained)](#5-project-structure-every-file-explained)
6. [How the bot works inside (architecture)](#6-how-the-bot-works-inside-architecture)
7. [Configuration](#7-configuration)
8. [Data and storage](#8-data-and-storage)
9. [All features and commands](#9-all-features-and-commands)
10. [Hosting guide A: Railway (recommended)](#10-hosting-guide-a-railway-recommended)
11. [Hosting guide B: VPS / Linux server](#11-hosting-guide-b-vps--linux-server)
12. [Hosting guide C: your own Windows / Mac / Linux PC](#12-hosting-guide-c-your-own-windows--mac--linux-pc)
13. [Testing](#13-testing)
14. [Logs, monitoring and troubleshooting](#14-logs-monitoring-and-troubleshooting)
15. [Cost and resource use](#15-cost-and-resource-use)
16. [Developer and AI guide: how to change this bot safely](#16-developer-and-ai-guide-how-to-change-this-bot-safely)
17. [Recipes: common changes step by step](#17-recipes-common-changes-step-by-step)
18. [Known limitations and future work](#18-known-limitations-and-future-work)
19. [Security notes](#19-security-notes)
20. [FAQ](#20-faq)

---

## 1. What this project is

Three separate Discord bots were merged into **one bot, one token, one process**:

| Original bot | Short name | What it brought |
|---|---|---|
| `iscllv10allinone` | **Bot 1** | 87 `#` prefix commands (registration, penalties, stats, tickets, applications, owner tools, fun), the welcome flow, logs, swear and ad filters, buttons, and voice and message statistics |
| `isdatamod` | **Bot 2** | Prefix-less replies (`Salam`, `invite`), a Q&A database (`#addqa`), quick mod commands (`warn`, `mute`, `kick` …) and `#ta` text-to-speech |
| `autorcdc` | **Bot 3** | Automatic emoji reactions in 15 selected channels |

Key facts:
* **Language:** JavaScript (Node.js 20). **Library:** discord.js **v12.5.3**, the same version the originals used, so every command behaves exactly as before.
* **Storage:** one SQLite file (`json.sqlite`) plus one JSON file (`qadata.json`). No external database is needed.
* **Hosting:** a single small worker process with no web server and no open port.
* **Tested:** 20 offline tests, plus a live login and reply test with a real bot token.

---

## 2. Quick start (5 minutes)

```bash
# 1. get the code (unzip unified-bot.zip, or git clone your repo)
cd unified-bot

# 2. install (Node.js 20 required)
yarn install            # or: npm install

# 3. create your settings file
cp .env.example .env
#    open .env and set:
#    DISCORD_TOKEN=your-bot-token
#    DATA_DIR=./data

# 4. start
yarn start              # or: npm start

# 5. (optional) run the tests, no token needed
yarn test
```

When it works you will see:
```
INFO  storage: seeded json.sqlite into …/data
INFO  storage: seeded qadata.json into …/data
INFO  commands: 87 prefix commands, 139 aliases loaded
INFO  logged in as YourBot#1234 in 1 server(s)
```

---

## 3. Requirements

| Item | Version / note |
|---|---|
| Node.js | **20.x**. Other versions may need to rebuild `better-sqlite3`. |
| Package manager | `yarn` (a `yarn.lock` is included) or `npm` |
| OS | Linux, macOS or Windows (x64 / arm64). `better-sqlite3` ships prebuilt binaries for these. |
| Discord | A bot application with a token and the 3 privileged intents enabled (see next section) |
| Disk | About 30 MB for the code and dependencies, plus the data file (about 1 MB today) |
| RAM | About 70 MB at start, 90–150 MB in normal use |

Dependencies (in `package.json`):

| Package | Why it is needed |
|---|---|
| `discord.js@12.5.3` | The Discord client used by all original code |
| `discord-buttons@4.0.0` | Buttons for v12 (tickets, applications, role buttons, truth or dare) |
| `better-sqlite3` | The SQLite engine behind the local `quick.db` replacement |
| `quick.db` → `file:./packages/quick.db` | **Local** drop-in replacement for quick.db v7 (see §8) |
| `moment`, `moment-duration-format` | Dates and durations in many commands |
| `ms` | Human-readable durations (AFK, mutes) |

Built-in Node features are used instead of extra packages: `fetch` instead of `axios`, `snekfetch` and `superagent`, and `process.loadEnvFile` instead of `dotenv`.

---

## 4. Discord Developer Portal setup

1. Go to <https://discord.com/developers/applications> → **New Application** (or open your existing one).
2. **Bot** tab → **Reset Token** → copy the token. This is your `DISCORD_TOKEN`. Never share it.
3. On the same page, under **Privileged Gateway Intents**, turn **ON**:
   * **Presence Intent**, used by `info`, `#device`, `#audit`, `#activechk`
   * **Server Members Intent**, needed for the member cache, welcome, registration and stats
   * **Message Content Intent**, needed for **every** command and reply
   Without these the bot either cannot connect (close code 4014) or ignores messages.
4. **Installation / OAuth2 → URL Generator:** scopes `bot`; permission **Administrator** (the original bot ran with it, and many commands need to manage roles, channels, nicknames and bans).
   Open the generated link and add the bot to your server.
5. In your server, drag the bot's role **above** the roles it must give or remove (mute, jail, registration roles …). Discord does not let a bot manage roles that sit above its own role.

---

## 5. Project structure (every file explained)

```
unified-bot/
├── index.js                  Entry point: start-up order, Discord client, shutdown handling
├── config.json               All server IDs and switches (NOT secrets)
├── package.json              Dependencies and scripts (start, test)
├── yarn.lock                 Exact dependency versions
├── railway.json              Railway start command and restart policy
├── .env.example              Names of all environment variables (copy to .env)
├── .gitignore                Keeps .env, node_modules and live data out of git
├── README.md                 This guide
├── ANALYSIS.md               Analysis of the 3 original bots, feature map, bug list
│
├── src/
│   ├── core/                 Shared building blocks (used by everything)
│   │   ├── env.js            Reads environment variables (+ .env file locally)
│   │   ├── logger.js         Timestamped logs, LOG_LEVEL filter
│   │   ├── storage.js        Creates DATA_DIR, copies seed data on first run
│   │   ├── bus.js            Event bus: ONE Discord listener per event, isolated handlers
│   │   ├── commands.js       Loads every # command from src/commands at start
│   │   └── helpers.js        client.fetchUser, channel.error(), client.tick/ytick, client.isOwner
│   │
│   ├── features/             Background features: one file = one feature
│   │   ├── index.js          The FEATURES list (order + names used by DISABLED_FEATURES)
│   │   ├── presence.js       Bot status on start
│   │   ├── commands.js       # command handler, AFK, "tag" reply, Islamic reminders
│   │   ├── stats.js          Voice time + message counts (daily/weekly/…/monthly)
│   │   ├── message-log.js    Snipe store + deleted-message log channel
│   │   ├── voice-log.js      Join/leave/move/mute/deaf/stream/camera log
│   │   ├── bot-voice.js      Bot joins a voice channel on start
│   │   ├── members.js        Welcome DM, registration/suspicious flow, leave memory, re-ban
│   │   ├── tag-tracking.js   Team role when the server tag is in a username
│   │   ├── banned-tag.js     Jail members who use a banned tag
│   │   ├── role-buttons.js   !buton-rol / !buton-bilgi panels and their buttons
│   │   ├── applications.js   Approve/reject buttons for staff applications
│   │   ├── truth-or-dare.js  Truth / Dare buttons
│   │   ├── tickets.js        Ticket buttons + cleanup
│   │   ├── filters.js        Ad protection + swear filter
│   │   ├── dm-log.js         Copies DMs sent to the bot into a log channel
│   │   ├── vanity-guard.js   Bans whoever changes the vanity URL and restores it
│   │   ├── maintenance.js    Clears join/leave counters every 5 hours
│   │   ├── owner-tools.js    !fakeparticipate (owner test command)
│   │   ├── isdatamod.js      ALL Bot 2 features
│   │   └── autoreact.js      ALL Bot 3 features
│   │
│   ├── commands/             The 87 original Bot 1 "#" commands, one file each
│   │   ├── Global/ Register/ Penal/ İnfo/ Advanced/ Talent/ Owner/
│   │   └── başvuru/ (applications)  ticket/  destek/ (live support)  dc/ (truth or dare)  stat/
│   │
│   ├── content/
│   │   ├── reminders.json    The 43 Islamic reminders (Bengali + English)
│   │   └── truth-or-dare.json Dares and truths lists
│   └── kufurler.json         Swear word list for the swear filter
│
├── packages/quick.db/        Local quick.db v7-compatible store (index.js + package.json)
│
├── data/
│   ├── seed/json.sqlite      Original Bot 1 data (2,222 rows) – copied once into DATA_DIR
│   └── seed/qadata.json      Original Bot 2 Q&A (59 entries) – copied once into DATA_DIR
│
└── test/
    ├── helpers.js            Fake Discord objects (client, guild, member, message, channel)
    ├── quickdb.test.js       Storage compatibility tests
    ├── commands.test.js      All 87 commands load; no removed dependencies remain
    └── features.test.js      Feature behaviour tests (Bot 1, 2, 3 + error isolation)
```

---

## 6. How the bot works inside (architecture)

### 6.1 Start-up order (`index.js`)
1. `src/core/env.js` reads environment variables. If a `.env` file exists, it is loaded first, which is useful locally. On Railway you use Variables instead.
2. `src/core/storage.js` creates `DATA_DIR`. If `json.sqlite` or `qadata.json` is missing there, it copies the file from `data/seed/`. It then sets `QUICKDB_PATH` so the database lives inside `DATA_DIR`.
3. The discord.js client is created with:
   * `fetchAllMembers: true`, so every member is cached (many commands count or filter members)
   * `messageCacheMaxSize` (default 100 per channel), plus a 6-hour lifetime and a 30-minute sweep to limit memory
4. `discord-buttons` is installed on the client, and `client.config = config.json`.
5. `src/core/helpers.js` adds the shared helpers.
6. `src/core/commands.js` loads all `src/commands/*/*.js` into `client.commands` and `client.aliases`.
7. `src/core/bus.js` creates the **event bus**, and `src/features/index.js` registers every feature on it.
8. Process safety: `unhandledRejection` and `uncaughtException` are logged (the bot keeps running). `SIGTERM`/`SIGINT` save the data, then exit cleanly.
9. `client.login(DISCORD_TOKEN)`. If the token is missing or wrong, the process exits with code 1 and a clear message.

### 6.2 The event bus (`src/core/bus.js`): the most important idea
```
Discord gateway ──► client.on('message') ──► bus.dispatch ──► commands.js handler   (try/catch)
                      (ONE listener)                     ├─► stats.js handler      (try/catch)
                                                         ├─► filters.js handler    (try/catch)
                                                         ├─► isdatamod.js handler  (try/catch)
                                                         └─► autoreact.js handler  (try/catch)
```
* Every feature registers with `bus.on(eventName, featureName, handlerFn)`.
* The bus attaches **exactly one** discord.js listener per event name, no matter how many features use it.
* Each handler runs in its own `try/catch`, and returned promises get a `.catch`. A crash in one feature is logged as
  `ERROR [featureName] eventName failed: …` and **all other features still run**.
* Features never call `client.on(...)` directly (exception: `livesupport` adds a temporary relay listener and removes it again).

### 6.3 Feature module contract
Every file in `src/features/` exports one function:
```js
module.exports = (bus, { client, config, env, paths }, name) => {
  bus.on('message', name, async (message) => { /* … */ });
};
```
* `bus` is used to subscribe to Discord events.
* `client` is the discord.js client. `config` is the parsed `config.json`. `env` is from `src/core/env.js`. `paths.qaFile` is the path to `qadata.json`.
* `name` is the feature's name from the list in `features/index.js`. Pass it to `bus.on` so logs show which feature failed.

### 6.4 Prefix command contract (`src/commands/<Category>/<file>.js`)
```js
module.exports = {
  name: 'example',              // the main trigger: #example
  aliases: ['ex', 'eg'],        // extra triggers: #ex, #eg
  owner: false,                 // optional: true = only config.bot.owner may use it
  guildowner: false,            // optional: true = bot owner or server owner only
  execute: async (client, message, args, embed, author, channel, guild) => { … },
};
```
The handler (`src/features/commands.js`) does the following:
1. Ignores DMs, bots and messages without a member.
2. Replies to `tag` / `.tag` / `!tag`, counts chat messages for the Islamic reminder, and handles AFK.
3. If the message starts with `config.bot.prefix` (`#`), it finds the command by name or alias and checks `owner`/`guildowner`. If `bot.antiSpamBlock` is on, it also checks for command spam.
4. Calls `execute(...)` with a ready-made `embed` (member colour, name and footer). If the command throws, the error is logged and the user sees *"Sorry, something went wrong while running that command."*, which is deleted after 10 seconds.

### 6.5 Prefix-less commands (Bot 2, `src/features/isdatamod.js`)
* **Exact-text triggers:** the greetings, `invite`/`Invite`/`invt`, `help`/`Help`, `Command`/`cmd`, `#qastatus`, and any Q&A question (exact text).
* **First-word triggers:** `info`, `nickname`/`Nickname`/`nik`, `warn`, `mute`, `unmute`, `kick`, `bannow`/`Bannow`, `verifygirl`, `removegirl`, `#addqa`, `#removeqa`, `#ta`.
* The lookup tables are built with `Object.create(null)`, so words like `constructor` or `__proto__` can never match.
* Messages from the bot itself are ignored, so a Q&A answer can never trigger itself in a loop.

---

## 7. Configuration

There are two places to configure the bot. **Secrets only go in environment variables.**

### 7.1 Environment variables (`.env` locally, *Variables* on Railway)
| Variable | Required | Default | Meaning |
|---|---|---|---|
| `DISCORD_TOKEN` | **yes** | none | Bot token. The old names `token` and `TOKEN` also work. |
| `DATA_DIR` | yes in production | `./data` | Folder for `json.sqlite` and `qadata.json`. On Railway, point it at the volume (e.g. `/data`). |
| `LOG_LEVEL` | no | `info` | `debug`, `info`, `warn` or `error` |
| `DISABLED_FEATURES` | no | empty | Comma list of feature names to switch off, e.g. `autoreact,voice-log` |
| `DB_FLUSH_MS` | no | `10000` | How often (ms) pending database changes are saved |
| `MESSAGE_CACHE_SIZE` | no | `100` | Messages kept per channel (used by snipe and the delete log) |

Feature names for `DISABLED_FEATURES`: `presence, commands, stats, message-log, voice-log, bot-voice, members, tag-tracking, banned-tag, role-buttons, applications, truth-or-dare, tickets, filters, dm-log, vanity-guard, maintenance, owner-tools, isdatamod, autoreact`.

### 7.2 `config.json` (server IDs and switches, safe to commit)
To get an ID in Discord, turn on *User Settings → Advanced → Developer Mode*, then right-click a server, channel, role or user and choose **Copy ID**. An empty string `""` means "not set", and the related feature quietly does nothing.

| Section | Keys | Used by |
|---|---|---|
| `bot` | `owner` (your user ID), `prefix` (`#`), `BotStatus` (status text), `guildVanityURL`, `footer`, `name`, `cooldown` (spam limit), `iltifatsize` (messages between Islamic reminders, 100), `presenceStatus` (`dnd`/`online`/`idle`), `antiSpamBlock` (false), `adProtectionOnNewMessages` (false) | everything |
| `Guild` | `GuildID` (main server), `GuilDName`, `GuildOwnerRole` | tag tracking, banned tag, applications |
| `penals` | `ban/jail/mute/warn` → `staff` role, `roles` (jail/mute role), `log` channel, `limit`; `points` per penalty | Penal commands |
| `logs` | `messagelog`, `voicelog`, `taglog`, `etiketlog`, `levellog` | log features |
| `roles` | `boosterrole`, `viprole`, `musiciansrole`, `designerrole`, `streamer`, `sponsored`, `team` (tag role), `ticketdestek` (ticket support role), `katildiRole`/`uyariRole`/`mazaretliRole` (meeting) | Talent, tickets, `#toplantı` |
| `channels` | `chat` (main chat, used for reminders), `voicechannel` (bot joins it), `welcomechannel`, `botdmlog`, `rules`, `urlguardlog`, `toplantiSesChannel`, `liveSupport`, `mazaretliLogChannel`, `selfRolesChannel` | many |
| `registration` | `unregistered` role, `man`/`woman` role lists, `staff` role, `GuilDTag` (server tag), `autonickname`, `suspecios` (suspicious role), `suspecchannel`, `minage` … | Register commands, welcome |
| `ytv` | staff-application and rank roles: `yetkilialım`, `yetkiverilecek`, `adminrol`, `basvurkategori`, `onayred`, `yetkililog`, `everyoneid`, `ilkrol` … | applications, `#yetkili` |
| `yetkili` | `yetkirol` … `yetkirol4` (rank roles for `#yetkili yetki2..4`) | `#yetkili` |
| `buttons` | `giveaway`, `activity` role IDs | role buttons |
| `emojis` | `yes`, `no` … | reactions in commands |
| `welcomeDm` | `enabled`, `image`, `footerIcon` | welcome DM |
| `isdatamod` | `modRole`, `ownerRole` (kick/bannow), `qaStatusRole`, `muteRole`, `girlVerifierRole`, `girlRole`, `inviteLink`, `footer`, `randomNicknames` | Bot 2 |
| `autoreact` | `channels` (list of channel IDs), `emojis` (list of `<:name:id>` or unicode) | Bot 3 |
| `sahipRolu` | role allowed to use `#move` | `#move` |

After editing `config.json`, **restart the bot** (on Railway, a redeploy or *Restart*).

---

## 8. Data and storage

### 8.1 Where data lives
| File (in `DATA_DIR`) | Content |
|---|---|
| `json.sqlite` (+ `-wal`, `-shm`) | All Bot 1 data: penalties, records, points, saved roles/names, AFK, snipe, tickets, applications, settings (`sunucuayar` table), voice and message stats tables |
| `qadata.json` | Bot 2 Q&A: `{ "question": "answer", … }` |

### 8.2 The local `quick.db` (`packages/quick.db/index.js`)
The original code calls `require("quick.db")` about 65 times. Instead of changing all of those calls, the project ships its own **drop-in replacement** under the same package name:
* **Same API:** `get/fetch`, `set`, `add`, `subtract`, `push`, `delete`, `has`, `all`, `math`, `type`, `startsWith`, `includes`, and `new db.table('name')`. Dotted keys work the same way: `db.set('snipe.123', {...})` saves the object under `123` inside the `snipe` record.
* **Same file format** as quick.db 7 (tables with `ID TEXT, json TEXT`, strings double-encoded). This was checked against the real quick.db 7.1.3: all 2,234 seed rows read identically.
* **Faster:** each table is loaded into memory once. Reads come from memory (as copies, so callers can't change the cache by accident). Writes update memory and are **saved together** every `DB_FLUSH_MS` (10 s) in one transaction. Nothing is written while the bot is idle.
* **Safe shutdown:** `db.close()` saves everything. It runs on SIGTERM/SIGINT (Railway redeploys and restarts) and before `#reboot`.
* **Crash window:** after a hard kill (for example a power loss) at most the last 10 s of changes are lost. Lower `DB_FLUSH_MS` if this matters to you.
* **Q&A file:** kept in memory and written atomically (to a temp file, then renamed), so it can never be half-written.

### 8.3 Backup and restore
* **Backup:** stop the bot (or accept up to 10 s of unsaved changes), then copy `json.sqlite` and `qadata.json` from `DATA_DIR`.
  On Railway: service → Volume → *Backups* (if your plan offers it), or temporarily attach the volume to a shell service.
* **Restore or migrate from the old bots:** put the files into `data/seed/` **before the first start** with an empty `DATA_DIR`, or copy them straight into `DATA_DIR` while the bot is stopped.
* **Inspect data:** `sqlite3 json.sqlite "SELECT ID, substr(json,1,80) FROM json LIMIT 20;"`

### 8.4 Important data keys (for debugging)
| Key pattern | Meaning |
|---|---|
| `roles_<userId>`, `name_<userId>` | Roles and name saved when the member left |
| `record_<userId>`, `points_<userId>` | Penalty history and points |
| `user_/nick_/sebep_<userId>_<guildId>`, `afktime_<guildId>` | AFK state |
| `snipe.<guildId>` | Last deleted message |
| `destekkanal_<channelId>` / `destekkullanıcı_<userId>` | Ticket ↔ user link |
| `basvur.<messageId>`, `basvurbilgi` | Pending application; applications closed flag |
| `ban.<userId>` / `tban_<userId>` | Permanent / temporary ban to re-apply on unban |
| `bannedtag_<guildId>` | Banned username tag |
| table `sunucuayar`: `sunucuayar.reklam_koruma`, `sunucuayar.kufur_koruma` | Ad and swear protection on/off |
| tables `stats`, `stats_daily`, `stats_week`, `stats_two_week`, `stats_three_week`, `stats_month`, `mstats_*` | Voice ms and message counts |

---

## 9. All features and commands

### 9.1 `#` prefix commands (Bot 1)
Type `#help` in Discord for the paged list. There are 87 commands in all:

| Folder | Commands (aliases) |
|---|---|
| Global | `help` (h, hlp), `afk`, `age`, `analyse`, `avatar` (pp), `banner`, `booster`, `device` (chz), `dm`, `fortune`, `info` (profil, my-stats), `link`, `vipisim` (vipnick), `where` (ss, n) |
| Register | `male` (e, boy, man), `woman` (female), `setname` (ke, kboy, kman), `recordwoman` (kk, rwoman), `agename` (i, nickname), `unregistered` (unreg, ks), `suspicious`, `disconnect` (voicekick) |
| Penal | `ban`, `unban`, `tmban`, `jail` (tjail, karantina), `unjail` (uj), `mute` (sustur), `unmute`, `vmute`, `unvmute`, `warn` (uyarı, uyar), `vckick` (sk, kes), `user-reset` |
| İnfo | `warns`, `record`, `ban-info`, `oldname` (names), `top-record`, `banlist`, `registration-officer`, `register-number` (teyitler) |
| Advanced | `audible`, `delete` (sil), `delete2`, `powers`, `authorized-call` (call, ytcall), `ad-scan`, `snipe`, `tagliste`, `roleless` (rolsuz), `tagal`, `move` (topluçek), `audit` (roleplay, rb), `lock` |
| Talent | `special` (vip), `designer`, `musician`, `sponsor`, `streamer`, `tagged` |
| Owner | `eval`, `reboot`, `voting` (anket), `toplantı`, `audiochk`, `activechk`, `yetkili` (ytv), `swear`, `adprotection`, `ip`, `limited-role`, `sound-draw` (çekiliş), `addroleall`, `removeroleall`, `trusted`, `taginfo`, `dmrole-message` |
| başvuru | `apply` (başvur), `application-status`, `başvuruyardım` (byardım), `apply-ban` |
| other | `ticket`, `livesupport`, `td` (truth or dare), `stats` (vme), `top10` |

Owner panels (exact text, `config.bot.owner` only): `!buton-rol`, `!buton-bilgi`, `!fakeparticipate`.
Toggles: `#swear on/off` (swear filter), `#adprotection on/off` (link filter).

### 9.2 Prefix-less commands (Bot 2)
| Type this | Who | What happens |
|---|---|---|
| `Salam`, `salam alaikom`, `Assalamu Alaikum`, `alaikum assalam` | everyone | Islamic greeting reply |
| `invite`, `Invite`, `invt` | everyone | Server invite link |
| `help` / `Help` | everyone (also in DMs) | "Need help?" box |
| any saved Q&A question (exact text) | everyone | Saved answer |
| `Command` / `cmd` | mod role | Mod command list |
| `info @user` | mod role | User info (ID, joined, created, mobile/desktop) |
| `nickname` / `Nickname` / `nik` `@user [name]` | mod role | Set nickname (random Muslim name if empty) |
| `warn @user reason` | mod role | DMs the warning |
| `mute @user` / `unmute @user` | mod role | Adds / removes `isdatamod.muteRole` |
| `kick @user` | `isdatamod.ownerRole` | Kick |
| `bannow @user` / `Bannow @user` | Ban Members permission or owner role | Ban |
| `verifygirl @user` / `removegirl @user` | `girlVerifierRole` | Adds / removes `girlRole` |
| `#addqa Question: Answer` | mod role | Adds a Q&A pair (only the first `:` splits) |
| `#removeqa Question` | mod role | Removes a Q&A pair |
| `#qastatus` | `qaStatusRole` | Q&A counts |
| `#ta text` / `#ta text bangla` | mod role | Sends an MP3 (Google TTS, English or Bangla) |

### 9.3 Automatic features
Welcome DM and registration/suspicious welcome · team role for tagged names · banned-tag jail · voice and message stats ·
deleted-message log + snipe · voice log · DM log · swear filter · ad filter (edited messages) · vanity URL guard ·
ticket cleanup · re-ban on unban · Islamic reminder every 100 chat messages · AFK · auto-reactions (Bot 3) · 5-hour counter cleanup.

---

## 10. Hosting guide A: Railway (recommended)

1. **Put the code on GitHub:** create a private repository and upload the `unified-bot` folder contents (`package.json` must be at the repo root).
   `.gitignore` already keeps out `.env`, `node_modules` and live data. `data/seed/` **is** uploaded.
2. **Create the service:** <https://railway.com> → **New Project → Deploy from GitHub repo** → pick the repo.
   Railway detects Node 20 from `package.json` (`engines`) and installs dependencies. `railway.json` sets
   `startCommand: node --max-old-space-size=256 index.js` and *restart on failure* (up to 10 times).
3. **Add a volume (do not skip):** service → **Settings → Volumes → + New Volume**, mount path `/data`.
4. **Set Variables:** service → **Variables → New Variable**:
   * `DISCORD_TOKEN` = your token
   * `DATA_DIR` = `/data`
   * optional: `LOG_LEVEL=info`, `DISABLED_FEATURES=…`
5. **One replica, no domain:** *Settings → Deploy → Replicas = 1*. Do **not** generate a public domain; the bot needs no port.
6. **Deploy** (it happens automatically after you save the variables) → open **Deployments → View Logs** and look for `logged in as …`.
7. **Turn off the three old bots** (stop them or reset their tokens) so members don't get double replies.
8. **Updating later:** push to GitHub → Railway redeploys. The bot saves its data on SIGTERM before the new version starts. The volume keeps the data.
9. **Changing settings:** edit `config.json` → push, or change Variables → Railway restarts the service.

---

## 11. Hosting guide B: VPS / Linux server

```bash
# Ubuntu/Debian example
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g yarn pm2

git clone <your-repo> unified-bot && cd unified-bot
yarn install --production
cp .env.example .env && nano .env      # DISCORD_TOKEN=…  DATA_DIR=/home/<you>/unified-bot/data

pm2 start index.js --name unified-bot --node-args="--max-old-space-size=256"
pm2 save && pm2 startup                 # start again automatically after a reboot
pm2 logs unified-bot                    # watch logs
```
Update: `git pull && yarn install --production && pm2 restart unified-bot`.
PM2 sends SIGINT on restart, so the data is saved first.

systemd alternative (`/etc/systemd/system/unified-bot.service`):
```ini
[Unit]
Description=Unified Discord bot
After=network-online.target
[Service]
WorkingDirectory=/home/bot/unified-bot
ExecStart=/usr/bin/node --max-old-space-size=256 index.js
EnvironmentFile=/home/bot/unified-bot/.env
Restart=on-failure
User=bot
[Install]
WantedBy=multi-user.target
```
`sudo systemctl enable --now unified-bot` · logs: `journalctl -u unified-bot -f`.

---

## 12. Hosting guide C: your own Windows / Mac / Linux PC

1. Install **Node.js 20 LTS** from <https://nodejs.org>.
2. Unzip the project, open a terminal in the folder, and run `npm install`.
3. Copy `.env.example` to `.env` and fill in `DISCORD_TOKEN` and `DATA_DIR=./data`.
4. Run `npm start`. Keep the window open (the bot stops when the PC sleeps or shuts down).

---

## 13. Testing

```bash
yarn test        # = node --test test/
```
* **20 offline tests, no token needed.** They use fake Discord objects from `test/helpers.js` and a temporary database, so they never touch real data.
  * `quickdb.test.js`: reads the real seed data, uses the same API, keeps string IDs as strings after a restart, saves in batches
  * `commands.test.js`: all 87 commands load; no removed dependency or bad permission name is left
  * `features.test.js`:
    * no listener leaks
    * Bot 2 greetings, invite, help in DMs, Q&A, `#ta` exact match, mute permissions, built-in object names ignored
    * Bot 3 reactions
    * Bot 1 command arguments and a failing command being contained
    * stats, the swear and ad filters, and the owner-only command
    * event bus isolation
* `ERROR … kaboom` / `sync crash` lines in the test output are **expected**: those tests check that errors are contained.
* **Live smoke test (optional):** with the bot running, write in a channel: `Salam` → "Walaikum assalam", `invite` → link, `#help` → help pages, `#avatar` → your avatar.

**Rule for anyone changing code: run `yarn test` before deploying. All tests must pass.**

---

## 14. Logs, monitoring and troubleshooting

Log format: `2026-06-15T10:00:00.000Z INFO  message`. Errors and warnings go to stderr, everything else to stdout.

| Log line / symptom | Meaning | Fix |
|---|---|---|
| `DISCORD_TOKEN is not set` | No token | Add the variable, then restart |
| `login failed: An invalid token was provided` | Wrong or reset token | Copy a new token from the Developer Portal |
| Disconnect with code 4014 | Privileged intents are off | Turn on the 3 intents (§4) |
| Bot online but ignores everything | Message Content intent is off, or the bot can't see the channel | §4 + channel permissions |
| `DATA_DIR is not set: data will be lost …` | No volume on Railway | Add a volume + `DATA_DIR` |
| `ERROR [feature] event failed: Missing Permissions` | The bot's role is too low or lacks a permission | Move the bot's role up / give permissions |
| `ERROR [commands] #x failed: …` | A command threw an error. The user saw "Sorry, something went wrong" | Read the stack trace and fix that command file |
| `could not join voice channel` | discord.js v12 voice no longer works with Discord | Expected. Set `channels.voicechannel` to `""` to stop trying |
| `rate limited: …` | Discord slowing down a burst of requests | Normal. discord.js waits and retries |
| Replies twice | Two copies are running (replicas, or an old bot) | Keep exactly one |
| Q&A answer not found | Q&A needs the exact text (case-sensitive) | `#addqa` with the exact wording |
| Data gone after a redeploy | No volume, or the wrong `DATA_DIR` | §10 step 3/4 |

Debug mode: `LOG_LEVEL=debug`. Memory and CPU: Railway service → **Metrics**, or `pm2 monit` on a VPS.

---

## 15. Cost and resource use

Measured:
* **Memory:** about 70 MB right after login (in 7 servers). Expect 90–150 MB in a busy server with a few thousand members.
* **CPU:** about 23 µs per message through all features. Each batched save takes about 7 ms and only runs after changes.
* **Background work:** one gateway WebSocket, a save timer (only after changes) and a 5-hour cleanup timer. Nothing polls.

Why the gateway and not webhooks: the bot needs live message, voice and member events, which Discord only pushes over the gateway. Interaction webhooks cannot deliver them, so one gateway connection is already the cheapest option.

Railway estimate: **about $1–3 per month** of usage (mostly RAM) plus a few cents for a small volume. This usually fits inside the Hobby plan's included usage. Check Railway's pricing page.

Ways to lower it further:
* 1 replica, no public domain
* `DISABLED_FEATURES` for features you don't use
* a smaller `MESSAGE_CACHE_SIZE` (e.g. 50)
* the heap cap `--max-old-space-size=256` (already set)

---

## 16. Developer and AI guide: how to change this bot safely

**If you are an AI assistant or a new developer, read this section before editing anything.**

### 16.1 Golden rules
1. **Keep discord.js v12 APIs** (e.g. `message.channel.send(embed)`, `member.hasPermission('X')`, `channel.type === 'text'`, `voice.channelID`, `x.delete({ timeout })`). Do **not** write v13/v14 code (`{ embeds: [] }`, `EmbedBuilder`, `messageCreate`, `GatewayIntentBits`): it will not work with this project. A migration is a separate, planned project (§18).
2. **Use the bus, never `client.on` in features:** `bus.on(event, name, fn)`. This keeps one listener per event and isolates errors.
3. **Never hard-code IDs or secrets.** IDs go in `config.json`, secrets in environment variables (`.env` / Railway Variables), and every new variable also goes in `.env.example`.
4. **Use `require('quick.db')` for data.** Do not add another database. Keep the key naming style (`thing_<userId>` or `thing.<guildId>`).
5. **Guard optional things:** a channel or role from config may be `""` or missing. Check `if (!channel) return;` before using it, and add `.catch(() => {})` to Discord calls that may fail (DMs, deleting messages, role changes).
6. **Keep it cheap:** no `setInterval` that scans all members, no polling, no new web server, no heavy packages (canvas, puppeteer …). Prefer events. Timers must be rare and call `.unref()`.
7. **Do not edit `data/seed/` on a live system** to change data. It is only used when `DATA_DIR` is empty.
8. **Run `yarn test` after every change, and add a test** for any new behaviour in `test/features.test.js`, using the fakes in `test/helpers.js`.
9. **Keep files small and single-purpose:** one feature per file in `src/features/`, one command per file in `src/commands/<Category>/`.
10. **Document the change:** update this README (commands table, config table) and, for behaviour changes or fixes, add a line to `ANALYSIS.md`.

### 16.2 Where to put what
| You want to… | Put it in |
|---|---|
| Add a `#` command | New file in `src/commands/<Category>/` (loaded automatically) |
| Add a prefix-less command or reply | `src/features/isdatamod.js` → the `COMMANDS` map (or `GREETINGS` for exact replies) |
| React to a Discord event (join, leave, edit, voice …) | New file in `src/features/` + add its name to `FEATURES` in `src/features/index.js` |
| Add a button | Create it with `discord-buttons` (`new MessageButton().setID('my-id')`) and handle it in a feature with `bus.on('clickButton', name, btn => { if (btn.id !== 'my-id') return; … })` |
| Add a setting | `config.json` (IDs and switches) or `src/core/env.js` + `.env.example` (secrets and runtime values) |
| Add text lists | `src/content/*.json` |
| Add a scheduled job | A feature with `bus.on('ready', …)` → `setInterval(fn, ms).unref()`. Keep the interval long (hours). |

### 16.3 Useful objects inside commands and features
* `client.commands` / `client.aliases` are the loaded commands. `client.config` is the config.
* `client.isOwner(userId)` returns true for `config.bot.owner`.
* `channel.error(message, text)` sends an error embed that deletes itself after 10 s.
* `client.fetchUser(id)` returns a user or `undefined`.
* `require('quick.db')` gives the default table, and `new (require('quick.db').table)('name')` gives a named table.
* `require('../core/logger')` gives `log.info/warn/error/debug(...)`.

### 16.4 Checklist before you deploy a change
- [ ] `yarn test` passes (20+ tests)
- [ ] `node --check` passes for each changed file
- [ ] No new hard-coded IDs or tokens
- [ ] New config keys are added to `config.json`, and new env vars to `.env.example`
- [ ] README tables updated
- [ ] Ran it locally once (`yarn start`) and saw `logged in as …`

---

## 17. Recipes: common changes step by step

### A. Add a new `#` command
Create `src/commands/Global/ping.js`:
```js
module.exports = {
  name: 'ping',
  aliases: ['latency'],
  execute: async (client, message, args, embed) => {
    message.channel.send(embed.setDescription(`Pong! ${client.ws.ping} ms`));
  },
};
```
Restart the bot, then type `#ping`. Add it to `src/commands/Global/help.js` (the `pages` texts) and to §9.1. The test in `commands.test.js` expects exactly 87 commands, so update that number.

### B. Add a prefix-less reply (Bot 2 style)
In `src/features/isdatamod.js`, add a line to the `GREETINGS` map (exact text → reply):
```js
'Jazakallah': 'Wa iyyakum',
```
For a command with arguments, add `myword: (message, args) => …` to `COMMANDS`. Use `modOnly(fn)` if it needs the mod role.

### C. Add a new background feature
1. Create `src/features/welcome-react.js`:
```js
module.exports = (bus, { config }, name) => {
  bus.on('guildMemberAdd', name, async (member) => {
    const channel = member.guild.channels.cache.get(config.channels.welcomechannel);
    if (!channel) return;
    const msg = await channel.send(`Welcome ${member}!`);
    await msg.react('👋').catch(() => {});
  });
};
```
2. Add `'welcome-react'` to the `FEATURES` list in `src/features/index.js`.
3. Add a test in `test/features.test.js`, then run `yarn test`.

### D. Add or remove auto-reaction channels or emojis
Edit `config.json` → `autoreact.channels` / `autoreact.emojis`, then restart. Custom emojis use the format `<:name:id>` (the bot must be in the server that owns the emoji).

### E. Change who counts as a moderator for Bot 2 commands
`config.json` → `isdatamod.modRole` (and `ownerRole`, `qaStatusRole`, …).

### F. Turn a feature off without code
Set `DISABLED_FEATURES=autoreact,dm-log` and restart.

### G. Turn on the optional switches
`config.json` → `bot.antiSpamBlock: true` (blocks users who run more than `bot.cooldown` commands in 5 minutes, until the next restart).
`bot.adProtectionOnNewMessages: true` (the link filter also checks new messages, not only edited ones).

### H. Change the Islamic reminders or Truth-or-Dare lists
Edit `src/content/reminders.json` / `src/content/truth-or-dare.json` (keep them valid JSON arrays). `bot.iltifatsize` sets how many chat messages pass between reminders.

### I. Fix a bug reported in the logs
1. Find the log line: `ERROR [featureName] event failed: <stack>` or `ERROR [commands] #cmd failed: <stack>`.
2. The stack trace gives the file and line. Commands live in `src/commands/**`, features in `src/features/<featureName>.js`.
3. Reproduce it in a test with `test/helpers.js` (`makeMessage`, `makeMember`, `makeGuild`), fix it, run `yarn test`, then deploy.

---

## 18. Known limitations and future work
* **discord.js v12 is old.** Discord still accepts its gateway and API (checked live in June 2026), but they are deprecated and could be switched off. **Recommended next step:** migrate to discord.js v14. That means converting every command and feature to the new API (embeds, permissions, events, buttons).
* **Voice:** the "bot stays in a voice channel" feature doesn't work on v12 any more, because Discord changed voice encryption.
* `discord-buttons` is unmaintained. It works with v12 today and would be replaced by native buttons in v14.
* Some original texts mix Turkish and English, and some help entries list commands that don't exist (`alarm`, `say`). These are kept as in the original.
* AFK time is stored per server, not per user (original behaviour).
* Several `config.json` values are empty in the original config. Those features stay inactive until you fill them in (see ANALYSIS.md).

---

## 19. Security notes
* **Never commit `.env` or a token.** If a token was shared (chat, screenshot, git), **reset it** in the Developer Portal.
* `#eval` runs any code and is limited to `config.bot.owner`. Keep that ID correct, or delete `src/commands/Owner/eval.js` if you don't need it.
* `#dm` is limited to the owner plus one extra ID (`770552876937248768`) set in the command file.
* Owner panels (`!buton-rol`, `!buton-bilgi`, `!fakeparticipate`) are owner-only.
* The bot only stores Discord IDs, names and moderation data, and only in your own `DATA_DIR`.

---

## 20. FAQ
**Do I need a database server?** No. SQLite is one file inside `DATA_DIR`.

**Can I run it in more than one server?** Yes. Features tied to `config.Guild.GuildID` and the configured channels and roles only act in that main server, while general commands work everywhere.

**Why do `#` commands ignore other bots and webhooks?** That is the original behaviour, to prevent loops and abuse.

**Can I change the prefix?** Yes: `config.json` → `bot.prefix`. The prefix-less Bot 2 commands are not affected.

**Where do I change the bot status text?** `config.json` → `bot.BotStatus` and `bot.presenceStatus`.

**How do I move to another host?** Copy `json.sqlite` and `qadata.json` from the old `DATA_DIR` into the new one, set the same variables, and start the bot.
